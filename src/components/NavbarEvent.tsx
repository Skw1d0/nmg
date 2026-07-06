import AppBar from "@mui/material/AppBar";
import {
    Box,
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent, DialogTitle,
    Divider, FormControl,
    Menu,
    MenuItem,
    MenuList, Stack, TextField
} from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import {ArrowBack, DarkMode, Delete, IosShare, LightMode} from "@mui/icons-material";
import useStore from "../hooks/useStore.tsx";
import MoreVertIcon from '@mui/icons-material/MoreVert';

import {useNavigate} from "react-router";
import {type Event} from "../hooks/useStore.tsx"
import {useState} from "react";
import {usePdf} from "../hooks/usePdf.tsx";
import * as React from "react";
import dayjs from "dayjs";
import InputContainer from "./InputContainer.tsx";

type NavbarEventProps = {
    event: Event
}

function NavbarEvent(props: NavbarEventProps) {
    const navigate = useNavigate();

    const {toggleDarkMode, darkMode, deleteEventById} = useStore();
    const {generatePdf} = usePdf()

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [openSaveDialog, setOpenSaveDialog] = useState(false)

    const [password, setPassword] = useState("")
    const [passwordError, setPasswordError] = useState(false)

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const openMenu = Boolean(anchorEl);

    const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    function handleOpenDeleteDialog() {
        setAnchorEl(null);
        setOpenDeleteDialog(true)
    }

    function handleCloseDeleteDialog() {
        setOpenDeleteDialog(false)
    }

    function handleDeleteEvent(id: string) {
        setAnchorEl(null);
        deleteEventById(id)
        navigate(`/`)
    }

    function handleOpenSaveDialog() {
        setAnchorEl(null);
        setOpenSaveDialog(true)
    }

    function handleCloseSaveDialog() {
        setOpenSaveDialog(false)
    }

    function handleChangePassword(value: string) {
        setPasswordError(false)
        setPassword(value)
    }

    async function handleSavePdf() {
        if (!props.event.id) return
        const result = await generatePdf(password, props.event.id, "save")
        if (!result) {
            setPasswordError(true)
            return
        }
        handleCloseSaveDialog()
    }

    return (
        <>
            <AppBar position="static" color="inherit" elevation={1} sx={{zIndex: 9999}}>
                <Container maxWidth="md" disableGutters>
                    <Toolbar sx={{display: "flex", gap: 1}}>
                        <IconButton onClick={() => navigate("/")}
                                    color="primary">
                            <ArrowBack/>
                        </IconButton>
                        <Stack direction="column" spacing={-0.2} sx={{flexGrow: 1}}>
                            <Typography
                                sx={{
                                    overflow: "hidden",
                                    maxHeight: 22,
                                    fontWeight: 800,
                                }}>{props.event.description || "Ereignis"}</Typography>
                            <Typography
                                sx={{
                                    fontWeight: 400,
                                    fontSize: 13,
                                    color: "secondary.main",
                                }}>{dayjs(props.event.protectionFrom).format("DD.MM.YYYY")}</Typography>
                        </Stack>
                        <IconButton color="primary" onClick={() => toggleDarkMode()}>
                            {darkMode ? <DarkMode/> : <LightMode/>}
                        </IconButton>
                        <Divider orientation="vertical" variant="middle" flexItem/>
                        <IconButton color="primary" onClick={handleOpenMenu}>
                            <MoreVertIcon/>
                        </IconButton>
                    </Toolbar>
                </Container>
            </AppBar>
            <Menu anchorEl={anchorEl}
                  onClose={handleCloseMenu}
                  open={openMenu}>
                <MenuList sx={{width: 250}}>
                    <MenuItem onClick={handleOpenSaveDialog}>
                        <IosShare sx={{mr: 1}}/>
                        Schutzplan exportieren
                    </MenuItem>
                    <Divider/>
                    <MenuItem onClick={handleOpenDeleteDialog}>
                        <Delete sx={{mr: 1}}/>
                        Löschen
                    </MenuItem>
                </MenuList>
            </Menu>
            <Dialog open={openDeleteDialog}
                    id="delete-dialog">
                <DialogContent>
                    Willst du die Maßnahme wirklich löschen?
                </DialogContent>
                <DialogActions>
                    <Button color="primary" variant="contained"
                            onClick={() => handleDeleteEvent(props.event.id)}>Löschen</Button>
                    <Button variant="outlined" onClick={handleCloseDeleteDialog}>Abbrechen</Button>
                </DialogActions>
            </Dialog>
            <Dialog fullWidth
                    open={openSaveDialog}
                    id="password-dialog">
                <DialogTitle>Schutzplan exportieren</DialogTitle>
                <DialogContent>
                    <Stack direction="column" spacing={2}>
                        <Typography>Zum Erstellen des Schutzplanes ist ein Kennwort nötig. Dieses entschlüsselt den
                            Vordruck 123.2110V01.</Typography>
                        <InputContainer>
                            <FormControl fullWidth>
                                <TextField label="Kennwort"
                                           error={passwordError}
                                           value={password}
                                           onChange={(e) => handleChangePassword(e.target.value)}
                                />
                            </FormControl>
                        </InputContainer>
                        <Box sx={{display: "flex", justifyContent: "end", gap: 1}}>
                            <Button color="primary"
                                    variant="contained"
                                    onClick={handleSavePdf}
                                    startIcon={<IosShare/>}>Exportieren</Button>
                            <Button color="primary"
                                    variant="outlined"
                                    onClick={handleCloseSaveDialog}>Abbrechen</Button>
                        </Box>
                    </Stack>
                </DialogContent>
                {/*<DialogActions>*/}
                {/*    <Button color="primary"*/}
                {/*            variant="contained"*/}
                {/*            onClick={handleSavePdf}*/}
                {/*            startIcon={<IosShare/>}>Exportieren</Button>*/}
                {/*    <Button color="primary"*/}
                {/*            variant="outlined"*/}
                {/*            onClick={handleCloseSaveDialog}>Abbrechen</Button>*/}
                {/*</DialogActions>*/}
            </Dialog>
        </>
    );
}

export default NavbarEvent;