const express = require("express");
const router = express.Router();
const StoreController = require("../controllers/store-controller");


router.post("/playlist", StoreController.createPlaylist);
router.get("/playlist/:id", StoreController.getPlaylistById);
router.put("/playlist/:id", StoreController.updatePlaylist);
router.delete("/playlist/:id", StoreController.deletePlaylist);

router.post("/playlist/:id/copy", StoreController.copyPlaylist);
router.get("/playlistpairs", StoreController.getPlaylistPairs);

router.get("/songs", StoreController.getAllSongs);
router.post("/playlist/:id/song/copy", StoreController.copySongInPlaylist);
router.post("/playlist/:id/song/remove", StoreController.removeSongFromPlaylist);
router.post("/playlist/:id/song/reorder", StoreController.reorderSongsInPlaylist);

module.exports = router;
