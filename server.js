/* eslint-disable prefer-destructuring */
const dotenv = require('dotenv');

dotenv.config();
const express = require('express');

const app = express();

const session = require('express-session');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');

// CONTROLLERS
const authCtrl = require('./controllers/authCtrl');

// Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : '3000';

// Mongo DB
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride('_method'));
// Morgan for logging HTTP requests
app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// PUBLIC ROUTES
app.get('/', async (req, res) => {
  const user = req.session.user;

  res.render('index.ejs', { user });
});

app.get('/auth/sign-up', authCtrl.signup);
app.post('/auth/sign-up', authCtrl.register);
app.get('/auth/sign-in', authCtrl.signin);
app.post('/auth/sign-in', authCtrl.login);

// PRIVATE ROUTES

app.get('/auth/sign-out', authCtrl.signout);

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});