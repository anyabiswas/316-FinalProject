//const Playlist = require('../models/playlist-model'); 
//const User = require('../models/user-model'); 
const db = require('../db');
const auth = require('../auth')
const Song = require("../models/song-model");
/*
    This is our back-end API. It provides all the data services
    our database needs. Note that this file contains the controller
    functions for each endpoint.
    
    @author McKilla Gorilla
*/
createPlaylist = async (req, res) => {
    const userIdOrEmail = auth.verifyUser(req);
    if(!userIdOrEmail){ 
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    const body = req.body;
    if (!body || !body.name) {
        return res.status(400).json({ errorMessage: 'Playlist name required' });
    }


    try {
        
        const user = await db.findUserByEmail(userIdOrEmail); 
        if (!user) return res.status(404).json({ errorMessage: 'User not found' });

        const playlist = await db.createPlaylist({
            name: body.name,
            songs: body.songs || [],
            ownerEmail: user.email
        });

        console.log("created playlist:", playlist);
        return res.status(201).json({ success: true, playlist });

    } catch (err) {
        console.log(err);
        return res.status(400).json({ errorMessage: 'Playlist Not Created!' });
    }
}

deletePlaylist = async (req, res) => {
    const userIdOrEmail = auth.verifyUser(req);
    if (!userIdOrEmail) return res.status(400).json({ errorMessage: 'UNAUTHORIZED' });


    try {
        
        const user = await db.findUserByEmail(userIdOrEmail);
        if (!user) return res.status(404).json({ errorMessage: 'User not found' });

        const playlist = await db.getPlaylistById(req.params.id);
        if (!playlist) return res.status(404).json({ errorMessage: 'Playlist not found!' });


        if (playlist.ownerEmail !== user.email) {
            return res.status(400).json({ errorMessage: 'Authentication error' });
        }

        await db.deletePlaylist(req.params.id);
        return res.status(200).json({ success: true });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ errorMessage: err.message });
    }
}


getPlaylistById = async (req, res) => {
    const userIdOrEmail = auth.verifyUser(req);
    if (!userIdOrEmail) return res.status(400).json({ errorMessage: 'UNAUTHORIZED' });

    try {
        const user = await db.findUserByEmail(userIdOrEmail);
        if (!user) return res.status(404).json({ errorMessage: 'User not found' });

        const playlist = await db.getPlaylistById(req.params.id);
        if (!playlist) return res.status(404).json({ success: false, error: 'Playlist not found' });

        
        if (playlist.ownerEmail !== user.email) {
            return res.status(400).json({ success: false, description: 'Authentication error' });
        }

        return res.status(200).json({ success: true, playlist });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ success: false, error: err.message });
    }
}


getPlaylistPairs = async (req, res) => {
    const userIdOrEmail = auth.verifyUser(req);
    console.log("verifyUser returned:", userIdOrEmail); 
    if (!userIdOrEmail) return res.status(400).json({ errorMessage: 'UNAUTHORIZED' });

    try {
        const user = await db.findUserByEmail(userIdOrEmail);
        if (!user) return res.status(404).json({ errorMessage: 'User not found' });

        const playlists = await db.getAllPlaylists(user.email);
        if (!playlists || playlists.length === 0) {
            return res.status(200).json({ success: true, idNamePairs: [] });
        }

        const idNamePairs = playlists.map(p => ({
            _id: p._id || p.id,
            name: p.name
        }));

        return res.status(200).json({ success: true, idNamePairs });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ success: false, error: err.message });
    }
}

getPlaylists = async (req, res) => {
    const userIdOrEmail = auth.verifyUser(req);
    if (!userIdOrEmail) return res.status(400).json({ errorMessage: 'UNAUTHORIZED' });

    try {
        const playlists = await Playlist.find({});
        if (!playlists.length) return res.status(404).json({ success: false, error: 'Playlists not found' });

        return res.status(200).json({ success: true, data: playlists });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ success: false, error: err.message });
    }
}

