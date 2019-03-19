const express = require('express');
const mongoose = require('mongoose');
const { Playlist } = require('./../models.js')
const router = express.Router();

// Get all the playlists in the database
router.get('/playlist/', function(request, response, next) {
  
  Playlist.find()
  .populate("_owner")
  .then(function(playlists) {
      response.status(200).send(playlists)
  })
  .catch(function(error) {
      response.status(500).send(error)
  }); 
  
})

// Get only the current user's playlists 
router.get('/playlist/my', function(request, response, next) {
  Playlist.find({"_owner": mongoose.Types.ObjectId(request.session.user._id)})
  .populate("_owner")
  .then(function(playlists) {
      response.status(200).send(playlists)
  })
  .catch(function(error) {
      response.status(500).send(error)
  }); 
  
})

// Add a playlist - give it a name only
router.post('/playlist/:name', function(request, response, next) {

  Playlist.create({ 
    name: request.params.name, 
    _owner: request.session.user._id })
  .then(function() {
    response.status(200).send()
  })
  .catch(function(error) {
    response.status(500).send()
  }); 
    
})

// Delete the playlist
router.delete('/playlist/:id', function(request, response, next) {
  
  Playlist.findByIdAndDelete(request.params.id)
  .then(function() {
    response.status(200).send()
  })
  .catch(function(error) {
    response.status(500).send(error)
  }); 
    
})
  
// Add a track (link) to playlist
router.post('/playlist/link/:id', function(request, response, next) {
  
  Playlist.findByIdAndUpdate(
    request.params.id, 
    { $push: { links: request.body.link } })
  .then(function() {
    response.status(200).send()
  })
  .catch(function(error) {
    response.status(500).send(error)
  }); 
    
})
  
// Delete a track (link) from a playlist
router.delete('/playlist/link/:id', function(request, response, next) {
  
  Playlist.findByIdAndUpdate(
    request.params.id, 
    { $pull: { links: request.body.link } })
  .then(function() {
    response.status(200).send()
  })
  .catch(function(error) {
    response.status(500).send(error)
  }); 
  
})

module.exports = router;
