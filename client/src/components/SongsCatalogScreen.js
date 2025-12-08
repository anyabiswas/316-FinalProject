import { useState, useEffect } from "react";
import axios from "axios";

export default function SongCatalogScreen() {
    const [songs, setSongs] = useState([]);

    useEffect(() => {
        async function loadSongs() {
            const res = await axios.get("/songs/all");
            setSongs(res.data);    
        }
        loadSongs();
    }, []);

    return (
        <div>
            <h1>Songs Catalog</h1>

            {songs.map((song, index) => (
                <div key={index} className="song-card">
                    {song.title} by {song.artist} ({song.year})
                </div>
            ))}
        </div>
    );
}
