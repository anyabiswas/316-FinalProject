import { useHistory } from "react-router-dom";
import { useContext, useState, useRef } from 'react';
import AuthContext from '../auth';
import MUIErrorModal from './MUIErrorModal';
import Copyright from './Copyright';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CancelIcon from '@mui/icons-material/Cancel';

export default function EditAccountScreen() {
    const { auth } = useContext(AuthContext);
    const history = useHistory(); 

    const [userName, setUserName] = useState(auth.user?.userName || "");
    const [email] = useState(auth.user?.email || "");
    const [password, setPassword] = useState("");
    const [passwordVerify, setPasswordVerify] = useState("");

    const [avatar, setAvatar] = useState(auth.user?.avatar || "https://i.imgur.com/0y8Ftya.png");
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarError, setAvatarError] = useState("");
    const avatarInputRef = useRef(null);

    const handleAvatarSelect = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setAvatarError("");

        if (file.type !== "image/png") {
            setAvatarError("Avatar must be a PNG file.");
            return;
        }

        const img = new Image();
        img.onload = () => {
            if (img.width === 250 && img.height === 250) {
                setAvatar(URL.createObjectURL(file));

                const reader = new FileReader();
                reader.onloadend = () => setAvatarFile(reader.result);
                reader.readAsDataURL(file);
            } else {
                setAvatarError("Image must be exactly 250×250 pixels.");
            }
        };
        img.src = URL.createObjectURL(file);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (avatarError) return;
    
        
        const response = await auth.updateAccount(
            userName,
            password,
            passwordVerify,
            avatarFile || avatar
        );
    
        
        if (response && response.status === 200) {
            history.goBack();
        }
    };
    

    return (
        <Box
            sx={{
                flex: 1,
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
            }}
        >
            <CssBaseline />

            
            <Box
                sx={{
                    width: "100%",
                    maxWidth: 800,
                    px: 4,
                    py: 6,
                    bgcolor: "var(--swatch-primary)",
                    borderRadius: "8px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                
                <LockOutlinedIcon sx={{ fontSize: 50, mb: 1, color: "#444" }} />

                
                <Typography
                    component="h1"
                    variant="h5"
                    sx={{ mb: 4, color: "#444", fontWeight: 600 }}
                >
                    Edit Account
                </Typography>

                
                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        position: "relative",   
                        mt: 2,
                        mb: 2,
                    }}
                >
                    
                    <Box
                        sx={{
                            position: "absolute",
                            left: "60px",
                            top: "0px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <img
                            src={avatar}
                            alt="avatar"
                            style={{
                                width: "60px",
                                height: "60px",
                                borderRadius: "50%",
                                marginBottom: "8px",
                            }}
                        />

                        <input
                            type="file"
                            accept="image/png"
                            ref={avatarInputRef}
                            onChange={handleAvatarSelect}
                            style={{ display: "none" }}
                        />

                        <Button
                            variant="text"
                            size="small"
                            sx={{
                                textTransform: "none",
                                color: "white",
                                backgroundColor: "black",
                                borderRadius: "6px",
                                px: "10px",
                                py: "2px",
                                fontSize: "10pt",
                                ":hover": { bgcolor: "#333" },
                            }}
                            onClick={() => avatarInputRef.current.click()}
                        >
                            Select
                        </Button>
                    </Box>

                    
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{
                            width: "100%",
                            maxWidth: 400,
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        }}
                    >
                        
                        <TextField
                            required
                            fullWidth
                            label="User Name"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <CancelIcon
                                        sx={{ color: "#777", cursor: "pointer" }}
                                        onClick={() => setUserName("")}
                                    />
                                ),
                            }}
                            sx={{
                                bgcolor: "#e7e3ef",
                                borderRadius: "6px",
                            }}
                        />

                        
                        <TextField
                            required
                            fullWidth
                            label="Email"
                            disabled
                            value={email}
                            sx={{
                                bgcolor: "#e7e3ef",
                                borderRadius: "6px",
                            }}
                        />

                        
                        <TextField
                            fullWidth
                            required
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <CancelIcon
                                        sx={{ color: "#777", cursor: "pointer" }}
                                        onClick={() => setPassword("")}
                                    />
                                ),
                            }}
                            sx={{
                                bgcolor: "#e7e3ef",
                                borderRadius: "6px",
                            }}
                        />

                        
                        <TextField
                            fullWidth
                            required
                            label="Password Confirm"
                            type="password"
                            value={passwordVerify}
                            onChange={(e) => setPasswordVerify(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <CancelIcon
                                        sx={{ color: "#777", cursor: "pointer" }}
                                        onClick={() => setPasswordVerify("")}
                                    />
                                ),
                            }}
                            sx={{
                                bgcolor: "#e7e3ef",
                                borderRadius: "6px",
                            }}
                        />

                        
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                gap: 2,
                                mt: 1,
                            }}
                        >
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                    bgcolor: "black",
                                    ":hover": { bgcolor: "#333" },
                                    width: "140px",
                                    height: "40px",
                                }}
                            >
                                Complete
                            </Button>

                            <Button
                                href="/playlists"
                                variant="contained"
                                sx={{
                                    bgcolor: "#444",
                                    ":hover": { bgcolor: "#666" },
                                    width: "140px",
                                    height: "40px",
                                }}
                            >
                                Cancel
                            </Button>
                        </Box>

                        {avatarError && (
                            <Typography sx={{ color: "red", fontSize: "13px", mt: 1 }}>
                                {avatarError}
                            </Typography>
                        )}

                        <Copyright sx={{ mt: 4 }} />
                    </Box>
                </Box>
            </Box>

            {auth.errorMessage && <MUIErrorModal />}
        </Box>
    );
}
