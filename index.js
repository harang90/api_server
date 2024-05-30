
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./database');

const itemsRouter = require('./routes/items');
const sheetsRouter = require('./routes/sheets');
const playRouter = require('./routes/play');

async function launchServer() {

  const app = express();

  app.use(bodyParser.json());

  app.get('/', (req, res) => {
    res.json({ message: 'Hello World!' });
  });

  app.use('/items', itemsRouter);
  app.use('/sheets', sheetsRouter);
  app.use('/play', playRouter);

  try {
    await sequelize.sync({ alter: true });
    console.log('Database is ready');
  } catch (err) {
    console.log('Unable to connect to the database:');
    console.log(err);
    process.exit(Elements.EXIT_FAILURE);
  }

  const port = process.env.PORT || 8080;
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });

}

launchServer();
