import Navbar from "../components/Navbar.tsx";
import {
    BottomNavigation, BottomNavigationAction,
    Box, Container, Link, Paper,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import {
    Folder,
    FormatListBulleted,
    People,
    Shield,
} from "@mui/icons-material";
import {useParams} from "react-router";
import {useState} from "react";
import useStore from "../hooks/useStore.tsx";
import type {Event as EventType} from "../hooks/useStore.tsx";
import Generals from "../components/Generals.tsx";
import Participants from "../components/Participants.tsx";
import Measures from "../components/Measures.tsx";
import MyNotes from "../components/MyNotes.tsx";
import NavbarEvent from "../components/NavbarEvent.tsx";

function Event() {
    const {id} = useParams()
    const {getEventById} = useStore()
    
    const [event] = useState<EventType | undefined>(id ? getEventById(id) : undefined)
    const [componentID, setComponentID] = useState(0);

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
        <Box sx={{display: "flex", flexDirection: "column", height: "100dvh"}}>
            <NavbarEvent event={event}/>
            <Container maxWidth="md"
                       sx={{flexGrow: 1, overflow: "auto", scrollbarWidth: "none", p: 1, pb: 7.5}}>
                {componentID === 0 && <Generals id={id}/>}
                {componentID === 1 && <Measures id={id}/>}
                {componentID === 2 && <Participants id={id}/>}
                {componentID === 3 && <MyNotes id={id}/>}
            </Container>
            <Paper elevation={1}>
                <BottomNavigation showLabels
                                  value={componentID}
                                  onChange={(_event, newValue) => setComponentID(newValue)}
                                  sx={{minHeight: 70}}>
                    <BottomNavigationAction label="Allgemeines" icon={<Folder/>}/>
                    <BottomNavigationAction label="Maßnahme" icon={<Shield/>}/>
                    <BottomNavigationAction label="Beteiligte" icon={<People/>}/>
                    <BottomNavigationAction label="Notizen" icon={<FormatListBulleted/>}/>
                </BottomNavigation>
            </Paper>
        </Box>
    )
}

export default Event