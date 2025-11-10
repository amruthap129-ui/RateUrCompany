const express = require('express');
const router = express.Router();
const db = require('../models/employeeModel');

// get employee by id
router.get('/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT id, name, email, department, role FROM employees WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!row) return res.status(404).json({ message: 'Employee not found' });
    res.json(row);
  });
});

// get all employees
router.get('/', (req, res) => {
  db.all('SELECT id, name, email, department, role FROM employees', [], (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(rows);
  });
});

module.exports = router;
