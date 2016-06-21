'use strict';

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const httpErrors = require('http-errors');
const debug = require('debug')('brewbuddie:server');

const handleError = require('./lib/app-error');
const parserBearerAuth = require('./lib/parse-bearer-auth');
const authRouter = require('./routes/auth-route');
const originRouter = require('./routes/origin-router');

const app = express();
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/authdev';

mongoose.connect(mongoURI);

app.use(morgan('dev'));

app.all('/', parserBearerAuth, function(req, res){
  console.log('req.userId', req.userId);
  res.send('a Cup of Coffee!');
});

app.use('/api', authRouter);
app.use('/api', originRouter);

app.all('*', function(req, res, next){
  debug('404 * route');
  next(httpErrors(404, 'Not Found'));
});

app.use(handleError);

// start server
const server = app.listen(port, function(){
  debug('server up <o)))><|', port);
});

server.isRunning = true;
module.exports = server;
