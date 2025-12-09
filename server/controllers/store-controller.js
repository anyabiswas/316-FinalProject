const db = require("../db");
const auth = require("../auth");
const Song = require("../models/song-model");


createPlaylist = async (req, res) => {
    const userEmail = auth.verifyUser(req);
    if (!userEmail) return res.status(400).json({ errorMessage: "UNAUTHORIZED" });

    const { name, songs } = req.body;
    if (!name) return res.status(400).json({ errorMessage: "Playlist name required" });

    try {
        const user = await db.findUserByEmail(userEmail);
        if (!user) return res.status(404).json({ errorMessage: "User not found" });

        const playlist = await db.createPlaylist({
            name,
            songs: songs || [],
            ownerEmail: user.email
        });

        return res.status(201).json({ success: true, playlist });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ errorMessage: "Playlist Not Created!" });
    }
};


copyPlaylist = async (req, res) => {
    const userEmail = auth.verifyUser(req);
    if (!userEmail) return res.status(400).json({ errorMessage: "UNAUTHORIZED" });

    try {
        const original = await db.getPlaylistById(req.params.id);
        if (!original)
            return res.status(404).json({ success: false, error: "Playlist not found" });

        const newPlaylist = await db.createPlaylist({
            name: original.name + " (Copy)",
            songs: [...original.songs],
            ownerEmail: original.ownerEmail
        });

        return res.status(201).json({ success: true, playlist: newPlaylist });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, error: err.message });
    }
};


deletePlaylist = async (req, res) => {
    const userEmail = auth.verifyUser(req);
    if (!userEmail) return res.status(400).json({ errorMessage: "UNAUTHORIZED" });

    try {
        const playlist = await db.getPlaylistById(req.params.id);
        if (!playlist)
            return res.status(404).json({ errorMessage: "Playlist not found" });

        if (playlist.ownerEmail !== userEmail)
            return res.status(400).json({ errorMessage: "Authentication error" });

        await db.deletePlaylist(req.params.id);
        return res.status(200).json({ success: true });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ errorMessage: err.message });
    }
};


getPlaylistById = async (req, res) => {
    const userEmail = auth.verifyUser(req);
    if (!userEmail) return res.status(400).json({ errorMessage: "UNAUTHORIZED" });

    try {
        const playlist = await db.getPlaylistById(req.params.id);
        if (!playlist)
            return res.status(404).json({ success: false, error: "Playlist not found" });

        if (playlist.ownerEmail !== userEmail)
            return res.status(400).json({ success: false, description: "Authentication error" });

        return res.status(200).json({ success: true, playlist });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ success: false, error: err.message });
    }
};


getPlaylistPairs = async (req, res) => {
    const userEmail = auth.verifyUser(req);
    if (!userEmail) return res.status(400).json({ errorMessage: "UNAUTHORIZED" });

    try {
        const playlists = await db.getAllPlaylists(userEmail);
        const pairs = playlists.map(p => ({
            _id: p._id,
            name: p.name
        }));

        return res.status(200).json({ success: true, idNamePairs: pairs });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ success: false, error: err.message });
    }
};


updatePlaylist = async (req, res) => {
    const userEmail = auth.verifyUser(req);
    if (!userEmail) return res.status(400).json({ errorMessage: "UNAUTHORIZED" });

    const { name, songs } = req.body;
    if (!name) return res.status(400).json({ errorMessage: "Playlist name required" });

    try {
        const playlist = await db.getPlaylistById(req.params.id);
        if (!playlist)
            return res.status(404).json({ errorMessage: "Playlist not found" });

        if (playlist.ownerEmail !== userEmail)
            return res.status(400).json({ errorMessage: "Authentication error" });

        const updated = await db.updatePlaylist(req.params.id, {
            name,
            songs: songs || []
        });

        return res.status(200).json({ success: true, playlist: updated });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ success: false, error: err.message });
    }
};


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
        const { id } = req.params;
        const { index } = req.body;

        const playlist = await db.getPlaylistById(id);
        if (!playlist)
            return res.status(404).json({ success: false, message: "Playlist not found" });

        const originalSongId = playlist.songs[index];
        if (!originalSongId)
            return res.status(400).json({ success: false, message: "Invalid index" });

        const originalSong = await Song.findById(originalSongId);

        const clonedSong = await Song.create({
            title: originalSong.title,
            artist: originalSong.artist,
            year: originalSong.year,
            youTubeId: originalSong.youTubeId
        });

        playlist.songs.splice(index + 1, 0, clonedSong._id);
        const updated = await db.updatePlaylist(id, playlist);

        return res.status(200).json({ success: true, playlist: updated });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, error: err.message });
    }
};

removeSongFromPlaylist = async (req, res) => {
    try {
        const { id } = req.params;
        const { index } = req.body;

        const playlist = await db.getPlaylistById(id);
        playlist.songs.splice(index, 1);

        const updated = await db.updatePlaylist(id, playlist);
        return res.status(200).json({ success: true, playlist: updated });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};

reorderSongsInPlaylist = async (req, res) => {
    try {
        const { id } = req.params;
        const { oldIndex, newIndex } = req.body;

        const playlist = await db.getPlaylistById(id);

        const arr = playlist.songs;
        const [moved] = arr.splice(oldIndex, 1);
        arr.splice(newIndex, 0, moved);

        const updated = await db.updatePlaylist(id, playlist);

        return res.status(200).json({ success: true, playlist: updated });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};


module.exports = {
    createPlaylist,
    copyPlaylist,
    deletePlaylist,
    getPlaylistById,
    getPlaylistPairs,
    updatePlaylist,
    getAllSongs,
    copySongInPlaylist,
    removeSongFromPlaylist,
    reorderSongsInPlaylist
};
