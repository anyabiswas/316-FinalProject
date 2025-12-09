import { createContext, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { jsTPS } from "jstps";
import storeRequestSender from "./requests";
import AuthContext from "../auth";

import CreateSong_Transaction from "../transactions/CreateSong_Transaction";
import MoveSong_Transaction from "../transactions/MoveSong_Transaction";
import RemoveSong_Transaction from "../transactions/RemoveSong_Transaction";
import UpdateSong_Transaction from "../transactions/UpdateSong_Transaction";

const tps = new jsTPS();

export const GlobalStoreContext = createContext({});

export const GlobalStoreActionType = {
    SET_PLAYLIST: "SET_PLAYLIST",
    LOAD_PLAYLIST_PAIRS: "LOAD_PLAYLIST_PAIRS",
    OPEN_EDIT_PLAYLIST_MODAL: "OPEN_EDIT_PLAYLIST_MODAL",
    HIDE_MODALS: "HIDE_MODALS",
};

export const CurrentModal = {
    NONE: "NONE",
    EDIT_PLAYLIST: "EDIT_PLAYLIST",
    DELETE_LIST: "DELETE_LIST",
};

function GlobalStoreContextProvider(props) {
    const [store, setStore] = useState({
        currentModal: CurrentModal.NONE,
        idNamePairs: [],
        currentPlaylist: null,
    });

    const history = useHistory();
    const { auth } = useContext(AuthContext);

    const storeReducer = (action) => {
        const { type, payload } = action;

        switch (type) {
            case GlobalStoreActionType.SET_PLAYLIST: {
                return setStore({
                    ...store,
                    currentPlaylist: payload,
                    currentModal: CurrentModal.NONE,
                });
            }

            case GlobalStoreActionType.LOAD_PLAYLIST_PAIRS: {
                return setStore({
                    ...store,
                    idNamePairs: payload,
                });
            }

            case GlobalStoreActionType.OPEN_EDIT_PLAYLIST_MODAL: {
                return setStore({
                    ...store,
                    currentModal: CurrentModal.EDIT_PLAYLIST,
                    currentPlaylist: payload,
                });
            }

            case "MARK_LIST_FOR_DELETION": {
                return setStore({
                    ...store,
                    currentModal: CurrentModal.DELETE_LIST,
                    listIdMarkedForDeletion: payload.id,
                    listMarkedForDeletion: payload.playlist,
                });
            }
            

            case GlobalStoreActionType.HIDE_MODALS: {
                tps.clearAllTransactions();
                return setStore({
                    ...store,
                    currentModal: CurrentModal.NONE,
                    currentPlaylist: null,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                });
            }
            

            default:
                return store;
        }
    };

    
    store.setEditingPlaylist = async function (id) {
        const response = await storeRequestSender.getPlaylistById(id);
    
        if (response.data.success) {
            tps.clearAllTransactions();
            storeReducer({
                type: GlobalStoreActionType.OPEN_EDIT_PLAYLIST_MODAL,
                payload: response.data.playlist,
            });
        }
    };
    

    store.isEditPlaylistModalOpen = function () {
        return store.currentModal === CurrentModal.EDIT_PLAYLIST;
    };

    store.hideModals = function () {
        storeReducer({ type: GlobalStoreActionType.HIDE_MODALS });
    };

store.isEditSongModalOpen = () => store.currentModal === CurrentModal.EDIT_SONG
store.isErrorModalOpen = () => store.currentModal === CurrentModal.ERROR
store.isEditSongModalOpen = () => store.currentModal === CurrentModal.EDIT_SONG
store.isErrorModalOpen = () => store.currentModal === CurrentModal.ERROR

   
    store.loadIdNamePairs = async function () {
        const response = await storeRequestSender.getPlaylistPairs();

        if (response.data.success) {
            storeReducer({
                type: GlobalStoreActionType.LOAD_PLAYLIST_PAIRS,
                payload: response.data.idNamePairs,
            });
        }
    };


    store.renameCurrentPlaylist = function (newName) {
        if (store.currentPlaylist) {
            store.currentPlaylist.name = newName;
        }
    };


    store.copySongInPlaylist = function (song) {
        return JSON.parse(JSON.stringify(song));
    };

    store.removeSongFromPlaylist = function (index) {
        store.currentPlaylist.songs.splice(index, 1);
    };

    store.reorderSongsInPlaylist = function (start, end) {
        let list = store.currentPlaylist.songs;
        const moved = list[start];
        list.splice(start, 1);
        list.splice(end, 0, moved);
    };

    store.commitPlaylistChanges = async function () {
        if (!store.currentPlaylist) return;

        const playlistId = store.currentPlaylist._id;

        await storeRequestSender.updatePlaylistById(playlistId, {
            name: store.currentPlaylist.name,
            songs: store.currentPlaylist.songs,
        });

        store.loadIdNamePairs();
    };


    store.copyPlaylist = async function (id) {
        const response = await storeRequestSender.copyPlaylistById(id);

        if (response.data.success) {
            store.loadIdNamePairs();
        }
    };


store.markListForDeletion = async function (id) {
    const response = await storeRequestSender.getPlaylistById(id);

    if (response.data.success) {
        storeReducer({
            type: "MARK_LIST_FOR_DELETION",
            payload: {
                id,
                playlist: response.data.playlist
            }
        });
    }
};


store.deleteList = async function (id) {
    await storeRequestSender.deletePlaylistById(id);
    await store.loadIdNamePairs();
};


store.deleteMarkedList = async function () {
    const idToDelete = store.listIdMarkedForDeletion;
    if (!idToDelete) return;

    await store.deleteList(idToDelete);

    storeReducer({ type: GlobalStoreActionType.HIDE_MODALS });

    await store.loadIdNamePairs();
};



store.cancelDelete = function () {
    store.hideModals();
};


store.isDeleteListModalOpen = function () {
    return store.currentModal === CurrentModal.DELETE_LIST;
};

store.setCurrentList = async function (id) {
    const response = await storeRequestSender.getPlaylistById(id);
    if (response.data.success) {
        storeReducer({
            type: GlobalStoreActionType.SET_PLAYLIST,
            payload: response.data.playlist
        });
    }
};


    store.undo = function () {
        if (store.currentModal === CurrentModal.NONE) tps.undoTransaction();
    };

    store.redo = function () {
        if (store.currentModal === CurrentModal.NONE) tps.doTransaction();
    };

    document.onkeydown = function (e) {
        if (store.currentModal !== CurrentModal.NONE) return;

        if (e.ctrlKey && e.key === "z") store.undo();
        if (e.ctrlKey && e.key === "y") store.redo();
    };


    return (
        <GlobalStoreContext.Provider value={{ store }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };
