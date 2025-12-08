import { useContext, useState, useEffect } from "react";
import { GlobalStoreContext } from "../store";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";

import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";

export default function MUIEditPlaylistModal() {
    const { store } = useContext(GlobalStoreContext);
    const list = store.currentPlaylist;

    const [name, setName] = useState("");

    useEffect(() => {
        if (store.isEditPlaylistModalOpen() && list) {
            setName(list.name);
        }
    }, [store.currentPlaylist, store.editPlaylistModalOpen]);

    if (!store.isEditPlaylistModalOpen() || !list) return null;

    const handleClose = () => store.hideModals();
    const handleClearName = () => setName("");

    const handleNameSubmit = () => {
        store.renameCurrentPlaylist(name);
    };

    if (!store.isEditPlaylistModalOpen() || !list) return null;

    return (
        <Modal open={store.isEditPlaylistModalOpen()}>

            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "900px",
                    bgcolor: "#f6f2d6",
                    borderRadius: "8px",
                    border: "4px solid #d9d5c5",
                    overflow: "hidden"
                }}
            >
                <Box
                    sx={{
                        bgcolor: "#32cd32",
                        padding: "12px 20px",
                        fontSize: "22px",
                        fontWeight: "bold",
                        color: "white"
                    }}
                >
                    Edit Playlist
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        padding: "15px 20px",
                        bgcolor: "#dcdcdc",
                        borderBottom: "2px solid #d9d5c5",
                        gap: 2
                    }}
                >
                    <TextField
                        fullWidth
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            store.renameCurrentPlaylist(e.target.value);
                        }}
                        variant="outlined"
                        sx={{
                            bgcolor: "white",
                            borderRadius: "6px"
                        }}
                    />


                    <IconButton onClick={handleClearName}>
                        <ClearIcon />
                    </IconButton>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        sx={{
                            textTransform: "none",
                            bgcolor: "#6a55d8",
                            "&:hover": { bgcolor: "#5948c0" }
                        }}
                        onClick={() => {
                            store.hideModals();
                            window.location.href = "/songs";
                        }}
                    >
                        Song
                    </Button>
                </Box>

                <Box
                    sx={{
                        padding: "20px",
                        height: "360px",
                        overflowY: "auto",
                        borderBottom: "2px solid #d9d5c5",
                        bgcolor: "#ffffff"
                    }}
                >
                    {list.songs.map((song, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "12px",
                                marginBottom: "12px",
                                borderRadius: "8px",
                                backgroundColor: "#fbf2a0",
                                border: "2px solid #d9c77e"
                            }}
                        >
                            <span style={{ fontSize: "17px", fontWeight: 500 }}>
                                {index + 1}. {song.title} by {song.artist} ({song.year})
                            </span>

                            <Box sx={{ display: "flex", gap: 1 }}>
                                <IconButton onClick={() => store.showEditSongModal(index, song)}>
                                    <EditIcon />
                                </IconButton>

                                <IconButton onClick={() => {
                                    const copy = store.copySongInPlaylist(song);
                                    store.currentPlaylist.songs.splice(index + 1, 0, copy);
                                }}>
                                    <ContentCopyIcon />
                                </IconButton>

                                <IconButton onClick={() => {
                                    store.removeSongFromPlaylist(index);
                                }}>
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        </Box>
                    ))}
                </Box>

                <Box
                    sx={{
                        bgcolor: "#c9f7c1",
                        padding: "15px 25px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}
                >
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <Button
                            variant="contained"
                            sx={{
                                bgcolor: "#6a55d8",
                                "&:hover": { bgcolor: "#5948c0" }
                            }}
                            onClick={store.undo}
                        >
                            Undo
                        </Button>

                        <Button
                            variant="contained"
                            sx={{
                                bgcolor: "#6a55d8",
                                "&:hover": { bgcolor: "#5948c0" }
                            }}
                            onClick={store.redo}
                        >
                            Redo
                        </Button>
                    </Box>

                    <Button
                        variant="contained"
                        sx={{
                            bgcolor: "#1e7a32",
                            "&:hover": { bgcolor: "#176028" }
                        }}
                        onClick={store.commitPlaylistChanges}   
                    >
                        Close
                    </Button>

                </Box>
            </Box>
        </Modal>
    );
}
