const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'travel_planner.db');

// Ensure db directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

let dbInstance = null;
let SQL = null;

async function getDB() {
  if (dbInstance) return dbInstance;

  // Initialize WebAssembly SQL.js
  SQL = await initSqlJs();

  let fileBuffer = null;
  try {
    if (fs.existsSync(dbPath)) {
      fileBuffer = fs.readFileSync(dbPath);
    }
  } catch (err) {
    console.error('Error reading database file, starting clean:', err.message);
  }

  dbInstance = fileBuffer ? new SQL.Database(fileBuffer) : new SQL.Database();
  console.log('SQL.js database initialized. Persistence path:', dbPath);

  initializeTables(dbInstance);
  return dbInstance;
}

function saveDB() {
  if (!dbInstance) return;
  try {
    const data = dbInstance.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  } catch (err) {
    console.error('Error saving SQLite database state to disk:', err.message);
  }
}

function initializeTables(db) {
  // 1. Trips table
  db.run(`
    CREATE TABLE IF NOT EXISTS trips (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source TEXT NOT NULL,
      destination TEXT NOT NULL,
      people INTEGER NOT NULL,
      days INTEGER NOT NULL,
      travelMode TEXT NOT NULL,
      budget REAL NOT NULL,
      tripType TEXT NOT NULL,
      hotelType TEXT,
      foodPref TEXT,
      adventureLevel INTEGER,
      luxuryLevel INTEGER,
      activities TEXT,
      costs TEXT,
      optimizations TEXT,
      recommendations TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 2. Expenses table
  db.run(`
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tripId INTEGER,
      category TEXT NOT NULL,
      desc TEXT NOT NULL,
      amount REAL NOT NULL,
      date TEXT NOT NULL,
      FOREIGN KEY(tripId) REFERENCES trips(id) ON DELETE CASCADE
    )
  `);

  saveDB();
}

// Promise wrapper utility object for SQL operations
const query = {
  async run(sql, params = []) {
    const db = await getDB();
    const stmt = db.prepare(sql);
    stmt.run(params);
    stmt.free();

    // Retrieve last inserted ID
    let lastId = 0;
    try {
      const res = db.exec("SELECT last_insert_rowid() as id");
      if (res && res[0] && res[0].values) {
        lastId = res[0].values[0][0];
      }
    } catch (e) {
      console.error('Failed to fetch last rowid:', e.message);
    }

    saveDB();
    return { id: lastId };
  },

  async get(sql, params = []) {
    const db = await getDB();
    const stmt = db.prepare(sql);
    stmt.bind(params);
    let row = null;
    if (stmt.step()) {
      row = stmt.getAsObject();
    }
    stmt.free();
    return row;
  },

  async all(sql, params = []) {
    const db = await getDB();
    const stmt = db.prepare(sql);
    stmt.bind(params);
    const rows = [];
    while (stmt.step()) {
      rows.push(stmt.getAsObject());
    }
    stmt.free();
    return rows;
  }
};

module.exports = {
  getDB,
  saveDB,
  query
};
