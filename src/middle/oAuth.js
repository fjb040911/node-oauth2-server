const passport = require('passport');
const PassportLocalStrategy = require('passport-local');

const { User } = require('../models');

const auth = app => {
    const authStrategy = new PassportLocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    }, function(username, password, done) {
        User.authenticate(username, password, function(error, user){
            done(error, user, error ? { message: error.message } : null);
        });
    });
    
    var authSerializer = (user, done) => {
        done(null, user._id);
    };
    
    var authDeserializer = (id, done) => {
        User.findById(id, done);
    };
    
    passport.use(authStrategy);
    passport.serializeUser(authSerializer);
    passport.deserializeUser(authDeserializer);

    app.use(require('connect-flash')()); // see the next section
    app.use(passport.initialize());
}

module.exports = auth;
