const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sakila Express API',
      version: '1.0.0',
      description: 'A sample Express API with Sequelize for the Sakila database',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Actor: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Actor ID',
              example: 1,
            },
            firstName: {
              type: 'string',
              description: 'Actor first name',
              example: 'John',
            },
            lastName: {
              type: 'string',
              description: 'Actor last name',
              example: 'Doe',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        Film: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Film ID',
              example: 1,
            },
            title: {
              type: 'string',
              description: 'Film title',
              example: 'The Matrix',
            },
            description: {
              type: 'string',
              description: 'Film description',
            },
            releaseYear: {
              type: 'integer',
              description: 'Release year',
              example: 1999,
            },
            languageId: {
              type: 'integer',
              description: 'Language ID',
              example: 1,
            },
            rentalDuration: {
              type: 'integer',
              description: 'Rental duration in days',
              example: 3,
            },
            rentalRate: {
              type: 'number',
              format: 'decimal',
              description: 'Rental rate',
              example: 4.99,
            },
            length: {
              type: 'integer',
              description: 'Film length in minutes',
              example: 136,
            },
            replacementCost: {
              type: 'number',
              format: 'decimal',
              description: 'Replacement cost',
              example: 19.99,
            },
            rating: {
              type: 'string',
              description: 'Film rating',
              example: 'PG-13',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
            },
          },
        },
      },
    },
  },
  // Path to the API routes files
  apis: ['./src/routes/*.js', './src/app.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
