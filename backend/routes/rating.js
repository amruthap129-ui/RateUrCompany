const express = require('express');
const router = express.Router();
const db = require('../models/employeeModel');

// check if employee already rated
router.get('/check/:employee_id', (req, res) => {
  const employee_id = parseInt(req.params.employee_id, 10);
  if (!employee_id) return res.status(400).json({ message: 'Missing employee id' });

  db.get('SELECT id FROM ratings WHERE employee_id = ?', [employee_id], (err, row) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ exists: !!row });
  });
});

// submit rating
router.post('/submit', (req, res) => {
  const { employee_id, company_name, salary, growth, benefits, balance } = req.body;
  if (!employee_id || !company_name) return res.status(400).json({ message: 'Missing required fields' });

  db.get('SELECT id FROM ratings WHERE employee_id = ?', [employee_id], (err, row) => {
    if (err) return res.status(500).json({ message: err.message });
    if (row) return res.status(400).json({ message: 'Already rated' });

    db.run('INSERT INTO ratings (employee_id, company_name, salary, growth, benefits, balance) VALUES (?, ?, ?, ?, ?, ?)', [employee_id, company_name, salary || 0, growth || 0, benefits || 0, balance || 0], function (err2) {
      if (err2) return res.status(500).json({ message: err2.message });
      res.json({ message: 'Rating submitted', id: this.lastID });
    });
  });
});

module.exports = router;
