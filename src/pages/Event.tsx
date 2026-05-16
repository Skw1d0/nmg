import Navbar from "../components/Navbar.tsx";
import {
    BottomNavigation, BottomNavigationAction,
    Box,
    Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl,
    Link, Menu, MenuItem, MenuList, Paper,
    Stack, TextField,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import {
    ArrowBackIos,
    Delete,
    Folder,
    People,
    Save,
    Shield
} from "@mui/icons-material";
import MenuIcon from '@mui/icons-material/Menu';
import NotesIcon from '@mui/icons-material/Notes';
import {useNavigate, useParams} from "react-router";
import {useState} from "react";
import useStore from "../stores/useStore.tsx";
import {usePdf} from "../hooks/usePdf.tsx";
import type {Event as EventType} from "../stores/useStore.tsx";
import Generals from "../components/Generals.tsx";
import Participants from "../components/Participants.tsx";
import Measures from "../components/Measures.tsx";
import Notes from "../components/Notes.tsx";
import IconButton from "@mui/material/IconButton";

function Event() {
    const navigate = useNavigate()
    const {id} = useParams()
    const {getEventById, deleteEventById} = useStore()
    const {generatePdf} = usePdf()

    const [event] = useState<EventType | undefined>(id ? getEventById(id) : undefined)
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [openSaveDialog, setOpenSaveDialog] = useState(false)

    const [password, setPassword] = useState("")
    const [passwordError, setPasswordError] = useState(false)

    const [componentID, setComponentID] = useState(0);

    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);

    // @ts-ignore
    const handleOpenMenu = (event) => {
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

    // async function handlePrintPdf() {
    //     if (!id) return
    //     const result = await generatePdf(password, id, "print")
    //     if (!result) {
    //         setPasswordError(true)
    //         return
    //     }
    //     handleCloseExportDialog()
    // }

    async function handleSavePdf() {
        if (!id) return
        const result = await generatePdf(password, id, "save")
        if (!result) {
            setPasswordError(true)
            return
        }
        handleCloseSaveDialog()
    }

    if (!event || !id) {
        return (
            <>
                <Navbar/>
                <Box sx={{margin: 1}}>
                    <Typography>Datensatz konnte nicht geladen werden.</Typography>
                    <Link href={import.meta.env.BASE_URL}>Zurück zur Übersicht</Link>
                </Box>
            </>
        )
    }

    return (
        <>
            <Box sx={{display: "flex", flexDirection: "column", height: "100dvh"}}>
                <Navbar/>
                <Stack direction="column" spacing={1}
                       sx={{flexGrow: 1, overflow: "auto", scrollbarWidth: "none", px: 1, pt: 1, pb: 7}}>
                    <Stack direction="row" spacing={2}>
                        <Button startIcon={<ArrowBackIos/>}
                                onClick={() => navigate("/")}
                                color="primary"
                                variant="contained">Zurück</Button>
                        <Typography sx={{flexGrow: 1}}></Typography>
                        {/*<Button variant="contained" startIcon={<Save/>}*/}
                        {/*        onClick={handleOpenExportDialog}>Speichern</Button>*/}
                        {/*<Button variant="outlined">Löschen</Button>*/}
                        <IconButton onClick={handleOpenMenu} color="inherit">
                            <MenuIcon/>
                        </IconButton>
                    </Stack>
                    {componentID === 0 && <Generals id={id}/>}
                    {componentID === 1 && <Measures id={id}/>}
                    {componentID === 2 && <Participants id={id}/>}
                    {componentID === 3 && <Notes id={id}/>}
                </Stack>
                <Paper
                    // sx={{position: "fixed", bottom: 0, left: 0, right: 0}}
                    elevation={3}>
                    <BottomNavigation showLabels
                                      value={componentID}
                                      onChange={(_event, newValue) => setComponentID(newValue)}
                                      sx={{minHeight: 70}}
                    >
                        <BottomNavigationAction label="Allgemeines" icon={<Folder/>}/>
                        <BottomNavigationAction label="Maßnahme" icon={<Shield/>}/>
                        <BottomNavigationAction label="Beteiligte" icon={<People/>}/>
                        <BottomNavigationAction label="Notizen" icon={<NotesIcon/>}/>
                    </BottomNavigation>
                </Paper>
            </Box>
            <Dialog open={openDeleteDialog}
                    id="delete-dialog">
                <DialogContent>
                    Willst du die Maßnahme wirklich löschen?
                </DialogContent>
                <DialogActions>
                    <Button color="primary" variant="contained"
                            onClick={() => handleDeleteEvent(event.id)}>Löschen</Button>
                    <Button variant="outlined" onClick={handleCloseDeleteDialog}>Abbrechen</Button>
                </DialogActions>
            </Dialog>
            <Dialog fullWidth
                    open={openSaveDialog}
                    id="password-dialog">
                <DialogTitle>Speichern</DialogTitle>
                <DialogContent>
                    <Stack direction="column" spacing={2}>
                        <Typography>Zum Speichern ist ein Kennwort nötig. Dieses entschlüsselt den Vordruck
                            123.2110V01.</Typography>
                        <FormControl fullWidth>
                            <TextField label="Kennwort"
                                       error={passwordError}
                                       value={password}
                                       onChange={(e) => handleChangePassword(e.target.value)}
                            />
                        </FormControl>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button color="primary"
                            variant="contained"
                            onClick={handleSavePdf}
                            startIcon={<Save/>}>Speichern</Button>
                    <Button color="primary"
                            variant="outlined"
                            onClick={handleCloseSaveDialog}>Abbrechen</Button>
                </DialogActions>
            </Dialog>
            <Menu anchorEl={anchorEl}
                  onClose={handleCloseMenu}
                  open={openMenu}>
                <MenuList sx={{width: 200}}>
                    <MenuItem onClick={handleOpenSaveDialog}>
                        <Save sx={{mr: 1}}/>
                        Speichern
                    </MenuItem>
                    <MenuItem onClick={handleOpenDeleteDialog}>
                        <Delete sx={{mr: 1}}/>
                        Löschen
                    </MenuItem>
                </MenuList>
            </Menu>
        </>
    )
}

export default Event