updatePlaylist = async (req, res) => {

    const userIdOrEmail = auth.verifyUser(req);
    if (!userIdOrEmail) return res.status(400).json({ errorMessage: 'UNAUTHORIZED' });

   
    const playlistId = req.params.id;
    const playlistData = req.body.playlist || req.body;
    const { name, songs } = playlistData;


    if (!name)
        return res.status(400).json({ errorMessage: "Playlist name required" });

    try {

        const user = await db.findUserByEmail(userIdOrEmail);
        if (!user) return res.status(404).json({ errorMessage: 'User not found' });

        const playlist = await db.getPlaylistById(req.params.id);
        if (!playlist) return res.status(404).json({ errorMessage: "Playlist not found" });

        
        if (playlist.ownerEmail !== user.email) {
            return res.status(400).json({ success: false, description: 'Authentication error' });
        }

        const updated = await db.updatePlaylist(playlistId, {
            name,
            songs: songs || []
        });

        return res.status(200).json({
            success: true,
            id: updated.id,
            message: "Playlist updated!",
            playlist: updated
        });


    } catch (err) {
        console.log(err);
        return res.status(400).json({ success: false, error: err.message });
    }
}


getAllSongs = async (req, res) => {
    try {
        const songs = await Song.find({});
        return res.status(200).json(songs); 
    } catch (err) {
        console.log(err);
        return res.status(400).json({ errorMessage: "Failed to load songs" });
    }
};

copySongInPlaylist = async (req, res) => {
    try {
        const playlistId = req.params.id;
        const { index } = req.body;

        const playlist = await Playlist.findById(playlistId).populate("songs");

        if (!playlist) {
            return res.status(404).json({ success: false, message: "Playlist not found" });
        }

        const originalSong = playlist.songs[index];
        if (!originalSong) {
            return res.status(400).json({ success: false, message: "Invalid song index" });
        }

       
        const clonedSong = await Song.create({
            title: originalSong.title,
            artist: originalSong.artist,
            year: originalSong.year,
            youTubeId: originalSong.youTubeId,
            ownerEmail: playlist.ownerEmail 
        });

        
        playlist.songs.splice(index + 1, 0, clonedSong._id);
        await playlist.save();

        return res.status(200).json({ success: true, playlist });
    }
    catch (err) {
        return res.status(500).json({ success: false, error: err });
    }
};


removeSongFromPlaylist = async (req, res) => {
    try {
        const playlistId = req.params.id;
        const { index } = req.body;

        const playlist = await Playlist.findById(playlistId);

        if (!playlist) {
            return res.status(404).json({ success: false, message: "Playlist not found" });
        }

        if (index < 0 || index >= playlist.songs.length) {
            return res.status(400).json({ success: false, message: "Invalid song index" });
        }

        playlist.songs.splice(index, 1);
        await playlist.save();

        return res.status(200).json({ success: true, playlist });
    }
    catch (err) {
        return res.status(500).json({ success: false, error: err });
    }
};


reorderSongsInPlaylist = async (req, res) => {
    try {
        const playlistId = req.params.id;
        const { oldIndex, newIndex } = req.body;

        const playlist = await Playlist.findById(playlistId);

        if (!playlist) {
            return res.status(404).json({ success: false, message: "Playlist not found" });
        }

        const arr = playlist.songs;

        if (
            oldIndex < 0 || oldIndex >= arr.length ||
            newIndex < 0 || newIndex >= arr.length
        ) {
            return res.status(400).json({ success: false, message: "Invalid indices" });
        }

        const [moved] = arr.splice(oldIndex, 1);
        arr.splice(newIndex, 0, moved);

        await playlist.save();
        return res.status(200).json({ success: true, playlist });
    }
    catch (err) {
        return res.status(500).json({ success: false, error: err });
    }
};


module.exports = {
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getPlaylistPairs,
    getPlaylists,
    updatePlaylist,
    getAllSongs, 
    copySongInPlaylist,
    removeSongFromPlaylist,
    reorderSongsInPlaylist,
}
