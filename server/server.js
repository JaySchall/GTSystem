const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const { Tournament, SingleEliminationBracket, Match } = require("./tournament/tournament_core.js");

const app = express();
const port = process.env.PORT || 8080;
app.use(cors());
app.use(express.json()) //For JSON requests
app.use(express.urlencoded({ extended: true }));


const db = new sqlite3.Database("tournament.db");

const tournaments = {}

/***********************************************
 * ⊦─────────── Helper Functions ───────────˧
 ***********************************************/

const User = {
  find: (partialUsername) => {
    const regex = new RegExp(`^${partialUsername}`, "i");
    const query = `%${partialUsername}%`
    return new Promise((resolve,reject) => {
      const sql = "SELECT * FROM players WHERE user_id LIKE ? OR name LIKE ?";
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
    db.all("SELECT * FROM brackets WHERE event_id=?", [id], (err, rows) => {
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
    db.all("SELECT participants.player_id, participants.seed, players.name FROM participants " +
    "JOIN players ON participants.player_id = players.id WHERE participants.event_id = ? " +
    "AND participants.bracket_id = ?",
    [eventId, bracketId], (err, playerRows) => {
      if (err) {
        reject(err);
      } else {
        resolve(playerRows);
      }
    });
  });
}

function getRegistrants(event_id) {
  return new Promise((resolve, reject) => {
    db.all("SELECT registered.player_id, players.name, " +
    "registered.checked_in FROM Registered JOIN Players ON "+
    "Registered.player_id = Players.id WHERE Registered.event_id = ?", 
    [event_id], (err, playerRows) => {
      if (err) {
        reject(err);
      } else {
        resolve(playerRows);
      }
    });
  });
}

function deleteBracket(bid) {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM matches WHERE bracket_id=?", [bid], (err) => {
      if (err) {
        reject(err);
      }
      db.run("DELETE FROM participants WHERE bracket_id=?", [bid], (err) => {
        if (err) {
          reject(err);
        }
        db.run("DELETE FROM brackets WHERE id=?", [bid], (err) => {
          if (err) {
            reject(err);
          }
        });
      });
    });
    resolve(true);
  });
}

function getMatches(bid) { 
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM matches WHERE bracket_id = ? ORDER BY id", 
    [bid], (err, matchRows) => {
      if (err) {
        reject(err);
      } else {
        resolve(matchRows);
      }
    });
  });
}

function insertPlayerAndRegister(name, event_id) {
  return new Promise((resolve, reject) => {
    db.run("INSERT INTO players (name) VALUES (?)", [name], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  });
}

async function loadBracket(bracket_id) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM brackets WHERE id=?", [bracket_id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        if (row) {
          db.all("SELECT * FROM participants WHERE bracket_id = ? ORDER BY seed",
          [bracket_id], (err, rows) => {
            if (err) {
              reject(err);
            } else {
              const loadedBracket = new Tournament(bracket_id, row.style, rows);
              loadedBracket.bracket.players_per_station = row.players_per_station;
              loadedBracket.bracket.players_move_on = row.players_move_on;
              loadedBracket.bracket.third_place_match = Boolean(row.third_place_match);
              loadedBracket.bracket.seeded = Boolean(row.seeded);
              loadedBracket.bracket.started = Boolean(row.started);
              loadedBracket.bracket.completed = Boolean(row.completed);
              db.all("SELECT * FROM matches WHERE bracket_id = ? ORDER BY id",
              [bracket_id], (err, new_rows) => {
                if (err) {
                  reject(err);
                } else {
                  new_rows.forEach((value) => {
                    loadedBracket.loadMatch(value);
                  })
                  resolve(loadedBracket);
                }
              })
            }
          });
        } else {
          resolve(null);
        }
      }
    })
  });
}

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});



/***********************************************
 * ⊦─────────────── Brackets ───────────────˧
 ***********************************************/

