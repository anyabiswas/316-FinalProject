const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SongSchema = new Schema({
    title: String,
    artist: String,
    year: Number,
    playlists: Number,
    listens: Number,
    youtubeId: String
});

module.exports = mongoose.model('Song', SongSchema);
