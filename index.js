
const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./database');

async function launchServer() {

  const app = express();

  app.use(bodyParser.json());

  app.get('/', (req, res) => {
    res.json({ message: 'Hello World!' });
  });

  try {
    await sequelize.sync();
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
