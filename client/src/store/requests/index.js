/*
    This is our http api, which we use to send requests to
    our back-end API. Note we`re using the Axios library
    for doing this, which is an easy to use AJAX-based
    library. We could (and maybe should) use Fetch, which
    is a native (to browsers) standard, but Axios is easier
    to use when sending JSON back and forth and it`s a Promise-
    based API which helps a lot with asynchronous communication.
    
    @author McKilla Gorilla
*/

// Helper to handle JSON safely
async function handleResponse(response) {
    const data = await response.json().catch(() => ({}));
    return { status: response.status, data };
}

const BASE_URL = 'http://localhost:4000/store';

const defaultOptions = {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' }
};

// THESE ARE ALL THE REQUESTS WE`LL BE MAKING, ALL REQUESTS HAVE A
// REQUEST METHOD (like get) AND PATH (like /top5list). SOME ALSO
// REQUIRE AN id SO THAT THE SERVER KNOWS ON WHICH LIST TO DO ITS
// WORK, AND SOME REQUIRE DATA, WHICH WE WE WILL FORMAT HERE, FOR WHEN
// WE NEED TO PUT THINGS INTO THE DATABASE OR IF WE HAVE SOME
// CUSTOM FILTERS FOR QUERIES

// Create a new playlist
export const createPlaylist = async (newListName, newSongs, userEmail) => {
    const response = await fetch(`${BASE_URL}/playlist`, {
        ...defaultOptions,
        method: 'POST',
        body: JSON.stringify({
            name: newListName,
            songs: newSongs,
            ownerEmail: userEmail
        })
    });
    return handleResponse(response);
};

// Delete playlist by ID
export const deletePlaylistById = async (id) => {
    const response = await fetch(`${BASE_URL}/playlist/${id}`, {
        ...defaultOptions,
        method: 'DELETE'
    });
    return handleResponse(response);
};

// Get playlist by ID
export const getPlaylistById = async (id) => {
    const response = await fetch(`${BASE_URL}/playlist/${id}`, {
        ...defaultOptions,
        method: 'GET'
    });
    return handleResponse(response);
};

// Get all playlist ID/name pairs
export const getPlaylistPairs = async () => {
    const response = await fetch(`${BASE_URL}/playlistpairs/`, {
        ...defaultOptions,
        method: 'GET'
    });
    return handleResponse(response);
};

// Update playlist by ID
export const updatePlaylistById = async (id, { name, songs }) => {
    const response = await fetch(`${BASE_URL}/playlist/${id}`, {
        ...defaultOptions,
        method: 'PUT',
        body: JSON.stringify({
            name,
            songs
        })
    });
    return handleResponse(response);
};

// Export grouped API
const apis = {
    createPlaylist,
    deletePlaylistById,
    getPlaylistById,
    getPlaylistPairs,
    updatePlaylistById
};

export default apis;
