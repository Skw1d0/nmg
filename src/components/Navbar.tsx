import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import {Home, Close, DarkMode, LightMode, NoteAdd} from "@mui/icons-material";
import {useState} from "react";
import {useNavigate} from "react-router";
import useStore from "../stores/useStore.tsx";

function Navbar() {
    const [open, setOpen] = useState(false);

    const navigate = useNavigate();
    const settings = useStore();

    const navigationItems = [
        {
            label: "Home",
            path: "/",
            icon: <Home/>
        },
        {
            label: "Neues Ereignis anlegen",
            path: "/event/new",
            icon: <NoteAdd/>,
        },
    ]

    // function handleOpenDrawer() {
    //     setOpen(true);
    // }

    function handleCloseDrawer() {
        setOpen(false);

    }

    function handleNavigateTo(path: string) {
        navigate(path);
        handleCloseDrawer()

    }

    return (
        <>
            <AppBar position="static" color="inherit" elevation={1} sx={{marginBottom: 0, zIndex: 1}}>
                <Toolbar sx={{
                    display: "flex",
                    gap: 1,
                }}>
                    {/*<Typography variant="h6"*/}
                    {/*            sx={{*/}
                    {/*                border: 1,*/}
                    {/*                borderRadius: 1.5,*/}
                    {/*                borderWidth: 3,*/}
                    {/*                // p: 0.2,*/}
                    {/*                px: 0.4,*/}
                    {/*                color: "red",*/}
                    {/*                backgroundColor: "white",*/}
                    {/*            }}>Nmg</Typography>*/}
                    <Typography variant="h5" sx={{flexGrow: 1}}>Schutzmaßnahmen</Typography>
                    <IconButton color="primary" onClick={() => settings.toggleDarkMode()}>
                        {settings.darkMode ? <DarkMode/> : <LightMode/>}
                    </IconButton>
                    {/*<IconButton*/}
                    {/*    color="primary"*/}
                    {/*    onClick={() => handleOpenDrawer()}*/}
                    {/*>*/}
                    {/*    <Menu/>*/}
                    {/*</IconButton>*/}
                </Toolbar>
            </AppBar>
            <Drawer
                variant="temporary"
                anchor="top"
                open={open}
            >
                <Box sx={{display: "flex", alignItems: "center", justifyContent: "right", padding: 0.5}}>
                    <IconButton onClick={handleCloseDrawer} color={"primary"}><Close/></IconButton>
                </Box>
                <List>
                    {navigationItems.map((item) => (
                        <ListItem key={item.label} disablePadding>
                            <ListItemButton onClick={() => handleNavigateTo(item.path)} sx={{gap: 2}}>
                                <ListItemIcon>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.label}/>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </>
    );
}

export default Navbar;
