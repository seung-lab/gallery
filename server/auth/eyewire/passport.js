var passport = require('passport');
var OAuth2Strategy = require('passport-oauth2');

console.log(OAuth2Strategy);

exports.setup = function (User, config) {
  passport.use(new OAuth2Strategy({
    authorizationURL: 'http://eyewire.org/oauth2/1.0/auth',
    tokenURL: 'http://eyewire.org/oauth2/1.0/exchange',
    clientID: config.eyewire.clientID,
    clientSecret: config.eyewire.clientSecret,
    callbackURL: config.eyewire.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {

      User.findOne({
        'eyewire.id': profile.id
      }, function(err, user) {
        if (!user) {
          user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            role: 'user',
            username: profile.username,
            provider: 'eyewire',
            eyewire: profile._json
          });
          user.save(function(err) {
            if (err) done(err);
            return done(err, user);
          });
        } else {
          return done(err, user);
        }
      });
    }
  ));
};
