require('dotenv').config()
const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const SpotifyStrategy = require('passport-spotify').Strategy;
const bcrypt = require('bcrypt');

const app = express()
app.use(bodyParser.json())
app.use(session({ secret: "cats" }));

// mongo stuff
mongoose.connect('mongodb://localhost/playlists', { useNewUrlParser: true });
const Playlist = mongoose.model('playlists', { name: String, links: [String] });
const User = mongoose.model('users', { username: String, password: String });
const SpotifyUser = mongoose.model('spotifyusers', { spotifyId: String });

// passport
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((loggedInUser, cb) => {
  cb(null, loggedInUser._id);
});
passport.deserializeUser((userIdFromSession, cb) => {
  User.findById(userIdFromSession)
    .then(userDocument => {
      cb(null, userDocument);
    })
    .catch(err => {
      cb(err);
    })
});

passport.use(new LocalStrategy(
  (username, password, done) => {
    User.findOne({ username })
      .then(foundUser => {
        if (!foundUser) {
          done(null, false, { message: 'Incorrect username' });
          return;
        }
        if (!bcrypt.compareSync(password, foundUser.password)) {
          done(null, false, { message: 'Incorrect password' });
          return;
        }
        done(null, foundUser);
      })
      .catch(err => done(err));
  }
));

passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_SECRET,
      callbackURL: 'http://localhost:3000/spotify/callback'
    },
    function(accessToken, refreshToken, expires_in, profile, done) {
      console.log(accessToken, refreshToken, expires_in, profile)
      SpotifyUser.findOneAndUpdate({ spotifyId: profile.id }, { spotifyId: profile.id }, { upsert: true, new: true })
      .then(user => {
        done(null, user)
      })
      .catch(error => {
        done(error, null)
      })
    }
));

app.get('/spotify', passport.authenticate('spotify', {
  scope: ['user-read-email', 'user-read-private']
}), 
function(req, res) {
  // The request will be redirected to spotify for authentication, so this
  // function will not be called.
});

app.get(
  '/spotify/callback',
  passport.authenticate('spotify'),
  function(req, res) {
    console.log(req.user)
    res.status(200).send()
  }
);

app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { res.status(500).send(err) }
    if (!user) { res.status(400).send("Unknown user") }
    req.logIn(user, function(err) {
      if (err) { res.status(500).send(err) }
      else res.status(200).send(user)
    });
  })(req, res, next);
});

app.post("/signup", function(request, response, next) {
  const salt              = bcrypt.genSaltSync(10);
  const encryptedPassword = bcrypt.hashSync(request.body.password, salt);
  var user = {
    username: request.body.username, 
    password: encryptedPassword
  }
  User.create(user)
  .then(function(success) {
     response.status(200).send()
  })
  .catch(function(error) {
    response.status(500).send(error)
  })
});


// TODO: Fix vuejs stuff on mobile
// login / register
// add owner to playlist
// list my playlists
// list all playlists
// limit all playlists
// limit my playlists
// can't delete, edit lists, add lists to other users's playlists

app.listen(3000, function() {
  console.log("Listening on port 3000")
})

app.post('/playlist/:name', function(request, response, next) {

  Playlist.create({ name: request.params.name })
  .then(function() {
    response.status(200).send()
  })
  .catch(function(error) {
    response.status(500).send()
  }); 
  
})

app.get('/playlist/', function(request, response, next) {
  console.log(request.user)
  Playlist.find()
  .then(function(playlists) {
    response.status(200).send(playlists)
  })
  .catch(function(error) {
    response.status(500).send(error)
  }); 
  
})

app.delete('/playlist/:id', function(request, response, next) {

  Playlist.findByIdAndDelete(request.params.id)
  .then(function() {
    response.status(200).send()
  })
  .catch(function(error) {
    response.status(500).send(error)
  }); 
  
})

app.post('/playlist/link/:id', function(request, response, next) {

  Playlist.findOneAndUpdate(
    request.params.id, 
    { $push: { links: request.body.link } })
  .then(function() {
    response.status(200).send()
  })
  .catch(function(error) {
    response.status(500).send(error)
  }); 
  
})

app.delete('/playlist/link/:id', function(request, response, next) {

  Playlist.findOneAndUpdate(
    request.params.id, 
    { $pull: { links: request.body.link } })
  .then(function() {
    response.status(200).send()
  })
  .catch(function(error) {
    response.status(500).send(error)
  }); 
  
})
