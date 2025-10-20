const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const apiRoutes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();
const env = process.env.NODE_ENV;

// Middleware to parse JSON bodies
app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API routes
app.use('/api', apiRoutes);

/**
 * @swagger
 * /:
 *   get:
 *     summary: Health check endpoint
 *     tags: [General]
 *     responses:
 *       200:
 *         description: Server is running
 */
app.get('/', (req, res) => {
  res.send('Hello World!' + (env ? ` - Environment: ${env}` : ''));
});

// Handle 404 - Must be after all other routes
app.use(notFoundHandler);

// Global error handler - Must be last
app.use(errorHandler);

module.exports = app;