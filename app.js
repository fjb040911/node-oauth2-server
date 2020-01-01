const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const oAuth = require('./src/middle/oAuth');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const oauthController = require('./src/controller/oauthController');
const auth2 = require('./src/controller/auth2');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

oAuth(app)

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.get('/login', oauthController.loginForm);
app.post('/login', oauthController.login);

app.get('/dialog/authorize', auth2.authorization);
app.post('/dialog/authorize/decision', auth2.decision);
app.post('/oauth/token', auth2.token);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
