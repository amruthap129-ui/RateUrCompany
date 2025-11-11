const express = require('express');
const router = express.Router();
const db = require('../models/employeeModel');

// check if employee already rated
router.get('/check/:employee_id', (req, res) => {
  const employee_id = parseInt(req.params.employee_id, 10);
  if (!employee_id)
    return res.status(400).json({ message: 'Missing employee id' });

  db.get('SELECT id FROM ratings WHERE employee_id = ?', [employee_id], (err, row) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ exists: !!row });
  });
});

// submit rating
router.post('/submit', (req, res) => {
  const { employee_id, company_name, salary, growth, benefits, balance } = req.body;
  if (!employee_id || !company_name)
    return res.status(400).json({ message: 'Missing required fields' });

  // check if already rated
  db.get('SELECT id FROM ratings WHERE employee_id = ?', [employee_id], (err, row) => {
    if (err) return res.status(500).json({ message: err.message });
    if (row) return res.status(400).json({ message: 'Already rated' });

    // insert rating
    db.run(
      'INSERT INTO ratings (employee_id, company_name, salary, growth, benefits, balance) VALUES (?, ?, ?, ?, ?, ?)',
      [employee_id, company_name, salary || 0, growth || 0, benefits || 0, balance || 0],
      function (err2) {
        if (err2) return res.status(500).json({ message: err2.message });

        // compute company average
        db.get(
          `SELECT AVG((salary + growth + benefits + balance) / 4.0) AS avg_rating 
           FROM ratings WHERE company_name = ?`,
          [company_name],
          (err3, row2) => {
            if (err3) return res.status(500).json({ message: err3.message });

            const avgRating = row2?.avg_rating || 0;
            console.log(`📊 Avg rating for ${company_name}: ${avgRating}`);

            // 🚫 Payment is no longer triggered here automatically.
            // The frontend will now handle payments manually.

            res.json({
              message: 'Rating submitted successfully',
              rating_id: this.lastID,
              average_rating: avgRating
            });
          }
        );
      }
    );
  });
});

module.exports = router;
