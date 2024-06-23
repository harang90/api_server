
const envPath = process.env.NODE_ENV === 'production' ? './.env.production' : './.env.development';
require('dotenv').config({ path: envPath });

const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sequelize } = require('./database');

const itemsRouter = require('./routes/item.router.js');
const sheetsRouter = require('./routes/sheet.router.js');
const playRouter = require('./routes/play.router.js');
const commentRouter = require('./routes/comment.router.js');

async function launchServer() {

  const app = express();

  app.use(bodyParser.json());

  app.use(cors({
    origin: process.env.CORS_ORIGIN
  }));

  app.get('/', (req, res) => {
    res.json({ message: 'Hello World!' });
  });

  app.use('/items', itemsRouter);
  app.use('/sheets', sheetsRouter);
  app.use('/play', playRouter);
  app.use('/comments', commentRouter);

  try {
    await sequelize.sync({ alter: true });
    console.log('Database is ready');
  } catch (err) {
    console.log('Unable to connect to the database:');
    console.log(err);
    process.exit(1);
  }

  const port = process.env.PORT || 10000;

  if (process.env.NODE_ENV === 'production') {
    const httpsOptions = {
      key: fs.readFileSync('./server.key'),
      cert: fs.readFileSync('./excelgif_com.crt'),
      ca: fs.readFileSync('./excelgif_com.ca-bundle')
    };
    https.createServer(httpsOptions, app).listen(port, () => {
      console.log(`Server listening on port ${port} with HTTPS`);
    });
  } else {
    http.createServer(app).listen(port, () => {
      console.log(`Server listening on port ${port} with HTTP`);
    });
  }

}

launchServer();
