import { useContext, useEffect } from 'react';
import { GlobalStoreContext } from '../store';

import AuthContext from '../auth';
import { useHistory } from 'react-router-dom';

import PlaylistCard from './PlaylistCard';
import MUIDeleteModal from './MUIDeleteModal';

import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import List from '@mui/material/List';

export default function PlaylistsScreen() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const history = useHistory();

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);

    if (!auth.loggedIn) {
        history.push("/login");
        return null;
    }

    function handleCreateNewList() {
        store.createNewList();
    }

    return (
        <div
            style={{
                backgroundColor: "#faf7d5",
                minHeight: "100vh",
                width: "100%",
                paddingTop: "120px", 
                display: "flex",
                justifyContent: "center"
            }}
        >
            <div
                style={{
                    width: "90%",          
                    display: "flex",
                    flexDirection: "row",
                    gap: "40px"
                }}
            >
    
                
                <div style={{ width: "45%" }}>
                    <h1
                        style={{
                            fontSize: "48px",
                            color: "#d100b4",
                            marginBottom: "25px",
                            fontWeight: "800"
                        }}
                    >
                        Playlists
                    </h1>
    
                    
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "18px"
                        }}
                    >
                        {[
                            "by Playlist Name",
                            "by User Name",
                            "by Song Title",
                            "by Song Artist",
                            "by Song Year"
                        ].map((ph, i) => (
                            <div
                                key={i}
                                style={{
                                    backgroundColor: "#e7e2f1",
                                    borderRadius: "10px",
                                    border: "2px solid #cfcac5",
                                    padding: "12px 15px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    fontSize: "18px"
                                }}
                            >
                                <span>{ph}</span>
                                <span
                                    style={{
                                        fontSize: "20px",
                                        fontWeight: "bold",
                                        cursor: "pointer",
                                        color: "#7a7a7a"
                                    }}
                                >
                                    ✕
                                </span>
                            </div>
                        ))}
                    </div>
    
                    
                    <div style={{ marginTop: "35px", display: "flex", gap: "25px" }}>
                    <button style={searchBtnStyle}>
                        <img 
                            src="https://img.icons8.com/ios-filled/50/ffffff/search.png"
                            alt="search icon"
                            style={{ width: "18px", height: "18px", marginRight: "10px" }}
                        />
                        Search
                    </button>
                        <button style={clearBtnStyle}>Clear</button>
                    </div>
                </div>
    
                
                <div style={{ width: "55%" }}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: "20px",
                            marginBottom: "20px"
                        }}
                    >
                        <span>
                            Sort:{" "}
                            <span
                                style={{
                                    color: "#3366ff",
                                    fontWeight: "bold",
                                    cursor: "pointer"
                                }}
                            >
                                Listeners (Hi–Lo)
                            </span>
                        </span>
                        <span>{store.idNamePairs.length} Playlists</span>
                    </div>
    
                    
                    <div
                        style={{
                            height: "60vh",          
                            overflowY: "auto",      
                            overflowX: "hidden",    
                            paddingRight: "6px",
                            marginBottom: "20px"
                        }}
                    >
                        <List
                            sx={{
                                width: "100%",
                                bgcolor: "background.paper",
                                borderRadius: "12px",
                                padding: "5px",
                                boxSizing: "border-box"
                            }}
                        >
                            {store.idNamePairs.map((pair) => (
                                <PlaylistCard
                                    key={pair._id}
                                    idNamePair={pair}
                                    selected={false}
                                />
                            ))}
                        </List>
                    </div>


                    <div style={{ marginTop: "20px", textAlign: "left" }}>
                        <Fab
                            variant="extended"
                            sx={{
                                backgroundColor: "#8650f7",
                                color: "white",
                                fontWeight: "bold",
                                textTransform: "none",
                                paddingLeft: "20px",
                                paddingRight: "20px",
                                "&:hover": { backgroundColor: "#6d37d9" }
                            }}
                            onClick={handleCreateNewList}
                        >
                            <AddIcon sx={{ mr: 1 }} />
                            New Playlist
                        </Fab>
                    </div>
                        
                    <MUIDeleteModal />
                    </div>
                </div>
            </div>
        );
    }



const searchBtnStyle = {
    backgroundColor: "#6c48ff",
    color: "white",
    padding: "10px 28px",
    borderRadius: "25px",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    fontWeight: "600"
};

const clearBtnStyle = {
    backgroundColor: "#6c48ff",
    color: "white",
    padding: "10px 28px",
    borderRadius: "25px",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    fontWeight: "600"
};
