import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import {DarkMode, LightMode} from "@mui/icons-material";
import useStore from "../hooks/useStore.tsx";

function Navbar() {
    const {toggleDarkMode, darkMode} = useStore();

    return (
        <>
            <AppBar position="static" color="inherit" elevation={1} sx={{marginBottom: 0, zIndex: 1}}>
                <Toolbar sx={{
                    display: "flex",
                    gap: 1,
                }}>
                    <Typography variant="h5" sx={{flexGrow: 1}}>Schutzmaßnahmen</Typography>
                    <IconButton color="primary" onClick={() => toggleDarkMode()}>
                        {darkMode ? <DarkMode/> : <LightMode/>}
                    </IconButton>
                </Toolbar>
            </AppBar>
        </>
    );
}

export default Navbar;
