var passport = require('passport');
var OAuth2Strategy = require('passport-oauth2');

var request = require('request');


exports.setup = function (User, config) {

  passport.use(new OAuth2Strategy({
    authorizationURL: 'https://eyewire.org/oauth2/1.0/auth',
    tokenURL: 'https://tasking.eyewire.org/oauth2/1.0/exchange',
    clientID: config.eyewire.clientID,
    clientSecret: config.eyewire.clientSecret,
    callbackURL: config.eyewire.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
            
    processAccount( accessToken, done);
  
  }));

  
  function processAccount (accessToken, done) {
     
    getAccount(accessToken, function(account) {


      User.findOne({
        'eyewire.id': account.id
      }, 

      function(err, user) {


        if (!user) {
          getBio(account.username, function(bio) {

            user = new User({
              role: bio.role,
              username: account.username,
              'eyewire.id': account.id,
              provider: 'eyewire',
              eyewire: bio,
            });
            
            user.save(function(err) {
              if (err) done(err);
              return done(err, user);
            });

          });     
          
        }
        else {
          
          return done(err, user);

        }
      
      });
    });

  }



  function getAccount(accessToken, callback) {
    
    var url = 'https://eyewire.org/2.0/account?access_token='+ accessToken;

    request(url, function (error, response, body) {
    
      if (!error && response.statusCode === 200) {

        var info = JSON.parse(body);
        callback(info); // Show the HTML for the Modulus homepage.

      }
      else {
        console.error( error );
      }
    
    });

  }

  function getBio( username , callback ) {

    var url = 'http://eyewire.org/1.0/player/'+username+'/bio';

     request(url, function (error, response, body) {
    
      if (!error && response.statusCode === 200) {

        var info = JSON.parse(body);

        if ( info.roles.indexOf('admin') !== -1){

          info.role = 'admin';

        } 
        else {
          info.role = 'user';

        }
        callback(info); // Show the HTML for the Modulus homepage.

      }
      else {
        console.error( error );
      }
    
    });

  }

};




