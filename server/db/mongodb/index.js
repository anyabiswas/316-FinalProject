const mongoose = require('mongoose');
const DatabaseManager = require('../DatabaseManager');
const User = require('../../models/user-model');
const Playlist = require('../../models/playlist-model');

class MongoDBDatabaseManager extends DatabaseManager {
    async connect() {
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log(' Connected to MongoDB');
    }

    async disconnect() {
        await mongoose.disconnect();
        console.log(' Disconnected from MongoDB');
    }

    async createUser(userData) {
        return await User.create(userData);
    }

    async findUserByEmail(email) {
        return await User.findOne({ email });
    }

    async createPlaylist(playlistData) {
        const playlist = await Playlist.create({
            name: playlistData.name,
            songs: playlistData.songs || [],
            ownerEmail: playlistData.ownerEmail
        });

        return {
            _id: playlist._id.toString(),
            id: playlist._id.toString(), 
            name: playlist.name,
            songs: playlist.songs,
            ownerEmail: playlist.ownerEmail
        };
    }

    async getAllPlaylists(ownerEmail) {
        const playlists = await Playlist.find({ ownerEmail });

        return playlists.map(p => ({
            _id: p._id.toString(),
            id: p._id.toString(),
            name: p.name,
            songs: p.songs,
            ownerEmail: p.ownerEmail
        }));
    }

    async getPlaylistById(id) {
        const p = await Playlist.findById(id);
        if (!p) return null;

        return {
            _id: p._id.toString(),
            id: p._id.toString(),
            name: p.name,
            songs: p.songs,
            ownerEmail: p.ownerEmail
        };
    }

    async updatePlaylist(id, updateData) {
        const p = await Playlist.findByIdAndUpdate(
            id,
            { name: updateData.name, songs: updateData.songs },
            { new: true }
        );

        if (!p) return null;

        return {
            _id: p._id.toString(),
            id: p._id.toString(),
            name: p.name,
            songs: p.songs,
            ownerEmail: p.ownerEmail
        };
    }

    async deletePlaylist(id) {
        const playlist = await Playlist.findById(id);
        if (playlist) {
            const user = await User.findOne({ email: playlist.ownerEmail });
            if (user) {
                user.playlists.pull(id);
                await user.save();
            }
        }
        await Playlist.findByIdAndDelete(id);
        return true;
    }
}

module.exports = MongoDBDatabaseManager;