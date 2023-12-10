const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const app = express();
const port = process.env.PORT || 8080;
app.use(cors());
app.use(express.json()) //For JSON requests
app.use(express.urlencoded({ extended: true }));


const db = new sqlite3.Database('tournament.db');


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


// INSERT BRACKET CALL


// MODIFY BRACKET CALL


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


// check if a username and password are valid
app.post('/api/check-credentials', async (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, row) => {
    if (err) {
      res.status(500).json({ success: false, message: 'Error checking credentials' });
    } else if (row) {
      // Compare the provided password with the stored hashed password
      const match = await bcrypt.compare(password, row.hashed_password);

      if (match) {
        res.status(200).json({ valid: true });
      } else {
        res.status(401).json({ valid: false });
      }
    } else {
      res.status(401).json({ valid: false });
    }
  });
});

// inserting newly registered player
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  const hashpass = await bcrypt.hash(password, 8);

   db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
    if (err) {
      res.status(500).json({ success: false, message: 'Error checking username' });
    } else if (row) {
      res.status(409).json({ success: false, message: 'Username already exists' });
    } else {
      // Insert the new user into the database
      db.run('INSERT INTO users (username, hashed_password) VALUES (?, ?)', [username, hashpass], (err) => {
        if (err) {
          res.status(500).json({ success: false, message: 'Error registering user' });
        } else {
          res.status(200).json({ success: true, message: 'Registration successful' });
        }
      });
    }
  });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
