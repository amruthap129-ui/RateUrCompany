const express = require('express');
const router = express.Router();
const db = require('../models/employeeModel');

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Missing credentials' });

  db.get('SELECT id, name, email, department, role FROM employees WHERE email = ? AND password = ?', [email, password], (err, row) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!row) return res.status(401).json({ message: 'Invalid credentials' });
    res.json({ user: row });
  });
});

// Register
router.post('/register', (req, res) => {
  const { name, email, password, department, role } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Missing required fields' });

  db.get('SELECT id FROM employees WHERE email = ?', [email], (err, existing) => {
    if (err) return res.status(500).json({ message: err.message });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    db.run('INSERT INTO employees (name, email, password, department, role) VALUES (?, ?, ?, ?, ?)', [name, email, password, department || '', role || 'employee'], function (err) {
      if (err) return res.status(500).json({ message: err.message });
      const id = this.lastID;
      db.get('SELECT id, name, email, department, role FROM employees WHERE id = ?', [id], (err2, row) => {
        if (err2) return res.status(500).json({ message: err2.message });
        res.json({ user: row });
      });
    });
  });
});

module.exports = router;
