const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
// we'll be adding to this model
const { Playlist } = require('./../models.js')
// middleware to check the user is logged
const { isLoggedIn } = require('./../utils.js')

// Get all the playlists in the database
router.get('/playlist/', function(req, res, next) {
  
  Playlist.find()
  .populate("_owner")
  .then(function(playlists) {
    res.status(200).send(playlists)
  })
  .catch(function(error) {
    res.status(500).send(error)
  }); 
  
})

// Get only the current user's playlists 
router.get('/playlist/my', isLoggedIn, function(req, res, next) {

  Playlist.find(
    {"_owner": mongoose.Types.ObjectId(req.session.user._id)})
  .populate("_owner")
  .then(function(playlists) {
    res.status(200).send(playlists)
  })
  .catch(function(error) {
    res.status(500).send(error)
  }); 
  
})

// Add a playlist - give it a name only
router.post('/playlist/:name', isLoggedIn, function(req, res, next) {

  Playlist.create({ 
    name: req.params.name, 
    _owner: req.session.user._id })
  .then(function() {
    res.status(200).send()
  })
  .catch(function(error) {
    res.status(500).send()
  }); 
    
})

// Delete the playlist
router.delete('/playlist/:id', isLoggedIn, function(req, res, next) {
  
  Playlist.findOneAndDelete({
    "_id": mongoose.Types.ObjectId(req.params.id),
    "_owner": mongoose.Types.ObjectId(req.session.user._id)
  })
  .then(function(foundOne) {
    if(!foundOne) res.status(404).send()
    else res.status(200).send()
  })
  .catch(function(error) {
    res.status(500).send(error)
  }); 
    
})
  
// Add a track (link) to playlist
router.post('/playlist/link/:id', isLoggedIn, function(req, res, next) {
  
  Playlist.findOneAndUpdate({
      "_id": mongoose.Types.ObjectId(req.params.id),
      "_owner": mongoose.Types.ObjectId(req.session.user._id)
    },
    { $push: { links: req.body.link } })
  .then(function(foundOne) {
    if(!foundOne) res.status(404).send()
    else res.status(200).send()    
  })
  .catch(function(error) {
    res.status(500).send(error)
  }); 
    
})
  
// Delete a track (link) from a playlist
router.delete('/playlist/link/:id', isLoggedIn, function(req, res, next) {
  
  Playlist.findOneAndUpdate({
      "_id": mongoose.Types.ObjectId(req.params.id),
      "_owner": mongoose.Types.ObjectId(req.session.user._id)
    },
    { $pull: { links: req.body.link } })
  .then(function(foundOne) {
    if(!foundOne) res.status(404).send()
    else res.status(200).send() 
  })
  .catch(function(error) {
    res.status(500).send(error)
  }); 
  
})

module.exports = router;
