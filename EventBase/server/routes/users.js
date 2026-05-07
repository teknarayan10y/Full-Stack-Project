// server/routes/users.js
const express = require('express');
const router = express.Router();

// Placeholder route
router.get('/', (req, res) => {
  res.status(200).json({ success: true, data: 'Users route' });
});

module.exports = router;