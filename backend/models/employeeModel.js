// Backend/models/employeeModel.js
const path = require('path');

const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const dbFolder = path.join(__dirname, '..', 'db');
if (!fs.existsSync(dbFolder)) fs.mkdirSync(dbFolder, { recursive: true });
const dbPath = path.join(dbFolder, 'employee.db');
const db = new sqlite3.Database(dbPath);

// ensure tables exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      department TEXT,
      role TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS ratings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id INTEGER,
      company_name TEXT,
      salary INTEGER,
      growth INTEGER,
      benefits INTEGER,
      balance INTEGER,
      FOREIGN KEY(employee_id) REFERENCES employees(id)
    )
  `);

  // create a default admin (only if not exists)
  db.get("SELECT id FROM employees WHERE email = ?", ['admin@ryo.com'], (err, row) => {
    if (!row) {
      db.run(
        `INSERT INTO employees (name, email, password, department, role)
         VALUES (?, ?, ?, ?, ?)`,
        ['Admin', 'admin@ryo.com', 'admin', 'admin', 'admin']
      );
    }
  });
});

module.exports = db;
