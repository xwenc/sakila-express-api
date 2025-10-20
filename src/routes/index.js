const express = require('express');
const router = express.Router();
const actorsRouter = require('./actors');

// Mount routes
router.use('/actors', actorsRouter);

// Health check for API
router.get('/', (req, res) => {
  res.json({
    message: 'Sakila Express API',
    version: '1.0.0',
    endpoints: {
      actors: '/api/actors',
      swagger: '/api-docs',
    },
  });
});

module.exports = router;
