import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'

function PlaylistCard(props) {
    const { store } = useContext(GlobalStoreContext)
    const { auth } = useContext(AuthContext)
    const { idNamePair } = props

    const handleEdit = async (e) => {
        e.stopPropagation()
        await store.setCurrentList(idNamePair._id)
        store.showEditPlaylistModal()
    }

    const handleDelete = (e) => {
        e.stopPropagation()
        store.markListForDeletion(idNamePair._id)
    }

    const handleCopy = async (e) => {
        e.stopPropagation()
        store.copyPlaylist(idNamePair._id)
    }

    const handlePlay = (e) => {
        e.stopPropagation()
        store.setCurrentList(idNamePair._id)
    }

    return (
        <Box 
            sx={{
                width: '95%',
                margin: '10px auto',
                padding: '12px',
                borderRadius: '12px',
                bgcolor: '#ffffff',
                boxShadow: '0px 3px 6px rgba(0,0,0,0.12)',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <Box sx={{ display:'flex', alignItems:'center', gap:1 }}>
                <Avatar src={auth.user?.avatar} />
                <Box sx={{ display:'flex', flexDirection:'column' }}>
                    <Box sx={{ fontWeight:'bold' }}>{idNamePair.name}</Box>
                    <Box sx={{ fontSize:'12px', opacity:0.7 }}>{auth.user?.userName}</Box>
                </Box>
            </Box>

            <Box sx={{ display:'flex', gap:1, marginTop:'8px' }}>
                <Button 
                    variant="contained" 
                    sx={{ bgcolor:'#d9534f', '&:hover':{bgcolor:'#c9302c'} }} 
                    onClick={handleDelete}
                >
                    Delete
                </Button>

                <Button 
                    variant="contained" 
                    sx={{ bgcolor:'#0275d8', '&:hover':{bgcolor:'#025aa5'} }} 
                    onClick={handleEdit}
                >
                    Edit
                </Button>

                <Button 
                    variant="contained" 
                    sx={{ bgcolor:'#5cb85c', '&:hover':{bgcolor:'#449d44'} }} 
                    onClick={handleCopy}
                >
                    Copy
                </Button>

                <Button 
                    variant="contained" 
                    sx={{ bgcolor:'#d663d4', '&:hover':{bgcolor:'#a832a6'} }} 
                    onClick={handlePlay}
                >
                    Play
                </Button>
            </Box>

            <Box sx={{ marginTop:'5px', fontSize:'12px', opacity:0.6 }}>
                {idNamePair.listeners || 0} Listeners
            </Box>
        </Box>
    )
}

export default PlaylistCard
