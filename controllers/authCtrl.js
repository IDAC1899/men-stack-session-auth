/* eslint-disable no-empty */
/* eslint-disable no-console */
const bcrypt = require('bcrypt');
const User = require('../models/user');

const SALT_ROUDS = 10;

const signup = async (req, res) => {
  res.render('auth/sign-up.ejs');
};

const register = async (req, res) => {
  try {
    // verify if the username alrady exists
    const userInDatabase = await User.findOne({ username: req.body.username });
    // if the user exists send error msg
    if (userInDatabase) {
      return res.send('Invalid input');
    }
    // else send error msg
    if (req.body.password !== req.body.confirmPassword) {
      return res.send('Invalid input');
    }
    // Encrypt the password
    const hashedPassword = bcrypt.hashSync(req.body.password, SALT_ROUDS);
    req.body.password = hashedPassword;

    // else lets check if the password match
    // if password matches create the new user
    const user = await User.create(req.body);

    req.session.user = {
      username: user.username,
      _id: user._id,
    };
    // redirect to homepage
    req.session.save(() => {
      res.redirect('/');
    });
  } catch (err) {
    console.log(err);
    res.send('something went wrong');
  }
};

const signin = async (req, res) => {
  res.render('auth/sign-in.ejs');
};

const login = async (req, res) => {
  const userInDatabase = await User.findOne({ username: req.body.username });

  // only allow users that exist to login
  if (!userInDatabase) {
    return res.send('Invalid credentials');
  }

  // make sure the user's password matches the req.body.password
  if (!bcrypt.compareSync(req.body.password, userInDatabase.password)) {
    return res.send('Invalid credentials');
  }

  // There is a user AND they had the correct password. Time to make a session!
  // Avoid storing the password, even in hashed format, in the session
  // If there is other data you want to save to `req.session.user`, do so here!
  req.session.user = {
    username: userInDatabase.username,
    _id: userInDatabase._id,
  };

  req.session.save(() => {
    res.redirect('/');
  });
};

const signout = async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};

module.exports = {
  signup,
  register,
  signin,
  login,
  signout,
};