const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/playlists');

var userSchema = { 
    password: { type: String, required: true }, 
    username: { type: String, required: true, index: { unique: true }  }
}

const User = mongoose.model('users', userSchema);

const Playlist = mongoose.model('playlists', { 
    name: { type: String, required: true }, 
    links: [String],
    _owner: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
});

module.exports = { Playlist, User, userSchema }
