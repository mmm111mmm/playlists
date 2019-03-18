const express = require('express')
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

const app = express()
app.use(bodyParser.json())

// TODO: Fix vuejs stuff on mobile
// login / register
// add owner to playlist
// list my playlists

app.listen(3000, function() {
  console.log("Listening on port 3000")
})

mongoose.connect('mongodb://localhost/playlists', { useNewUrlParser: true });
const Playlist = mongoose.model('playlists', { name: String, links: [String] });

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
