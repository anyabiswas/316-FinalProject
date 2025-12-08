const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Song = require('../models/song-model');


async function loadSongs() {
   await mongoose.connect("mongodb://127.0.0.1:27017/playlister");


   console.log("Connected to MongoDB.");


   const filePath = path.join(__dirname, "../test/data/songs.json");
   const data = JSON.parse(fs.readFileSync(filePath, "utf8"));


   let combined = [];


   
   for (let key of Object.keys(data)) {
       data[key].forEach(song => {
           combined.push(song);
       });
   }


   
   const unique = [];
   const seen = new Set();


   for (const song of combined) {
       const key = song.title + "::" + song.artist;


       if (!seen.has(key)) {
           seen.add(key);
           unique.push(song);
       }
   }



   await Song.deleteMany({});
   await Song.insertMany(unique);


   console.log(`Inserted ${unique.length} songs.`);
   process.exit();
}


loadSongs();
