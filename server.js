const express = require('express')
// Used for the session storage (login etc)
const session = require('express-session')
const mongoStore = require('connect-mongo')(session);
// We'll be passing in json etc as POST body
const bodyParser = require('body-parser')
// How we store our data with Mongo
const mongoose = require('mongoose')

// TODO: 
// middleware for ensure we're logged in
// can't delete, edit lists, add lists to other users's playlists
// limit all playlists
// limit my playlists
// -- later
// 400 errors
// next error
// tests
// forget password option
// don't show password in playslists with users
// (other project) Fix vuejs stuff on mobile

// Give mongoose some defaults to stop node complaining...
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

// Setup express, and the ability to get JSON as the POST body
const app = express()
app.use(bodyParser.json())
// Setup the session storage for keeping users logged in
app.use(session({ 
  secret: "hello there!",
  saveUninitialized: false,
  resave: true,
  store: new mongoStore({ mongooseConnection: mongoose.connection })  
}));

// Initialise the playlists and auth routes
app.use('/', require('./routes/playlists.js'))
app.use('/', require('./routes/auth.js'))

// Start listening
app.listen(3000, function() {
  console.log("Listening on port 3000")
})