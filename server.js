const
  express = require('express'),
  app = express(),
  passport = require('passport'),
  session = require('express-session'),
  bodyParser = require('body-parser'),
  env = require('dotenv').load(),
  path = require('path'),
  exphbs = require('express-handlebars');
  PORT = process.env.PORT || 8080;

var db = require('./app/models');

//For BodyParser
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// For Passport
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(express.static('app/public'));

// For Handlebars
app.set('views', './app/views')
app.engine('hbs', exphbs({
  extname: '.hbs'
}));
app.set('view engine', '.hbs');

// models
var models = require('./app/models');

// routes
var authRoute = require('./app/routes/auth.js')(app, passport);

//load passport strategies
require('./app/config/passport.js')(passport, models.user);
require('./app/routes/htmlRoutes.js')(app);
require('./app/routes/apiRoutes.js')(app);
require('./app/routes/postRoutes.js')(app);

//Sync Database
// models.sequelize.sync().then(function() {
//   console.log('Nice! Database looks fine')
// }).catch(function(err) {
//   console.log(err, "Something went wrong with the Database Update!")
// });
//
// app.listen(5000, function(err) {
//   if (!err)
//     console.log("Site is live on 5000");
//   else console.log(err)
// });

db.sequelize.sync({
  force: true
}).then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});
