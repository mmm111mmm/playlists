
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/playlists', { useNewUrlParser: true });
const User = mongoose.model('users', { 
    password: String, 
    username: { type: String, index: { unique: true }  }
});
const Playlist = mongoose.model('playlists', { 
    name: String, 
    links: [String],
    _owner: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
});

module.exports = { Playlist, User }