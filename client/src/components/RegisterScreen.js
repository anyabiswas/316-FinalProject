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

export default function RegisterScreen() {
    const { auth } = useContext(AuthContext);

    // Controlled inputs
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVerify, setPasswordVerify] = useState("");


    const [avatar, setAvatar] = useState("https://i.imgur.com/0y8Ftya.png");
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
                reader.onloadend = () => {
                    setAvatarFile(reader.result);
                    setAvatarFile(file);   
                };
                reader.readAsDataURL(file);
            } else {
                setAvatarError("Image must be exactly 250×250 pixels.");
            }
        };
        img.src = URL.createObjectURL(file);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (avatarError) return;
    
        auth.registerUser(
            userName,
            email,
            password,
            passwordVerify,
            avatar
        );
    };

    let modalJSX = "";
    if (auth.errorMessage !== null) {
        modalJSX = <MUIErrorModal />;
    }

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
                    Create Account
                </Typography>

                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        position: "relative",
                        mt: 2,
                        mb: 2
                    }}
                >
                    
                    <Box
                        sx={{
                            position: "absolute",
                            left: "60px",
                            top: "0px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center"
                        }}
                    >
                      
                        <img
                            src={avatar}
                            alt="avatar"
                            style={{
                                width: "60px",
                                height: "60px",
                                borderRadius: "50%",
                                marginBottom: "8px"
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
                                ":hover": { bgcolor: "#333" }
                                //boxShadow: "0px 0px 2px rgba(0,0,0,0.25)"
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
                            gap: 2
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
                                )
                            }}
                            sx={{ bgcolor: "#e7e3ef", borderRadius: "6px" }}
                        />

                        
                        <TextField
                            required
                            fullWidth
                            label="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <CancelIcon
                                        sx={{ color: "#777", cursor: "pointer" }}
                                        onClick={() => setEmail("")}
                                    />
                                )
                            }}
                            sx={{ bgcolor: "#e7e3ef", borderRadius: "6px" }}
                        />

                        
                        <TextField
                            required
                            fullWidth
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
                                )
                            }}
                            sx={{ bgcolor: "#e7e3ef", borderRadius: "6px" }}
                        />

                        
                        <TextField
                            required
                            fullWidth
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
                                )
                            }}
                            sx={{ bgcolor: "#e7e3ef", borderRadius: "6px" }}
                        />

                        
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 1,
                                bgcolor: "black",
                                ":hover": { bgcolor: "#333" },
                                height: "48px",
                            }}
                        >
                            Create Account
                        </Button>

                        <Typography sx={{ color: "red", mt: 1 }}>
                            Already have an account? <a href="/login/">Sign In</a>
                        </Typography>

                        <Copyright sx={{ mt: 4 }} />

                        {avatarError && (
                        <Typography
                            sx={{
                                color: "red",
                                fontSize: "13px",
                                mt: 1,
                                mb: 1,
                                textAlign: "center"
                            }}
                        >
                            {avatarError}
                        </Typography>
                    )}
                    </Box>
                </Box>
            </Box>

            {modalJSX}
        </Box>
    );
}
