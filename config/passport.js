var bCrypt = require('bcrypt-nodejs');


  var LocalStrategy = require('passport-local').Strategy;
  var User = require('./app/models/user');

module.exports = function(passport, user) {
  passport.use('local-signup', new LocalStrategy(

    {
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true // allows us to pass back the entire request to the callback

    },

    function(req, email, password, done) {
      var generateHash = function(password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
      };

      User.findOne({
        where: {
          email: email
        }
      }).then(function(user) {
        if (user) {
          console.log('person is already signed up');
          return done(null, false, {
            message: 'That email is already taken'
          });

        } else {
          var userPassword = generateHash(password);
          var data = {
            username: req.body.username,
            password: userPassword,
            name: req.body.name,
            email: email
          };
          console.log(data);
          User.create(data).then(function(newUser, created) {
            if (!newUser) {
              console.log('asdf');
              return done(null, false);
            }
            if (newUser) {
              return done(null, newUser);
            }
          });
        }

      });
    }

  ));

  //LOCAL SIGNIN
  passport.use('local-signin', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true // allows us to pass back the entire request to the callback
    },

    function(req, username, password, done) {
      var User = user;
      var isValidPassword = function(userpass, password) {
        return bCrypt.compareSync(password, userpass);
      };
      User.findOne({
        where: {
          username: username
        }
      }).then(function(user) {
        console.log(username);
        console.log(isValidPassword(user.password, password));
        if (!user) {
          return done(null, false, {
            message: 'Email does not exist'
          });
        }
        if (!isValidPassword(user.password, password)) {
          return done(null, false, {
            message: 'Incorrect password.'
          });
        }
        var userinfo = user.get();
        return done(null, userinfo);
      }).catch(function(err) {
        console.log("Error:", err);
        return done(null, false, {
          message: 'Something went wrong with your Signin'
        });
      });
    }
  ));

  //serialize
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // deserialize user
  passport.deserializeUser(function(id, done) {
    User.findById(id).then(function(user) {
      if (user) {
        done(null, user.get());
      } else {
        done(user.errors, null);
      }
    });
  });

};
