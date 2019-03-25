// Read a .env file and put those
// things in process.env.WHATEVER
require('dotenv').config()
// We're using express.js yeah
const express = require('express')
// Used for the session storage (login etc)
const session = require('express-session')
const mongoStore = require('connect-mongo')(session);
// We'll be passing in json etc as POST body
const bodyParser = require('body-parser')
// How we store our data with Mongo
const mongoose = require('mongoose')
// Allow access from websites
const cors = require('cors')

// TODO: 
// add a comment on the link
// add logging.
// -- later
// limit all playlists
// limit my playlists
// forget password option
// don't show password in playlists with users
// -- error messages
// 400 errors on size of string
// 400 errors on size of number
// custom error messages
// -- much later
// tests

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
app.use(cors({
  origin: (origin, cb) => {
    cb(null, origin && origin.startsWith('http://localhost:'))
  },
  optionsSuccessStatus: 200,
  credentials: true
}))
app.use(express.static(process.cwd() + '/public'));

// Initialise the playlists and auth routes
app.use('/', require('./routes/playlists.js'))
app.use('/', require('./routes/auth.js'))

// If the above routes call next(new Error("Panic")) 
// (or next(makeError(400, "Panic")) ) then we end up here.
// If we're in Production we don't send out 500 error messages
// incase they reveal something precious about the server.
app.use(function(err, req, res, next) {
  if (res.headersSent) return
  var stack = (process.env.PRODUCTION == true || !err.stack) ? "" : err.stack.toString()
  if (err.status && err.status == 500 && process.env.PRODUCTION)
    res.status(err.status || 500).send()
  else
    res.status(err.status || 500).json( { message: err.message, stacktrace: stack} )
})

// Start listening
app.listen(3000, function() {
  console.log("Listening on port 3000")
})
