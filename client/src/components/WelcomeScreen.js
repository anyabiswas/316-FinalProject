import React from 'react';
import { useHistory } from 'react-router-dom';

export default function WelcomeScreen() {
    const history = useHistory();

    return (
        <div id="welcome-screen">
            <div className="welcome-content">

                <div id="welcome-title">The Playlister</div>

                <img
                    id="welcome-logo"
                    src="/playlisticon.png"
                    alt="Playlister Logo"
                />

                <div id="welcome-buttons">
                    <button className="welcome-btn" onClick={() => history.push('/playlists')}>
                        Continue as Guest
                    </button>
                    <button className="welcome-btn" onClick={() => history.push('/login')}>
                        Login
                    </button>
                    <button className="welcome-btn" onClick={() => history.push('/register')}>
                        Create Account TEST
                    </button>
                </div>

            </div>
        </div>
    );
}
