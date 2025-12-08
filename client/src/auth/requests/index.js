/*
    This is our http api for all things auth, which we use to 
    send authorization requests to our back-end API. Note we`re 
    using the Axios library for doing this, which is an easy to 
    use AJAX-based library. We could (and maybe should) use Fetch, 
    which is a native (to browsers) standard, but Axios is easier
    to use when sending JSON back and forth and it`s a Promise-
    based API which helps a lot with asynchronous communication.
    
    @author McKilla Gorilla
*/

// Helper function for handling fetch responses
async function handleResponse(response) {
    const data = await response.json().catch(() => ({}));
    return { status: response.status, data };
}

const BASE_URL = 'http://localhost:4000/auth';

// All requests will include cookies
const defaultOptions = {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' }
};

// THESE ARE ALL THE REQUESTS WE`LL BE MAKING, ALL REQUESTS HAVE A
// REQUEST METHOD (like get) AND PATH (like /register). SOME ALSO
// REQUIRE AN id SO THAT THE SERVER KNOWS ON WHICH LIST TO DO ITS
// WORK, AND SOME REQUIRE DATA, WHICH WE WE WILL FORMAT HERE, FOR WHEN
// WE NEED TO PUT THINGS INTO THE DATABASE OR IF WE HAVE SOME
// CUSTOM FILTERS FOR QUERIES
// Get current logged-in user info

export const getLoggedIn = async () => {
    const response = await fetch(`${BASE_URL}/loggedIn/`, {
        ...defaultOptions,
        method: 'GET'
    });
    return handleResponse(response);
};

// Login user
export const loginUser = async (email, password) => {
    const response = await fetch(`${BASE_URL}/login/`, {
        ...defaultOptions,
        method: 'POST',
        body: JSON.stringify({ email, password })
    });
    return handleResponse(response);
};

// Logout user
export const logoutUser = async () => {
    const response = await fetch(`${BASE_URL}/logout/`, {
        ...defaultOptions,
        method: 'GET'
    });
    return handleResponse(response);
};

// Register new user
export const registerUser = async (userName, email, password, passwordVerify, avatar) => {
    const response = await fetch(`${BASE_URL}/register/`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userName,
            email,
            password,
            passwordVerify,
            avatar
        })
    });
    return handleResponse(response);
};

// Update account
export const updateAccount = async (userName, password, passwordVerify, avatar) => {
    const response = await fetch(`${BASE_URL}/update/`, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userName,
            password,
            passwordVerify,
            avatar
        })
    });
    return handleResponse(response);
};




// Export grouped API
const apis = {
    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser,
    updateAccount
};

export default apis;