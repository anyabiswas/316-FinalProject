import { useContext, useState } from 'react';
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

export default function LoginScreen() {
    const { auth } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        auth.loginUser(email, password);   
    };

    let modalJSX = "";
    if (auth.errorMessage !== null) {
        modalJSX = <MUIErrorModal />;
    }
    console.log(modalJSX);

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
                    maxWidth: 450,
                    px: 4,
                    py: 6,
                    bgcolor: "var(--swatch-primary)",
                    borderRadius: "8px",
                }}
            >
                
                <LockOutlinedIcon sx={{ fontSize: 50, mb: 1, color: "#444" }} />

              
                <Typography
                    component="h1"
                    variant="h5"
                    sx={{
                        mb: 4,
                        color: "#444",
                        fontWeight: 600,
                    }}
                >
                    Sign In
                </Typography>

            
                <Box component="form" onSubmit={handleSubmit}>
                    
                   
                    <TextField
                        required
                        fullWidth
                        label="Email"
                        name="email"
                        margin="normal"
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
                        sx={{
                            bgcolor: "#e7e3ef",
                            borderRadius: "6px",
                        }}
                    />

                    
                    <TextField
                        required
                        fullWidth
                        label="Password"
                        type="password"
                        name="password"
                        margin="normal"
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
                        sx={{
                            bgcolor: "#e7e3ef",
                            borderRadius: "6px",
                        }}
                    />

                    
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                            mt: 3,
                            mb: 2,
                            bgcolor: "black",
                            ":hover": { bgcolor: "#333" },
                            height: "48px",
                        }}
                    >
                        SIGN IN
                    </Button>

                    <Typography sx={{ color: "red", mt: 1 }}>
                        Don’t have an account?{" "}
                        <a href="/register/">Sign Up</a>
                    </Typography>

                    <Copyright sx={{ mt: 6 }} />
                </Box>
            </Box>
            { modalJSX }
        </Box>
    );
}
