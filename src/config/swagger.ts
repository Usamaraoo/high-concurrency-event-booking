import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Event Booking API',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:4000',
      },
    ],
  },
apis: ['./src/modules/**/*.ts', './src/routes.ts'],
};

export const specs = swaggerJsdoc(options);