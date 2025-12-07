const mongoose = require('mongoose');
const User = require('../models/user-model');
const Playlist = require('../models/playlist-model');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;



db.findUserByEmail = async function (email) {
    try {
        console.log("Searching for email:", email);
        return await User.findOne({ email });
    } catch (err) {
        console.error("Error in findUserByEmail:", err);
        return null;
    }
};

db.createUser = async function (userData) {
    try {
        console.log("Creating user:", userData);
        return await User.create(userData);
    } catch (err) {
        console.error("Error in createUser:", err);
        throw err;
    }
};



// Get all playlists belonging to a user
db.getAllPlaylists = async function (email) {
    try {
        console.log("Fetching playlists for:", email);
        return await Playlist.find({ ownerEmail: email });
    } catch (err) {
        console.error("Error in getAllPlaylists:", err);
        return [];
    }
};

// Create a new playlist
db.createPlaylist = async function (data) {
    try {
        console.log("Creating playlist:", data);
        return await Playlist.create(data);
    } catch (err) {
        console.error("Error in createPlaylist:", err);
        throw err;
    }
};

// Find playlist by id
db.getPlaylistById = async function (id) {
    try {
        console.log("Fetching playlist:", id);
        return await Playlist.findById(id);
    } catch (err) {
        console.error("Error in getPlaylistById:", err);
        return null;
    }
};

// Update an existing playlist
db.updatePlaylist = async function (id, updateData) {
    try {
        console.log("Updating playlist:", id, updateData);
        return await Playlist.findByIdAndUpdate(id, updateData, { new: true });
    } catch (err) {
        console.error("Error in updatePlaylist:", err);
        return null;
    }
};

// Delete playlist
db.deletePlaylist = async function (id) {
    try {
        console.log("Deleting playlist:", id);
        return await Playlist.findByIdAndDelete(id);
    } catch (err) {
        console.error("Error in deletePlaylist:", err);
        return null;
    }
};

module.exports = db;
