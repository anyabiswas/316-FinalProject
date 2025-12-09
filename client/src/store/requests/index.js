
async function handleResponse(response) {
    const data = await response.json().catch(() => ({}));
    return { status: response.status, data };
}

const BASE_URL = "http://localhost:4000/store";

const defaultOptions = {
    credentials: "include",
    headers: { "Content-Type": "application/json" }
};


export const createPlaylist = async (name, songs = []) => {
    const response = await fetch(`${BASE_URL}/playlist`, {
        ...defaultOptions,
        method: "POST",
        body: JSON.stringify({ name, songs })
    });
    return handleResponse(response);
};


export const deletePlaylistById = async (id) => {
    const response = await fetch(`${BASE_URL}/playlist/${id}`, {
        ...defaultOptions,
        method: "DELETE"
    });
    return handleResponse(response);
};


export const getPlaylistById = async (id) => {
    const response = await fetch(`${BASE_URL}/playlist/${id}`, {
        ...defaultOptions,
        method: "GET"
    });
    return handleResponse(response);
};


export const getPlaylistPairs = async () => {
    const response = await fetch(`${BASE_URL}/playlistpairs`, {
        ...defaultOptions,
        method: "GET"
    });
    return handleResponse(response);
};


export const updatePlaylistById = async (id, { name, songs }) => {
    const response = await fetch(`${BASE_URL}/playlist/${id}`, {
        ...defaultOptions,
        method: "PUT",
        body: JSON.stringify({ name, songs })
    });
    return handleResponse(response);
};


export const copyPlaylistById = async (id) => {
    const response = await fetch(`${BASE_URL}/playlist/${id}/copy`, {
        ...defaultOptions,
        method: "POST"
    });
    return handleResponse(response);
};


const apis = {
    createPlaylist,
    deletePlaylistById,
    getPlaylistById,
    getPlaylistPairs,
    updatePlaylistById,
    copyPlaylistById
};

export default apis;
