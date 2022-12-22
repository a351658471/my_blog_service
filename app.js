var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var notesRouter = require('./routes/notes');
var uploadRouter = require('./routes/upload');
var profileRouter = require('./routes/profile');
var skillsRouter = require('./routes/skills');
var commentsRouter = require('./routes/comments');
const expressJWT  = require('express-jwt')
const global = require('./global')
var app = express();
app.use(
  expressJWT.expressjwt({ secret: global.secretKey, algorithms: ["HS256"] }).unless({
    path: [/^\/users\//,/^\/api\//],
  })
);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public/',express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/notes', notesRouter);
app.use('/upload', uploadRouter);
app.use('/profile',profileRouter)
app.use('/skills',skillsRouter)
app.use('/comments',commentsRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  if(err.name === 'UnauthorizedError'){
    return res.send({code:401, message:'无效token'})
  }
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
