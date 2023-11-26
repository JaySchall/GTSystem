const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = process.env.PORT || 8080;
app.use(cors());
app.use(express.json()) //For JSON requests
app.use(express.urlencoded({extended: true}));

const db = new sqlite3.Database('tournament.db');

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
  });

  app.post('/api/create-event', (req, res) => {
    const { name, dateStoredInSeconds, location, description } = req.body;
  
    // Insert data into the events table
    db.run(
      'INSERT INTO events (name, dateStoredInSeconds, location, description) VALUES (?, ?, ?, ?)',
      [name, dateStoredInSeconds, location, description],
      (err) => {
        if (err) {
          console.error('Error inserting event data:', err);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          res.status(200).json({ message: 'Event created successfully' });
        }
      }
    );
  });

  app.get('/api/event/:id', (req, res) => {
    const { id } = req.params;
  
    // Fetch tournament details from the database based on the provided ID
    db.get('SELECT * FROM events WHERE id = ?', [id], (err, row) => {
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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });