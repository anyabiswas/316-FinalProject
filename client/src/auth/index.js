import React, { createContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'
import authRequestSender from './requests'

const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    LOGIN_USER: "LOGIN_USER",
    LOGOUT_USER: "LOGOUT_USER",
    REGISTER_USER: "REGISTER_USER"
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false,
        errorMessage: null
    });
    const history = useHistory();

    useEffect(() => {
        auth.getLoggedIn();
    }, []);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    errorMessage: null
                });
            }
            case AuthActionType.LOGIN_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    errorMessage: payload.errorMessage
                })
            }
            case AuthActionType.LOGOUT_USER: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    errorMessage: null
                })
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    errorMessage: payload.errorMessage
                })
            }
            default:
                return auth;
        }
    }

    auth.getLoggedIn = async function () {
        try {
            const response = await authRequestSender.getLoggedIn();
            if (response?.data?.loggedIn !== undefined) {  
                authReducer({
                    type: AuthActionType.GET_LOGGED_IN,
                    payload: {
                        loggedIn: response.data.loggedIn,   
                        user: response.data.user            
                    }
                });
            }
        } catch (error) {
            console.error("Error checking login status:", error);
        }
    };
    
    auth.registerUser = async function (userName, email, password, passwordVerify, avatar) {
        console.log("REGISTERING USER");
        try {
            const response = await authRequestSender.registerUser(userName, email, password, passwordVerify, avatar);
    
            if (response?.data?.success === false) {
                authReducer({
                    type: AuthActionType.REGISTER_USER,
                    payload: {
                        ...auth,
                        loggedIn: false,
                        errorMessage: response.data.errorMessage
                    }
                });
                return;
            }


            if (response?.data?.user) {   
                console.log("Registered Successfully");
                authReducer({
                    type: AuthActionType.REGISTER_USER,
                    payload: {
                        user: response.data.user,  
                        loggedIn: true,
                        errorMessage: null
                    }
                });
                history.push("/login");
                
            }
        } catch (error) {
            const message = error?.errorMessage || error?.message || "Registration failed.";
            authReducer({
                type: AuthActionType.REGISTER_USER,
                payload: {
                    user: auth.user,
                    loggedIn: false,
                    errorMessage: message
                }
            });
        }
    };
    
    auth.loginUser = async function (email, password) {
    console.log("LOGIN FRONTEND sending email:", email);
    console.log("LOGIN FRONTEND sending password:", password);
        try {
            const response = await authRequestSender.loginUser(email, password);
    
            if (response?.data?.user) {   
                authReducer({
                    type: AuthActionType.LOGIN_USER,
                    payload: {
                        user: response.data.user,   
                        loggedIn: true,
                        errorMessage: null
                    }
                });
                history.push("/");
            }
        } catch (error) {
            const message = error?.errorMessage || error?.message || "Login failed.";
            authReducer({
                type: AuthActionType.LOGIN_USER,
                payload: {
                    user: auth.user,
                    loggedIn: false,
                    errorMessage: message
                }
            });
        }
    };

    auth.updateAccount = async function (userName, password, passwordVerify, avatar) {
        console.log("UPDATING ACCOUNT");

        try {
            const response = await authRequestSender.updateAccount(
                userName,
                password,
                passwordVerify,
                avatar
            );

            if (response?.data?.user) {
                
                authReducer({
                    type: AuthActionType.LOGIN_USER,
                    payload: {
                        user: response.data.user,
                        loggedIn: true,
                        errorMessage: null
                    }
                });

                console.log("Account updated successfully!");
            }

            return response;

        } catch (error) {
            console.error("Update account failed:", error);

            const message =
                error?.response?.data?.errorMessage ||
                error?.message ||
                "Account update failed.";

            authReducer({
                type: AuthActionType.LOGIN_USER,
                payload: {
                    user: auth.user,
                    loggedIn: true,
                    errorMessage: message
                }
            });
        }
    };
    

     auth.logoutUser = async function() {
        const response = await authRequestSender.logoutUser();
        if (response.status === 200) {
            authReducer( {
                type: AuthActionType.LOGOUT_USER,
                payload: null
            })
            history.push("/");
        }
    }


    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };