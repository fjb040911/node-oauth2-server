const passport = require('passport');
const login = require('connect-ensure-login');

module.exports.index = (request, response) => response.send('OAuth 2.0 Server');

module.exports.loginForm = (request, response) => response.render('login', {"title":"test","layout":"layout.ejs"});


module.exports.login = passport.authenticate('local', { successReturnToOrRedirect: '/', failureRedirect: '/login' });

module.exports.logout = (request, response) => {
  request.logout();
  response.redirect('/');
};
