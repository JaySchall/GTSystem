const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = process.env.PORT || 8080;
app.use(cors());
app.use(express.json()) //For JSON requests
app.use(express.urlencoded({ extended: true }));

const db = new sqlite3.Database('tournament.db');


// Helper functions 

const User = {
  find: (partialUsername) => {
    const regex = new RegExp(`^${partialUsername}`, 'i');
    const query = `%${partialUsername}%`
    return new Promise((resolve,reject) => {
      const sql = 'SELECT * FROM players WHERE user_id LIKE ? OR name LIKE ?';
      db.all(sql, [query, query], (err, rows) => {
        if(err) {
          reject(err);
        } else {
          resolve(rows);
        }
      })
    })
  }
}

function getBrackets(id) {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM brackets WHERE event_id=?', [id], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function getParticipants(eventId, bracketId) {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM participants WHERE event_id=? AND bracket_id=?', [eventId, bracketId], (err, playerRows) => {
      if (err) {
        reject(err);
      } else {
        resolve(playerRows);
      }
    });
  });
}


app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

// INSERT EVENT CALL
app.post('/api/create-event', (req, res) => {
  const { name, location, startTime, endTime, description, game, tags } = req.body;

  // Insert data into the events table
  db.run(
    'INSERT INTO events (name, location, startTime, endTime, description, game) VALUES (?, ?, ?, ?, ?, ?)',
    [name, location, startTime, endTime, description, game],
    function (err) {
      if (err) {
        console.error('Error inserting event data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } 
      const eventId = this.lastID;

      // Insert tags
      tags.forEach(tag => {
        db.get('SELECT id FROM tags WHERE name = ?', [tag], (err, row) => {
          if (err) {
            console.error('Error checking for existing tag:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
          }

          if (row) {
            // Tag already exists, use the existing tag ID
            const tagId = row.id;

            // Insert the relationship into the 'event_tags' table
            db.run('INSERT INTO event_tags (event_id, tag_id) VALUES (?, ?)', [eventId, tagId], function (err) {
              if (err) {
                console.error('Error inserting item_tag relationship:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
              }
            });
          } else {
            // Tag does not exist, insert the new tag
            db.run('INSERT INTO tags (name) VALUES (?)', [tag], function (err) {
              if (err) {
                console.error('Error inserting tag data:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
              }

              const tagId = this.lastID;

              // Insert the relationship into the 'event_tags' table
              db.run('INSERT INTO event_tags (event_id, tag_id) VALUES (?, ?)', [eventId, tagId], function (err) {
                if (err) {
                  console.error('Error inserting item_tag relationship:', err);
                  return res.status(500).json({ error: 'Internal Server Error' });
                }
              });
            });
          }
        });

      });
      
      res.status(200).json({ 
        message: 'Event created successfully',
        id: eventId,
      });
    }
  );
});

// UPDATE EVENT
app.post('/api/edit-event', (req, res) => {
  const { id, name, location, startTime, endTime, description, game, tags } = req.body;

  // Insert data into the events table
  db.run(
    'UPDATE events SET name = ?, location = ?, startTime = ?, endTime = ?, ' +
    'description = ?, game = ? WHERE id = ?',
    [name, location, startTime, endTime, description, game, id],
    function (err) {
      if (err) {
        console.error('Error updating event data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } 

      // Insert tags
      tags.forEach(tag => {
        db.get('SELECT id FROM tags WHERE name = ?', [tag], (err, row) => {
          if (err) {
            console.error('Error checking for existing tag:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
          }

          if (row) {
            // Tag already exists, use the existing tag ID
            const tagId = row.id;
            
            db.get('SELECT * FROM event_tags WHERE event_id = ? AND tag_id = ?', 
              [id, tagId], (err, row) => {
              if (err) {
                console.error('Error checking for existing tag:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
              }
              if(!row){
                // Insert the relationship into the 'event_tags' table
                db.run('INSERT INTO event_tags (event_id, tag_id) VALUES (?, ?)', [id, tagId], function (err) {
                  if (err) {
                    console.error('Error inserting item_tag relationship:', err);
                    return res.status(500).json({ error: 'Internal Server Error' });
                  }
                });
              }
            });
          } else {
            // Tag does not exist, insert the new tag
            db.run('INSERT INTO tags (name) VALUES (?)', [tag], function (err) {
              if (err) {
                console.error('Error inserting tag data:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
              }

              const tagId = this.lastID;

              // Insert the relationship into the 'event_tags' table
              db.run('INSERT INTO event_tags (event_id, tag_id) VALUES (?, ?)', [id, tagId], function (err) {
                if (err) {
                  console.error('Error inserting item_tag relationship:', err);
                  return res.status(500).json({ error: 'Internal Server Error' });
                }
              });
            });
          }
        });

      });
      
      res.status(200).json({ 
        message: 'Event created updated',
        id: id,
      });
    }
  );
});

// CREATE NEW BRACKET
app.post('/api/create-bracket', (req, res) => {
  const { eventid, name, style, total_stations, players_per_station, rounds,
    players_move_on, third_place_match, seeded, published, started } = req.body;

  db.run( 'INSERT INTO brackets (event_id, name, style, total_stations, ' +
    'players_per_station, rounds, players_move_on, third_place_match, seeded, '+
    'published, started) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [eventid,
    name, style, total_stations, players_per_station, rounds, players_move_on,
    third_place_match, seeded, published, started], 
    function (err) {
      if (err) {
        console.error('Error inserting bracket data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } 
      const bracket_id = this.lastID;
      res.status(200).json({ 
        message: 'Bracket created successfully',
        id: bracket_id,
      });
    }
  );
});

// GET BRACKET DATA
app.get('/api/bracket/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM brackets WHERE id=?', [id], (err, row) => {
    if (err) {
      console.error('Error getting bracket details:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (row) {
        res.status(200).json(row);
      } else {
        res.status(404).json({ error: 'Bracket not found' });
      }
    }
  });
});

// UPDATE BRACKET
app.post('/api/edit-bracket', (req, res) => {
  const { id, event_id, name, style, total_stations, players_per_station, 
    rounds, players_move_on, third_place_match, seeded, published, started, 
    completed } = req.body;

    db.run('UPDATE brackets SET name = ?, style = ?, total_stations = ?, ' +
    'players_per_station = ?, rounds = ?, players_move_on = ?, third_place_match = ?, ' +
    'seeded = ?, published = ?, started = ?, completed = ? WHERE id = ?', [
    name, style, total_stations, players_per_station, rounds, players_move_on,
    third_place_match, seeded, published, started, completed, id], 
    function (err) {
      if (err) {
        console.error('Error updating bracket data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } 
      res.status(200).json({ 
        message: 'Bracket created updated',
      });
    }
  );
});

// DELETE BRACKET
app.post('/api/delete-bracket', (req, res) => {
  const { bracketid } = req.body;
});

// UPDATE MATCH
app.post('/api/update-match', (req, res) => {
  const { matchid, bracketid, results } = req.body;
});

// DQ PLAYER
app.post('/api/dq-player'), (req, res) => {
  const { playerid, eventid } = req.body;
}

// GET BRACKETS FOR AN EVENT
app.get('/api/event/:id/bracket', async (req, res) => {
  const { id } = req.params;

  try {
    const brackets = await getBrackets(id);

    for (const bracket of brackets) {
      const playerRows = await getParticipants(id, bracket.id);
      bracket.participants = playerRows || [];
    }

    res.status(200).json(brackets);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET USERNAME FOR SEARCHING
app.get('/api/usernames', async (req, res) =>{
  const { partialUsername } = req.query;
  try {
    const suggestions = await User.find(partialUsername);
    res.json(suggestions);
  } catch (error) {
    console.log(error);
    res.status(500).json({error: "Internal Server Error"})
  }
})

app.get('/api/event/:id', (req, res) => {
  const { id } = req.params;

  // Fetch event details with tags from the database based on the provided ID
  db.get('SELECT e.*, GROUP_CONCAT(t.name) AS tags FROM events e ' +
    'LEFT JOIN event_tags et ON e.id = et.event_id ' +
    'LEFT JOIN tags t ON et.tag_id = t.id ' +
    'WHERE e.id = ? GROUP BY e.id', [id], (err, row) => {
      if (err) {
        console.error('Error getting event details:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        if (row) {
          res.status(200).json(row);
        } else {
          res.status(404).json({ error: 'Event not found' });
        }
      }
    });
});

app.get('/api/get-events', (req, res) => {
  db.all('SELECT * FROM events', (err, rows) => {
    if (err) {
      console.error('Error getting events:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(200).json(rows);
    }
  });
});

app.get('/api/tags', (req, res) => {
  // Fetch all tags from the database
  db.all('SELECT * FROM tags', (err, rows) => {
    if (err) {
      console.error('Error getting tags:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(200).json(rows);
    }
  });
});

app.get('/api/events-by-tag/:tag', (req, res) => {
  const { tag } = req.params;

  const originalTagName = tag.replace(/[-_]/g, ' ');  // Fix here
  // Fetch events by tag from the database

  db.all('SELECT e.* FROM events e ' +
    'JOIN event_tags et ON e.id = et.event_id ' +
    'JOIN tags t ON et.tag_id = t.id ' +
    'WHERE t.name = ?', [originalTagName], (err, rows) => {
      if (err) {
        console.error('Error getting events by tag:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.status(200).json(rows);
      }
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});