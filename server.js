// Require mongo wrapper
var mongo = require('./mongo');

// MongoDB connect
mongo.connect(function(err) {
  // Error handling
  if (err) { console.error(err); return; }

  // Start app after mongoDB has connected
  console.log("Connected successfully to MongoDB, starting Express app.");

  // Core requires
  var express = require('express');
  var path = require('path');
  var createError = require('http-errors');

  // Routers
  var indexRouter = require('./routes/index');
  var aboutRouter = require('./routes/about');
  var projectsRouter = require('./routes/projects');
  var blogRouter = require('./routes/blog');
  var createRouter = require('./routes/create');

  var app = express();
  var port = 3000;

  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname, 'public')));

  app.use('/', indexRouter);
  app.use('/about', aboutRouter);
  app.use('/projects', projectsRouter);
  app.use('/blog', blogRouter);
  app.use('/create', createRouter);
  
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
    console.log(`App listening at http://localhost:${port}`);
  });

  process.on('SIGINT', function() {
    mongo.close(function() {
      console.log('Connection to MongoDB closed by user.');
      process.exit(0);
    });
  });
});
