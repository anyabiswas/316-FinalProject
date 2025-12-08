import { useContext, useState, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'
import UndoIcon from '@mui/icons-material/Undo'
import RedoIcon from '@mui/icons-material/Redo'

export default function MUIEditPlaylistModal() {
    const { store } = useContext(GlobalStoreContext)
    const [name, setName] = useState("");

    useEffect(() => {
        if (store.editPlaylistModalOpen && store.currentList) {
            setName(store.currentList.name);
        }
    }, [store.editPlaylistModalOpen, store.currentList]);



    function handleUpdate() {
        store.changeListName(store.currentList._id, name)
        store.hideModals()
    }

    function handleClose() {
        store.hideModals()
    }

    return (
        <Modal open={store.editPlaylistModalOpen}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 700,
                bgcolor: '#c3f7c2',
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                display: 'flex',
                flexDirection: 'column'
            }}>
                
                <Box sx={{
                    backgroundColor: '#00b31e',
                    padding: '10px 20px',
                    fontSize: '22px',
                    fontWeight: 'bold',
                    color: 'white',
                    borderTopLeftRadius: '12px',
                    borderTopRightRadius: '12px'
                }}>
                    Edit Playlist
                </Box>

                <Box sx={{ padding: '20px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TextField
                            fullWidth
                            value={name}
                            onChange={e => setName(e.target.value)}
                            sx={{
                                backgroundColor: '#f3f3f3',
                                borderRadius: '8px'
                            }}
                        />
                        <IconButton onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>

                        <Button sx={{
                            backgroundColor: '#8650f7',
                            color: 'white',
                            textTransform: 'none',
                            borderRadius: '10px',
                            padding: '6px 18px',
                            fontWeight: 'bold',
                            '&:hover': { backgroundColor: '#6b35d3' }
                        }}>
                            <AddIcon />
                        </Button>
                    </Box>

                    <Box sx={{
                        marginTop: '20px',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        minHeight: '260px',
                        padding: '10px',
                        border: '2px solid #b5e8b3'
                    }}>
                    </Box>

                    <Box sx={{
                        marginTop: '20px',
                        display: 'flex',
                        justifyContent: 'flex-start',
                        gap: 2
                    }}>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: '#6c48ff',
                                color: 'white',
                                textTransform: 'none',
                                borderRadius: '20px'
                            }}
                        >
                            <UndoIcon />
                            Undo
                        </Button>

                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: '#6c48ff',
                                color: 'white',
                                textTransform: 'none',
                                borderRadius: '20px'
                            }}
                        >
                            <RedoIcon />
                            Redo
                        </Button>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                        <Button
                            variant="contained"
                            onClick={handleUpdate}
                            sx={{
                                backgroundColor: '#00b96b',
                                color: 'white',
                                width: '120px',
                                fontWeight: 'bold',
                                borderRadius: '20px',
                                textTransform: 'none'
                            }}
                        >
                            Close
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    )
}
