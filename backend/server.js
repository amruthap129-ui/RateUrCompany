// Backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const db = require('./models/employeeModel'); // sqlite db object
const authRoutes = require('./routes/auth');
const empRoutes = require('./routes/employee');
const ratingRoutes = require('./routes/rating');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// mount routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', empRoutes);
app.use('/api/rating', ratingRoutes);

// admin endpoint: list ratings with employee name
app.get('/api/admin/ratings', (req, res) => {
  const q = `
    SELECT e.name AS employee_name,
           r.company_name,
           r.salary,
           r.growth,
           r.benefits,
           r.balance,
           ( (r.salary + r.growth + r.benefits + r.balance) / 4.0 ) AS avg_rating
    FROM ratings r
    JOIN employees e ON e.id = r.employee_id
    ORDER BY r.company_name, e.name
  `;
  db.all(q, [], (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(rows || []);
  });
});

// simple root to verify server
app.get('/', (req, res) => res.send('Backend running'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
