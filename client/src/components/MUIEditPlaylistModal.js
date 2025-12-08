import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

export default function MUIEditPlaylistModal() {
    const { store } = useContext(GlobalStoreContext)
    const [name, setName] = useState(store.currentList ? store.currentList.name : "")

    if (!store.editPlaylistModalOpen || !store.currentList) return null

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
                bgcolor: 'white',
                p: 3,
                borderRadius: 2,
                width: 400,
                display: 'flex',
                flexDirection: 'column',
                gap: 2
            }}>
                <TextField value={name} onChange={(e) => setName(e.target.value)} fullWidth />
                <Button variant="contained" onClick={handleUpdate}>Save</Button>
                <Button onClick={handleClose}>Cancel</Button>
            </Box>
        </Modal>
    )
}
