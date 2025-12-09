import React, { useContext } from "react";
import { GlobalStoreContext } from "../store";

import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";


export default function MUIDeleteModal() {
    const { store } = useContext(GlobalStoreContext);

    if (!store.isDeleteListModalOpen()) return null;

    const playlistName = store.listMarkedForDeletion?.name || "";

    return (
        <Modal open={store.isDeleteListModalOpen()}>
            <Box sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 450,
                bgcolor: "white",
                borderRadius: "8px",
                border: "3px solid #d9d5c5",
                boxShadow: 24,
                p: 3
            }}>
                <h2 style={{ marginTop: 0, color: "#b30000" }}>
                    Delete Playlist?
                </h2>

                <p>Are you sure you want to delete:</p>
                <p style={{ fontWeight: "bold", fontSize: "18px" }}>
                    {playlistName}
                </p>

                <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={store.deleteMarkedList}
                    >
                        Confirm
                    </Button>

                    <Button
                        variant="outlined"
                        onClick={store.cancelDelete}
                    >
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}
