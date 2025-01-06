// swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
  info: {
    title: 'WAYMOU API',
    version: '1.0.0',
    description: 'API documentation',
  },
  // servers: [
  //   {
  //     url: 'http://localhost:3000', // Your API URL
  //   },
  // ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT', // Optional, can be used if you are using JWT
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  },
  apis: ['./routes/*.js'], // Path to your API routes
};

const specs = swaggerJsdoc(options);

module.exports = {
  specs,
  swaggerUi,
};