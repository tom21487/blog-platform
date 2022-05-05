// Configure .env file
var dotenv = require("dotenv");
dotenv.config();

// Require mongo wrapper
var mongo = require('./mongo');

// MongoDB connect
mongo.connect(function(err) {
  // Error handling
  if (err) { console.error(err); return; }

  // Start app after mongoDB has connected
  console.log("Connected successfully to MongoDB.");

  // Core requires
  var express = require('express');
  var path = require('path');
  var createError = require('http-errors');
  var cookieParser = require("cookie-parser");
  var verifyToken = require("./verifyToken");
  
  // Routers
  var indexRouter = require('./routes/index');
  var aboutRouter = require('./routes/about');
  var postRouter = require('./routes/post');
  var contactRouter = require('./routes/contact');
  var controlRouter = require('./routes/control');
  var userRouter = require('./routes/user');

  var app = express();
  var port = process.env.PORT || 3000;

  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(cookieParser());

  app.use('/:language', indexRouter);
  app.use('/:language/about', aboutRouter);
  app.use('/:language/contact', contactRouter);
  app.use('/:language/user/control', verifyToken, controlRouter);
  app.use('/:language/user', verifyToken, userRouter);
  app.use('/:language/:type', postRouter);
  
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

  app.listen(port, function() {
    console.log(`Express app listening at http://localhost:${port} .`);
  });

  process.on('SIGINT', function() {
    mongo.close(function() {
      console.log('\nConnection to MongoDB closed by user.');
      process.exit(0);
    });
  });
});
