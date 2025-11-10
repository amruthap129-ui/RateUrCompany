// Use require for all imports since we're using CommonJS
const Database = require('better-sqlite3');
const path = require('path');

// Resolve DB file path
const dbFolder = path.join(__dirname, '../../backend', 'db');
const dbPath = path.join(dbFolder, 'employee.db');

console.log('✅ DB Path:', dbPath);

// Initialize connection
const db = new Database(dbPath);

// Export helper methods
export const dbHelper = {
  getEmployeeByEmail(email: string) {
    const stmt = db.prepare('SELECT * FROM employees WHERE email = ?');
    return stmt.get(email);
  },

  getRatingByEmployeeId(empId: number) {
    const stmt = db.prepare('SELECT * FROM ratings WHERE employee_id = ?');
    return stmt.get(empId);
  },

  close() {
    db.close();
  },
};
module.exports = { dbHelper };