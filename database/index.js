
const Sequalize = require('sequelize');

const config = {
  host: process.env.SERVER_MYSQL_HOST || '127.0.0.1',
  port: 3306,
  database: 'api_server',
  user: 'api_server_admin',
  password: process.env.SERVER_MYSQL_PASSWORD || 'power123!@#',
};

const sequelize = new Sequalize(config.database, config.user, config.password, {
  host: config.host,
  port: config.port,
  dialect:'mysql',
});

module.exports = {
  sequelize,
  Item: require('./item.model')(sequelize),
  Comment: require('./comment.model')(sequelize),
};

