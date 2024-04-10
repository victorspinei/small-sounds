const sqlite3 = require('sqlite3').verbose();

const path = require('path')

const db = new sqlite3.Database(path.join(__dirname, "../server.db"), (err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the database.');
    }
})

module.exports = db;