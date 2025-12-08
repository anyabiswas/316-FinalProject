import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../auth";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";

export default function AppBanner() {
    const { auth } = useContext(AuthContext);
    const history = useHistory();

    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = (e) => setAnchorEl(e.target);
    const closeMenu = () => setAnchorEl(null);

    const avatarIcon = auth.loggedIn
        ? <Avatar src={auth.user?.avatar} sx={{ width: 40, height: 40 }} />
        : <Avatar sx={{ width: 40, height: 40, bgcolor: "white", color: "#ff00cc" }} />;

    return (
        <AppBar
            position="static"
            sx={{
                backgroundColor: "#ff00cc",
                boxShadow: "none"
            }}>
            
            <Toolbar
                sx={{
                    width: "100%",
                    maxWidth: "1200px",     
                    margin: "0 auto",        
                    display: "flex",
                    alignItems: "center"
                }}>

<Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
  
    <IconButton sx={{ color: "white" }} onClick={() => history.push("/welcome")}>
        ⌂
    </IconButton>

    {auth.loggedIn && (
        <>
            <Button
                onClick={() => history.push("/playlists")}
                sx={{
                    backgroundColor: "#2c2c2c",
                    color: "white",
                    padding: "4px 14px",
                    borderRadius: "12px",
                    fontSize: "14px",
                    textTransform: "none",
                    "&:hover": { backgroundColor: "#1a1a1a" }
                }}
            >
                Playlists
            </Button>

            <Button
                onClick={() => history.push("/songs")}
                sx={{
                    backgroundColor: "#3366ff",
                    color: "white",
                    padding: "4px 14px",
                    borderRadius: "12px",
                    fontSize: "14px",
                    textTransform: "none",
                    "&:hover": { backgroundColor: "#1e4ccc" }
                }}
            >
                Song Catalog
            </Button>
        </>
    )}
</Box>

               
                <Box sx={{ flexGrow: 1, textAlign: "center" }}>
                    <Typography sx={{ color: "white", fontSize: "36px", fontWeight: 500 }}>
                        The Playlister
                    </Typography>
                </Box>

               
                <IconButton onClick={openMenu} sx={{ color: "white" }}>
                    {avatarIcon}
                </IconButton>

                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
                    {!auth.loggedIn && (
                        <>
                            <MenuItem onClick={() => { closeMenu(); history.push("/login"); }}>Login</MenuItem>
                            <MenuItem onClick={() => { closeMenu(); history.push("/register"); }}>
                                Create Account
                            </MenuItem>
                        </>
                    )}
                    {auth.loggedIn && (
                        <>
                            <MenuItem onClick={() => { closeMenu(); history.push("/editaccount"); }}>
                                Edit Account
                            </MenuItem>
                            <MenuItem onClick={() => { closeMenu(); auth.logoutUser(); history.push("/welcome"); }}>
                                Logout
                            </MenuItem>
                        </>
                    )}
                </Menu>
            </Toolbar>
        </AppBar>
    );
}