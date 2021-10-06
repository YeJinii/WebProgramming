const passport = require('passport');
const local = require('./localStrategy');
const User = require('../schemas/user');

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => { 
    User.find().where('_id').equals(id) 
      .then(user => done(null, user[0]))
      .catch(err => done(err));
  });
  local();
};

