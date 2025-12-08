import './App.css';
import { React } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { AuthContextProvider } from './auth';
import { GlobalStoreContextProvider } from './store'
import {
    AppBanner,
    HomeWrapper,
    LoginScreen,
    RegisterScreen,
    EditAccountScreen,
    WelcomeScreen,
    HomeScreen,
    SongsCatalogScreen,
    Statusbar,
    WorkspaceScreen,
    MUIEditPlaylistModal
} from './components'
/*
  This is the entry-point for our application. Notice that we
  inject our store into all the components in our application.
  
  @author McKilla Gorilla
*/
const App = () => {   
    return (
        <BrowserRouter>
            <AuthContextProvider>
                <GlobalStoreContextProvider>              
                    <AppBanner />
                    <MUIEditPlaylistModal />
                    <Switch>
                        <Route path="/" exact component={HomeWrapper} />

                        <Route path="/welcome" exact component={WelcomeScreen} />
                        <Route path="/playlists" exact component={HomeScreen} />
                        <Route path="/songs" exact component={SongsCatalogScreen} />
                        <Route path="/login/" exact component={LoginScreen} />
                        <Route path="/register/" exact component={RegisterScreen} />
                        <Route path="/editaccount" exact component={EditAccountScreen} />
                        <Route path="/playlist/:id" exact component={WorkspaceScreen} />
                    </Switch>
                    <Statusbar />
                </GlobalStoreContextProvider>
            </AuthContextProvider>
        </BrowserRouter>
    )
}

export default App