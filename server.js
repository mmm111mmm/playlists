const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())
app.use(session({ 
  secret: "hello there!",
  saveUninitialized: false,
  resave: true
 }));

// TODO: Fix vuejs stuff on mobile
// middleware for ensure we're logged in
// can't delete, edit lists, add lists to other users's playlists
// limit all playlists
// limit my playlists
// -- later
// next error
// forget password option
// don't show password in playslists with users

app.listen(3000, function() {
  console.log("Listening on port 3000")
})

app.use('/', require('./playlists.js'))
app.use('/', require('./auth.js'))