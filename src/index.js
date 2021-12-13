const HapiSwagger = require('hapi-swagger');
const Pino = require('hapi-pino');

const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const Schwifty = require('@hapipal/schwifty');

const Pack = require('../package.json');
const routes = require('./routes');
const models = require('./models');
const config = require('../config');

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost',
  });

  const swaggerOptions = {
    info: {
      title: 'Mini e-Commerce API Documentation',
      version: Pack.version,
    },
    documentationPath: '/docs',
  };

  await server.register({
    plugin: routes,
  });

  await server.register({
    plugin: Pino,
    options: {
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: process.env.NODE_ENV !== 'production',
        },
      },
      redact: ['req.headers.authorization'],
    },
  });

  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);

  await server.register({
    plugin: Schwifty,
    options: {
      knex: {
        client: 'pg',
        connection: {
          host: config.db.host,
          user: config.db.username,
          password: config.db.password,
          database: config.db.database,
        },
      },
    },
  });

  await server.register({
    plugin: models,
  });

  await server.initialize();

  await server.start();
  server.logger.info('Server running on %s', server.info.uri);

  return server;
};

module.exports = {
  init,
};
