const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('tournament.db');

db.serialize(() => {
    // Table for storing user information
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        username TEXT PRIMARY KEY,
        hashedPassword TEXT,
        isAdmin BOOLEAN
      )
    `);
  
    // Table for storing tournament information
    db.run(`
      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        dateStoredInSeconds INTEGER,
        location TEXT,
        description TEXT
      )
    `);
  
    // Table for linking users to events
    db.run(`
      CREATE TABLE IF NOT EXISTS registered (
        username TEXT,
        event_id INTEGER,
        PRIMARY KEY (username, event_id),
        FOREIGN KEY (username) REFERENCES users(username),
        FOREIGN KEY (event_id) REFERENCES events(id)
      )
    `);

  // Add more tables and initial data as needed

  console.log('Database initialized');
});

db.close();