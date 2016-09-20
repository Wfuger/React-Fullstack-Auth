const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function (req, res, next) {
  // User has already had their email and pw auth'd
  // We just need to give them a token

  res.send({ token: tokenForUser(req.user) });
}

exports.signup = function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) return res.status(422).send({ error: 'You must provide email and password' });


  // See if a user with a given email exists
  User.findOne({ email: email }, function (err, existingUser) {
    if (err) return next(err);
    if(existingUser) {
      // If a user with email does exist, return an Error
      return res.status(422).send({ error: 'Email is in use' })
    }

    // If a user with email does NOT exist, create and save user record
    const user = new User({
      email: email,
      password: password
    })
    console.log(user, 'user new User');
    user.save(function (err) {
      console.log('user saved');
      if (err) return next(err);
    });

  // Respond to request indicating the user was created
  res.json({token: tokenForUser(user)});
  })
}
