const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

require('dotenv').config();

mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Database connect Error'));
db.once('open', () => {
  console.log('Database is Connected');
});

const authRouter = require('./routes/auth-api');
const sessionRouter = require('./routes/session');
const articleRouter = require('./routes/article-api');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth-api', authRouter);
app.use('/session', sessionRouter);
app.use('/article-api', articleRouter);

module.exports = app;