// CREATE NEW BRACKET
app.post("/api/create-bracket", (req, res) => {
  const { eventid, name, style, total_stations, players_per_station, rounds,
    players_move_on, third_place_match, seeded, published, started } = req.body;

  db.run( "INSERT INTO brackets (event_id, name, style, total_stations, " +
    "players_per_station, rounds, players_move_on, third_place_match, seeded, "+
    "published, started) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [eventid,
    name, style, total_stations, players_per_station, rounds, players_move_on,
    third_place_match, seeded, published, started], 
    function (err) {
      if (err) {
        console.error("Error inserting bracket data:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } 
      const bracket_id = this.lastID;
      res.status(200).json({ 
        message: "Bracket created successfully",
        id: bracket_id,
      });
    }
  );
});

// GET BRACKET DATA
app.get("/api/bracket/:id", (req, res) => {
  const { id } = req.params;
  
  db.get("SELECT * FROM brackets WHERE id=?", [id], (err, row) => {
    if (err) {
      console.error("Error getting bracket details:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      if (row) {
        res.status(200).json(row);
      } else {
        res.status(404).json({ error: "Bracket not found" });
      }
    }
  });
});

// GET BRACKETS FOR AN EVENT
app.get("/api/event/:id/bracket", async (req, res) => {
  const { id } = req.params;

  try {
    const brackets = await getBrackets(id);

    for (const bracket of brackets) {
      const playerRows = await getParticipants(id, bracket.id);
      bracket.participants = playerRows || [];
    }

    res.status(200).json(brackets);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// UPDATE BRACKET
app.post("/api/edit-bracket", (req, res) => {
  const { id, event_id, name, style, total_stations, players_per_station, 
    rounds, players_move_on, third_place_match, seeded, published, started, 
    completed } = req.body;

    db.run("UPDATE brackets SET name = ?, style = ?, total_stations = ?, " +
    "players_per_station = ?, rounds = ?, players_move_on = ?, third_place_match = ?, " +
    "seeded = ?, published = ?, started = ?, completed = ? WHERE id = ?", [
    name, style, total_stations, players_per_station, rounds, players_move_on,
    third_place_match, seeded, published, started, completed, id], 
    function (err) {
      if (err) {
        console.error("Error updating bracket data:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } 
      res.status(200).json({ 
        message: "Bracket created updated",
      });
    }
  );
});

// DELETE BRACKET
app.post("/api/delete-bracket", async (req, res) => {
  const { bid } = req.body;
  await deleteBracket(bid)
    .then(() => {
      res.status(200).json({ 
        message: "Bracket successfully deleted",
      });
    })
    .catch((err) => {
      if (err) {
        console.error("Error updating bracket data:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } 
    })
});


/***********************************************
 * ⊦──────────────── Events ────────────────˧
 ***********************************************/

// INSERT EVENT CALL
app.post("/api/create-event", (req, res) => {
  const { name, location, startTime, endTime, description, game, tags } = req.body;


  // Insert data into the events table
  db.run(
    "INSERT INTO events (name, location, startTime, endTime, description, game) VALUES (?, ?, ?, ?, ?, ?)",
    [name, location, startTime, endTime, description, game],
    function (err) {
      if (err) {
        console.error("Error inserting event data:", err);
        res.status(500).json({ error: "Internal Server Error" });
      }
      const eventId = this.lastID;


      // Insert tags
      tags.forEach(tag => {
        db.get("SELECT id FROM tags WHERE name = ?", [tag], (err, row) => {
          if (err) {
            console.error("Error checking for existing tag:", err);
            return res.status(500).json({ error: "Internal Server Error" });
          }


          if (row) {
            // Tag already exists, use the existing tag ID
            const tagId = row.id;


            // Insert the relationship into the "event_tags" table
            db.run("INSERT INTO event_tags (event_id, tag_id) VALUES (?, ?)", [eventId, tagId], function (err) {
              if (err) {
                console.error("Error inserting item_tag relationship:", err);
                return res.status(500).json({ error: "Internal Server Error" });
              }
            });
          } else {
            // Tag does not exist, insert the new tag
            db.run("INSERT INTO tags (name) VALUES (?)", [tag], function (err) {
              if (err) {
                console.error("Error inserting tag data:", err);
                return res.status(500).json({ error: "Internal Server Error" });
              }


              const tagId = this.lastID;


              // Insert the relationship into the "event_tags" table
              db.run("INSERT INTO event_tags (event_id, tag_id) VALUES (?, ?)", [eventId, tagId], function (err) {
                if (err) {
                  console.error("Error inserting item_tag relationship:", err);
                  return res.status(500).json({ error: "Internal Server Error" });
                }
              });
            });
          }
        });


      });
     
      res.status(200).json({
        message: "Event created successfully",
        id: eventId,
      });
    }
  );
});

// GETTER FOR EVENT PAGE
app.get("/api/event/:id", (req, res) => {
  const { id } = req.params;


  // Fetch event details with tags from the database based on the provided ID
  db.get("SELECT e.*, GROUP_CONCAT(t.name) AS tags FROM events e " +
    "LEFT JOIN event_tags et ON e.id = et.event_id " +
    "LEFT JOIN tags t ON et.tag_id = t.id " +
    "WHERE e.id = ? GROUP BY e.id", [id], (err, row) => {
      if (err) {
        console.error("Error getting event details:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        if (row) {
          res.status(200).json(row);
        } else {
          res.status(404).json({ error: "Event not found" });
        }
      }
    });
});

// GET ALL EVENTS WITH A TAG
app.get("/api/events-by-tag/:tag", (req, res) => {
  const { tag } = req.params;


  const originalTagName = tag.replace(/[-_]/g, " ");  // Fix here
  // Fetch events by tag from the database


  db.all("SELECT e.* FROM events e " +
    "JOIN event_tags et ON e.id = et.event_id " +
    "JOIN tags t ON et.tag_id = t.id " +
    "WHERE t.name = ?", [originalTagName], (err, rows) => {
      if (err) {
        console.error("Error getting events by tag:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json(rows);
      }
    });
});

// UPDATE EVENT
app.post("/api/edit-event", (req, res) => {
  const { id, name, location, startTime, endTime, description, game, tags } = req.body;

  // Insert data into the events table
  db.run(
    "UPDATE events SET name = ?, location = ?, startTime = ?, endTime = ?, " +
    "description = ?, game = ? WHERE id = ?",
    [name, location, startTime, endTime, description, game, id],
    function (err) {
      if (err) {
        console.error("Error updating event data:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } 

      // Insert tags
      tags.forEach(tag => {
        db.get("SELECT id FROM tags WHERE name = ?", [tag], (err, row) => {
          if (err) {
            console.error("Error checking for existing tag:", err);
            return res.status(500).json({ error: "Internal Server Error" });
          }

          if (row) {
            // Tag already exists, use the existing tag ID
            const tagId = row.id;
            
            db.get("SELECT * FROM event_tags WHERE event_id = ? AND tag_id = ?", 
              [id, tagId], (err, row) => {
              if (err) {
                console.error("Error checking for existing tag:", err);
                return res.status(500).json({ error: "Internal Server Error" });
              }
              if(!row){
                // Insert the relationship into the "event_tags" table
                db.run("INSERT INTO event_tags (event_id, tag_id) VALUES (?, ?)", [id, tagId], function (err) {
                  if (err) {
                    console.error("Error inserting item_tag relationship:", err);
                    return res.status(500).json({ error: "Internal Server Error" });
                  }
                });
              }
            });
          } else {
            // Tag does not exist, insert the new tag
            db.run("INSERT INTO tags (name) VALUES (?)", [tag], function (err) {
              if (err) {
                console.error("Error inserting tag data:", err);
                return res.status(500).json({ error: "Internal Server Error" });
              }

              const tagId = this.lastID;

              // Insert the relationship into the "event_tags" table
              db.run("INSERT INTO event_tags (event_id, tag_id) VALUES (?, ?)", [id, tagId], function (err) {
                if (err) {
                  console.error("Error inserting item_tag relationship:", err);
                  return res.status(500).json({ error: "Internal Server Error" });
                }
              });
            });
          }
        });

      });
      
      res.status(200).json({ 
        message: "Event created updated",
        id: id,
      });
    }
  );
});

// DELETE EVENT
app.post("/api/delete-event/", async (req, res) => {
  const { id } = req.body;
  // delete all bracket related items
  const brackets = await getBrackets(id);
  const processBrackets = async (brackets) => {
    for (const b of brackets) {
      await deleteBracket(b.id).catch((error) => {
        console.error("Error deleting bracket:", error);
        res.status(500).json({ error: "Internal Server Error" })
      });
    }
  };
  await processBrackets(brackets);

  // delete event related items
  db.run("DELETE FROM registered WHERE event_id = ?", [id], function (err) {
    if (err) {
      console.error("Error event registrants:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
    
    db.run("DELETE FROM event_tags WHERE event_id = ?", [id], function (err) {
      if (err) {
        console.error("Error event tags:", err);
        res.status(500).json({ error: "Internal Server Error" });
      }
      
      db.run("DELETE FROM events WHERE id = ?", [id], 
      function (err) {
          if (err) {
            console.error("Error deleting event:", err);
            res.status(500).json({ error: "Internal Server Error" });
          }
      });
    });
  });


  res.status(200).json({ 
    message: "Bracket deleted successfully"
  });
});


/***********************************************
 * ⊦──────────────── Matches ────────────────˧
 ***********************************************/

// UPDATE MATCH
app.post("/api/update-match", (req, res) => {
  const { matchid, bracketid, results } = req.body;
});

// GENERATE A BRACKET
app.post("/api/generate-bracket", async (req, res) => {
  const { bracket_id } = req.body;
  try {
    const matches = await getMatches(bracket_id);
    if (matches.length !== 0){
      res.status(200).json({message:"Bracket already exists!"});
      return;
    }
    let tournament = await loadBracket(bracket_id)
    if (tournament.bracket.seeded) {
      tournament.generateSeededBracket();
    } else {
      tournament.generateRandomBracket();
    }
    await tournament.bracket.matches.forEach((value, index) => {
      match_vals = tournament.exportMatch(value, index);
      db.run("INSERT INTO matches (id, bracket_id, players, next_matches, " +
      "scores, is_bye, is_started, is_done) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [match_vals.id, bracket_id, match_vals.players, match_vals.next_matches, 
        match_vals.scores, match_vals.is_bye, match_vals.is_started, 
        match_vals.is_done], 
        function (err) {});
    });
  } catch (err) {
    console.error("Error generating bracket:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
  res.status(200).json({message:"Successfully generated bracket."});
});

// GET MATCHES
app.get("/api/matches/:bid", async (req, res) => {
  const { bid } = req.params;
  try {
    const matches = await getMatches(bid);
    res.status(200).json(matches);
  } catch (err) {
    console.error(err);
    res.status(500).json({error:"Failed to retrieve matches"});
  }
});

// DELETE MATCHES
app.post("/api/delete-matches", (req, res) => {
    const { bid } = req.body;
    db.run("DELETE FROM matches WHERE bracket_id = ?", [bid], function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
  
      res.json({ message: `Deleted all matches for bracket_id ${bid}` });  
    })
})


/***********************************************
 * ⊦───────────────── Tags ─────────────────˧
 ***********************************************/

// GET ALL TAGS
app.get("/api/tags", (req, res) => {
  // Fetch all tags from the database
  db.all("SELECT * FROM tags", (err, rows) => {
    if (err) {
      console.error("Error getting tags:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json(rows);
    }
  });
});


/***********************************************
 * ⊦──────────────── Users ─────────────────˧
 ***********************************************/

// REGISTER A SINGLE PLAYER
app.post("/api/register-player", async(req, res) => {
  const { id, name } = req.body.user;
  const { event_id } = req.body;
  let player_id = id;
  
  try {
    const existingPlayer = await new Promise((resolve, reject) => {
      db.get("SELECT * FROM players WHERE id = ?", [player_id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
    if (!player_id && !existingPlayer)  {
      player_id = await insertPlayerAndRegister(name, event_id)
    }
  } catch (err) {
    console.error("Error registering player:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
  try {
    const existingRegistrant = await new Promise((resolve, reject) => {
      db.get("SELECT * FROM registered WHERE player_id = ? AND event_id = ?", 
      [player_id, event_id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
    if (!existingRegistrant){
      db.run(
        "INSERT INTO registered (player_id, event_id, checked_in) VALUES (?, ?, ?)",
        [player_id, event_id, 1],
        (err) => {
          if (err) {
            console.error("Error inserting into registered:", err);
            res.status(500).json({ error: "Internal Server Error" });
          } else {
            db.get("SELECT id, name FROM players WHERE id = ?", [player_id], (err, row) => {
              res.status(200).json({ ...row, checked_in: 1 });
            });
          }
        }
      );
    } else {
      res.status(200).json({});
    }
  } catch (err) {
    console.error("Error registering player:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET ALL REGISTRANTS FOR AN EVENT
app.get("/api/registrants/:id", (req, res) => {
  const { id } = req.params;
  db.all("SELECT registered.player_id, players.name, players.user_id, " +
  "registered.checked_in FROM Registered JOIN Players ON "+
  "Registered.player_id = Players.id WHERE Registered.event_id = ?", 
  [id], (err, rows) => {
    if (err) {
      console.error("Error getting tags:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json(rows.map(({ player_id, name, checked_in }) => ({
        id: player_id,
        name,
        checked_in,
      })));
    }
  });
});

// GET ALL PARTICIPANTS FOR A BRACKET
app.get("/api/participants/:id/:bid", async (req, res) => {
  const { id, bid } = req.params;
  try {
    const participants_list = await getParticipants(id, bid);
    res.status(200).json(participants_list);
  } catch (error) {
    console.log(error);
    res.status(500).json({error: "Internal Server Error"})
  }
});

// CHECKIN AND DROP REGISTRANT
app.post("/api/update-event-registration", (req, res) => {
  const { id, action, value, event_id } = req.body;
  const options = ["checkin", "drop"];
  if (!options.includes(action) ||(action === "checkin" && !event_id)){
    res.status(400).json({ error: "Invalid action"});
  }
  if (action === options[0]){
    db.run("UPDATE registered SET checked_in = ? WHERE player_id = ? AND event_id = ?", 
    [Number(!!value), id, event_id], (err) => {
      if(err) {
        console.error("Error checking in:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json({...req.body, value: Number(!!value)})
      }
    }) 
  } else {
    db.run("DELETE FROM registered WHERE player_id = ? AND event_id = ?",
    [id, value], (err) => {
      if(err) {
        console.error("Error dropping:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json({})
      }
    })
  }
});

// GET REGISTRANTS AND PARTICIPANTS
app.get("/api/get-participants/:event_id/:bracket_id", async (req, res) => {
  const { bracket_id, event_id } = req.params;
  let data = {};
  try {
    data.participants = await getParticipants(event_id, bracket_id);
    data.registered = await getRegistrants(event_id);
    res.status(200).json({ ...data })
  } catch (err) {
    console.error("Error getting participants:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// UPDATE PARTICIPANTS
app.post("/api/set-participants", (req, res) => {
  const { event_id, bracket_id, players } = req.body;
  db.run("DELETE FROM participants WHERE bracket_id=?", [bracket_id], (err) => {
    if (err) {
      console.error("Error setting participants:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  for(let i = 0; i < players.length; i+=1) {
    db.run("INSERT INTO participants (player_id, event_id, bracket_id, seed, " +
    "disqualified) VALUES (?, ?, ?, ?, ?)", [players[i].id, event_id, bracket_id,
    players[i].seed, 0], (err) => {
      if (err) {
      console.error("Error setting participants:", err);
      res.status(500).json({ error: "Internal Server Error" });
      }
    });
  }
  res.status(200).json({message:"succesfully updated participants"});
});


/***********************************************
 * ⊦───────────── Miscellaneous ─────────────˧
 ***********************************************/

// GET USERNAME FOR SEARCHING
app.get("/api/usernames", async (req, res) =>{
  const { partialUsername } = req.query;
  try {
    const suggestions = await User.find(partialUsername);
    res.json(suggestions);
  } catch (error) {
    console.log(error);
    res.status(500).json({error: "Internal Server Error"})
  }
});

// GET LIST OF UPCOMING EVENTS
app.get("/api/get-events", (req, res) => {
  const today = new Date();
  today.setHours(0,0,0,0);
  db.all("SELECT * FROM events WHERE startTime > ? ORDER BY startTime", [today.toISOString()],
   (err, rows) => {
      if (err) {
        console.error("Error getting events:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json(rows);
      }
  });
});

// UPDATE EVENT
app.post("/api/edit-event", (req, res) => {
  const { id, name, location, startTime, endTime, description, game, tags } = req.body;

  // Insert data into the events table
  db.run(
    "UPDATE events SET name = ?, location = ?, startTime = ?, endTime = ?, " +
    "description = ?, game = ? WHERE id = ?",
    [name, location, startTime, endTime, description, game, id],
    function (err) {
      if (err) {
        console.error("Error updating event data:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } 

      // Insert tags
      tags.forEach(tag => {
        db.get("SELECT id FROM tags WHERE name = ?", [tag], (err, row) => {
          if (err) {
            console.error("Error checking for existing tag:", err);
            return res.status(500).json({ error: "Internal Server Error" });
          }

          if (row) {
            // Tag already exists, use the existing tag ID
            const tagId = row.id;
            
            db.get("SELECT * FROM event_tags WHERE event_id = ? AND tag_id = ?", 
              [id, tagId], (err, row) => {
              if (err) {
                console.error("Error checking for existing tag:", err);
                return res.status(500).json({ error: "Internal Server Error" });
              }
              if(!row){
                // Insert the relationship into the "event_tags" table
                db.run("INSERT INTO event_tags (event_id, tag_id) VALUES (?, ?)", [id, tagId], function (err) {
                  if (err) {
                    console.error("Error inserting item_tag relationship:", err);
                    return res.status(500).json({ error: "Internal Server Error" });
                  }
                });
              }
            });
          } else {
            // Tag does not exist, insert the new tag
            db.run("INSERT INTO tags (name) VALUES (?)", [tag], function (err) {
              if (err) {
                console.error("Error inserting tag data:", err);
                return res.status(500).json({ error: "Internal Server Error" });
              }

              const tagId = this.lastID;

              // Insert the relationship into the "event_tags" table
              db.run("INSERT INTO event_tags (event_id, tag_id) VALUES (?, ?)", [id, tagId], function (err) {
                if (err) {
                  console.error("Error inserting item_tag relationship:", err);
                  return res.status(500).json({ error: "Internal Server Error" });
                }
              });
            });
          }
        });

      });
      
      res.status(200).json({ 
        message: "Event created updated",
        id: id,
      });
    }
  );
});

// DELETE EVENT
app.post("/api/delete-event/", async (req, res) => {
  const { id } = req.body;
  // delete all bracket related items
  const brackets = await getBrackets(id);
  const processBrackets = async (brackets) => {
    for (const b of brackets) {
      await deleteBracket(b.id).catch((error) => {
        console.error("Error deleting bracket:", error);
        res.status(500).json({ error: "Internal Server Error" })
      });
    }
  };
  await processBrackets(brackets);

  // delete event related items
  db.run("DELETE FROM registered WHERE event_id = ?", [id], function (err) {
    if (err) {
      console.error("Error event registrants:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
    
    db.run("DELETE FROM event_tags WHERE event_id = ?", [id], function (err) {
      if (err) {
        console.error("Error event tags:", err);
        res.status(500).json({ error: "Internal Server Error" });
      }
      
      db.run("DELETE FROM events WHERE id = ?", [id], 
      function (err) {
          if (err) {
            console.error("Error deleting event:", err);
            res.status(500).json({ error: "Internal Server Error" });
          }
      });
    });
  });


  res.status(200).json({ 
    message: "Bracket deleted successfully"
  });
});

// check if a username and password are valid
app.post("/api/check-credentials", async (req, res) => {
  const { username, password } = req.body;

  db.get("SELECT * FROM users WHERE username = ?", [username], async (err, row) => {
    if (err) {
      res.status(500).json({ success: false, message: "Error checking credentials" });
    } else if (row) {
      // Compare the provided password with the stored hashed password
      const match = await bcrypt.compare(password, row.hashed_password);

      const userData = {
        username: row.username,
        short_name: row.short_name,
        isAdmin: row.is_admin,
        is_content_creator: row.is_content_creator
      }

      if (match) {
        res.status(200).json(userData);
      } else {
        res.status(401).json({ valid: false });
      }
    } else {
      res.status(401).json({ valid: false });
    }
  });
});

// inserting newly registered player
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  const hashpass = await bcrypt.hash(password, 8);

   db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
    if (err) {
      res.status(500).json({ success: false, message: "Error checking username" });
    } else if (row) {
      res.status(409).json({ success: false, message: "Username already exists" });
    } else {
      // Insert the new user into the database
      db.run("INSERT INTO users (username, hashed_password) VALUES (?, ?)", [username, hashpass], (err) => {
        if (err) {
          res.status(500).json({ success: false, message: "Error registering user" });
        } else {
          res.status(200).json({ success: true, message: "Registration successful" });
        }
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

