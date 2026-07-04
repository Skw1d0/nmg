import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import {DarkMode, LightMode} from "@mui/icons-material";
import useStore from "../hooks/useStore.tsx";
import {Box, Container} from "@mui/material";
import logo from "../assets/512.png"

function Navbar() {
    const {toggleDarkMode, darkMode} = useStore();

    return (
        <>
            <AppBar position="static" color="inherit" elevation={1} sx={{zIndex: 9999}}>
                <Container maxWidth="md" disableGutters>
                    <Toolbar sx={{display: "flex", gap: 1}}>
                        <Box component="img"
                             sx={{
                                 height: 35,
                                 width: 35,
                             }}
                             alt="Logo"
                             src={logo}
                        />
                        <Typography variant="h5" sx={{flexGrow: 1}}>Notes</Typography>
                        <IconButton color="primary" onClick={() => toggleDarkMode()}>
                            {darkMode ? <DarkMode/> : <LightMode/>}
                        </IconButton>
                    </Toolbar>
                </Container>
            </AppBar>
        </>
    );
}

export default Navbar;
