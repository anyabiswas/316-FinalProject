import { createContext, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { jsTPS } from "jstps"
import storeRequestSender from './requests'
import CreateSong_Transaction from '../transactions/CreateSong_Transaction'
import MoveSong_Transaction from '../transactions/MoveSong_Transaction'
import RemoveSong_Transaction from '../transactions/RemoveSong_Transaction'
import UpdateSong_Transaction from '../transactions/UpdateSong_Transaction'
import AuthContext from '../auth'

const getUniversalId = (obj) => obj.id ?? obj._id

export const GlobalStoreContext = createContext({})

export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_CURRENT_PLAYLIST: "SET_CURRENT_PLAYLIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    EDIT_SONG: "EDIT_SONG",
    REMOVE_SONG: "REMOVE_SONG",
    HIDE_MODALS: "HIDE_MODALS",
    EDIT_PLAYLIST: "EDIT_PLAYLIST"
}

const tps = new jsTPS()

const CurrentModal = {
    NONE: "NONE",
    DELETE_LIST: "DELETE_LIST",
    EDIT_SONG: "EDIT_SONG",
    ERROR: "ERROR",
    EDIT_PLAYLIST: "EDIT_PLAYLIST"
}

function GlobalStoreContextProvider(props) {

    const [store, setStore] = useState({
        currentModal: CurrentModal.NONE,
        idNamePairs: [],
        currentList: null,
        currentPlaylist: null,
        currentSongIndex: -1,
        currentSong: null,
        newListCounter: 0,
        listNameActive: false,
        listIdMarkedForDeletion: null,
        listMarkedForDeletion: null,
        editPlaylistModalOpen: false
    })

    const history = useHistory()
    const { auth } = useContext(AuthContext)

    const storeReducer = (action) => {
        const { type, payload } = action
        switch (type) {

            case GlobalStoreActionType.SET_CURRENT_PLAYLIST: {
                return setStore({
                    ...store,
                    currentPlaylist: payload,
                    currentModal: CurrentModal.NONE,
                    editPlaylistModalOpen: false
                })
            }

            case GlobalStoreActionType.EDIT_PLAYLIST: {
                return setStore({
                    ...store,
                    currentPlaylist: payload,
                    currentModal: CurrentModal.EDIT_PLAYLIST,
                    editPlaylistModalOpen: true
                })
            }

            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    ...store,
                    currentList: payload.playlist,
                    idNamePairs: payload.idNamePairs,
                    currentModal: CurrentModal.NONE
                })
            }

            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    ...store,
                    currentList: null
                })
            }

            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    ...store,
                    currentList: payload,
                    newListCounter: store.newListCounter + 1
                })
            }

            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    ...store,
                    idNamePairs: payload,
                    currentList: null
                })
            }

            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    ...store,
                    currentModal: CurrentModal.DELETE_LIST,
                    listIdMarkedForDeletion: payload.id,
                    listMarkedForDeletion: payload.playlist
                })
            }

            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    ...store,
                    currentList: payload,
                    currentModal: CurrentModal.NONE
                })
            }

            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    ...store,
                    listNameActive: true
                })
            }

            case GlobalStoreActionType.EDIT_SONG: {
                return setStore({
                    ...store,
                    currentModal: CurrentModal.EDIT_SONG,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong
                })
            }

            case GlobalStoreActionType.REMOVE_SONG: {
                return setStore({
                    ...store,
                    currentList: store.currentList
                })
            }

            case GlobalStoreActionType.HIDE_MODALS: {
                return setStore({
                    ...store,
                    currentModal: CurrentModal.NONE,
                    editPlaylistModalOpen: false,
                    currentSongIndex: -1,
                    currentSong: null
                })
            }

            default:
                return store
        }
    }

    store.loadPlaylist = async function (id) {
        const response = await storeRequestSender.getPlaylistById(id)
        if (response.data.success) {
            let playlist = response.data.playlist
            storeReducer({
                type: GlobalStoreActionType.SET_CURRENT_PLAYLIST,
                payload: playlist
            })
        }
    }

    store.showEditPlaylistModal = function () {
        if (!store.currentPlaylist) return
        storeReducer({
            type: GlobalStoreActionType.EDIT_PLAYLIST,
            payload: store.currentPlaylist
        })
    }

    store.openEditPlaylistModal = function (playlist) {
        storeReducer({
            type: GlobalStoreActionType.EDIT_PLAYLIST,
            payload: playlist
        })
    }

    store.isEditPlaylistModalOpen = function () {
        return store.currentModal === CurrentModal.EDIT_PLAYLIST
    }

    store.setEditingPlaylist = async function (id) {
        await store.loadPlaylist(id);
        store.showEditPlaylistModal();
    };


    store.tryAcessingOtherAccountPlaylist = function () {
        let id = "635f203d2e072037af2e6284"
        async function asyncSet(id) {
            let response = await storeRequestSender.getPlaylistById(id)
            if (response.data.success) {
                let playlist = response.data.playlist
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: playlist
                })
            }
        }
        asyncSet(id)
        history.push("/playlist/635f203d2e072037af2e6284")
    }

    store.renameCurrentPlaylist = function (newName) {
        if (store.currentPlaylist) {
            store.currentPlaylist.name = newName;   
            setStore({ ...store });                 
        }
    };
    
    store.removeSongFromPlaylist = function (index) {
        store.currentPlaylist.songs.splice(index, 1)
    }

    store.reorderSongsInPlaylist = function (start, end) {
        let list = store.currentPlaylist.songs
        let song = list[start]
        list.splice(start, 1)
        list.splice(end, 0, song)
    }

    store.copySongInPlaylist = function (song) {
        return JSON.parse(JSON.stringify(song))
    }

    store.commitPlaylistChanges = async function () {
        if (!store.currentPlaylist) return;
    
        const playlistId = getUniversalId(store.currentPlaylist);
    
        const response = await storeRequestSender.updatePlaylistById(
            playlistId,
            {
                name: store.currentPlaylist.name,
                songs: store.currentPlaylist.songs
            }
        );
    
        if (response.data.success) {
            
            store.loadIdNamePairs();
    
           
            await store.loadPlaylist(playlistId);
        }
    
        store.hideModals();
    };
    

    store.changeListName = function (id, newName) {
        async function asyncChange(id) {
            let response = await storeRequestSender.getPlaylistById(id)
            if (response.data.success) {
                let list = response.data.playlist
                list.name = newName
                const playlistId = getUniversalId(list)
                await storeRequestSender.updatePlaylistById(playlistId, {
                    name: list.name,
                    songs: list.songs
                })
                let pairs = await storeRequestSender.getPlaylistPairs()
                if (pairs.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.CHANGE_LIST_NAME,
                        payload: { idNamePairs: pairs.data.idNamePairs, playlist: list }
                    })
                }
            }
        }
        asyncChange(id)
    }

    store.closeCurrentList = function () {
        storeReducer({ type: GlobalStoreActionType.CLOSE_CURRENT_LIST })
        tps.clearAllTransactions()
        history.push("/")
    }

    store.createNewList = async function () {
        if (!auth.user || auth.user.isGuest) return
        const pairsResponse = await storeRequestSender.getPlaylistPairs()
        if (!pairsResponse.data.success) return
        const owned = pairsResponse.data.idNamePairs.filter(
            p => p.ownerEmail === auth.user.email
        )
        const names = new Set(owned.map(p => p.name))
        let counter = store.newListCounter
        let name = "Untitled" + counter
        while (names.has(name)) {
            counter++
            name = "Untitled" + counter
        }
        const response = await storeRequestSender.createPlaylist(
            name,
            [],
            auth.user.email
        )
        if (response.status === 201) {
            let newList = response.data.playlist
            storeReducer({
                type: GlobalStoreActionType.CREATE_NEW_LIST,
                payload: newList
            })
            store.newListCounter = counter + 1
            store.openEditPlaylistModal(newList)
        }
    }

    store.loadIdNamePairs = function () {
        async function load() {
            let response = await storeRequestSender.getPlaylistPairs()
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: response.data.idNamePairs
                })
            }
        }
        load()
    }

    store.markListForDeletion = function (id) {
        async function load(id) {
            let response = await storeRequestSender.getPlaylistById(id)
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                    payload: { id, playlist: response.data.playlist }
                })
            }
        }
        load(id)
    }

    store.deleteList = function (id) {
        async function del(id) {
            let response = await storeRequestSender.deletePlaylistById(id)
            store.loadIdNamePairs()
            if (response.data.success) history.push("/")
        }
        del(id)
    }

    store.deleteMarkedList = function () {
        store.deleteList(store.listIdMarkedForDeletion)
        store.hideModals()
    }

    store.showEditSongModal = (index, song) => {
        storeReducer({
            type: GlobalStoreActionType.EDIT_SONG,
            payload: { currentSongIndex: index, currentSong: song }
        })
    }

    store.hideModals = () => {
        storeReducer({ type: GlobalStoreActionType.HIDE_MODALS })
    }

    store.isDeleteListModalOpen = () => store.currentModal === CurrentModal.DELETE_LIST
    store.isEditSongModalOpen = () => store.currentModal === CurrentModal.EDIT_SONG
    store.isErrorModalOpen = () => store.currentModal === CurrentModal.ERROR

    store.setCurrentList = function (id) {
        async function load(id) {
            let response = await storeRequestSender.getPlaylistById(id)
            if (response.data.success) {
                let playlist = response.data.playlist
                const playlistId = getUniversalId(playlist)
                await storeRequestSender.updatePlaylistById(playlistId, {
                    name: playlist.name,
                    songs: playlist.songs
                })
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: playlist
                })
            }
        }
        load(id)
    }

    store.getPlaylistSize = () =>
        store.currentList ? store.currentList.songs.length : 0


    store.createSong = function (index, song) {
        store.currentList.songs.splice(index, 0, song)
        store.updateCurrentList()
    }

    store.moveSong = function (start, end) {
        let list = store.currentList
        if (start < end) {
            let temp = list.songs[start]
            for (let i = start; i < end; i++) list.songs[i] = list.songs[i + 1]
            list.songs[end] = temp
        } else {
            let temp = list.songs[start]
            for (let i = start; i > end; i--) list.songs[i] = list.songs[i - 1]
            list.songs[end] = temp
        }
        store.updateCurrentList()
    }

    store.removeSong = function (index) {
        store.currentList.songs.splice(index, 1)
        store.updateCurrentList()
    }

    store.updateSong = function (index, newSong) {
        let song = store.currentList.songs[index]
        song.title = newSong.title
        song.artist = newSong.artist
        song.year = newSong.year
        song.youTubeId = newSong.youTubeId
        store.updateCurrentList()
    }

    store.addCreateSongTransaction = (index, title, artist, year, id) => {
        let song = { title, artist, year, youTubeId: id }
        let transaction = new CreateSong_Transaction(store, index, song)
        tps.processTransaction(transaction)
    }

    store.addMoveSongTransaction = function (start, end) {
        let transaction = new MoveSong_Transaction(store, start, end)
        tps.processTransaction(transaction)
    }

    store.addRemoveSongTransaction = (song, index) => {
        let transaction = new RemoveSong_Transaction(store, index, song)
        tps.processTransaction(transaction)
    }

    store.addUpdateSongTransaction = function (index, newSong) {
        let old = store.currentList.songs[index]
        let oldSong = {
            title: old.title,
            artist: old.artist,
            year: old.year,
            youTubeId: old.youTubeId
        }
        let transaction = new UpdateSong_Transaction(
            store,
            index,
            oldSong,
            newSong
        )
        tps.processTransaction(transaction)
    }

    store.updateCurrentList = function () {
        async function update() {
            const playlistId = getUniversalId(store.currentList)
            const response = await storeRequestSender.updatePlaylistById(
                playlistId,
                {
                    name: store.currentList.name,
                    songs: store.currentList.songs
                }
            )
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                })
            }
        }
        update()
    }

    store.undo = () => tps.undoTransaction()
    store.redo = () => tps.doTransaction()

    store.canAddNewSong = () => store.currentList !== null
    store.canUndo = () => store.currentList !== null && tps.hasTransactionToUndo()
    store.canRedo = () => store.currentList !== null && tps.hasTransactionToDo()
    store.canClose = () => store.currentList !== null

    store.setIsListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE
        })
    }

    function KeyPress(e) {
        if (!store.modalOpen && e.ctrlKey) {
            if (e.key === 'z') store.undo()
            if (e.key === 'y') store.redo()
        }
    }

    document.onkeydown = KeyPress

    return (
        <GlobalStoreContext.Provider value={{ store }}>
            {props.children}
        </GlobalStoreContext.Provider>
    )
}

export default GlobalStoreContext
export { GlobalStoreContextProvider }
