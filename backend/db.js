const Database = require('better-sqlite3');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, '.env') });

// Open the database or create it if it does not exist
const databasePath = path.resolve(
    __dirname,
    process.env.DB_PATH || 'travel_destinations.db'
);

const db = new Database(databasePath);

// Check whether the destinations table already exists
const tableExists = db.prepare(`
    SELECT name
    FROM sqlite_master
    WHERE type = 'table'
      AND name = 'destinations'
`).get();

// Create the table and insert sample data only on first setup
if (!tableExists) {
    const schema = fs.readFileSync(
        path.join(__dirname, 'schema.sql'),
        'utf8'
    );

    db.exec(schema);
    console.log('Destinations table and sample data created.');
} else {
    console.log('Destinations table already exists.');
}

console.log('SQLite database connected successfully.');

module.exports = db;