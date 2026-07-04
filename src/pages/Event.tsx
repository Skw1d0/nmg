import Navbar from "../components/Navbar.tsx";
import {
    BottomNavigation, BottomNavigationAction,
    Box, Container, Paper
} from "@mui/material";
import {
    FolderOutlined,
    FormatListBulleted,
    PeopleOutlined,
    ShieldOutlined,
} from "@mui/icons-material";
import {useNavigate, useParams} from "react-router";
import {useState} from "react";
import useStore from "../hooks/useStore.tsx";
import Generals from "../components/Generals.tsx";
import Participants from "../components/Participants.tsx";
import Measures from "../components/Measures.tsx";
import MyNotes from "../components/MyNotes.tsx";
import NavbarEvent from "../components/NavbarEvent.tsx";
import EventNotFound from "../components/EventNotFound.tsx";

function Event() {
    const {id} = useParams()
    const {getEventById} = useStore()
    const navigate = useNavigate();

    // const [event] = useState<EventType | undefined>(id ? getEventById(id) : undefined)
    const event = id ? getEventById(id) : null;
    const [componentID, setComponentID] = useState(0);

    if (!event || !id) {
        return (
            <>
                <Navbar/>
                <Container maxWidth="md"
                           sx={{flexGrow: 1, overflow: "auto", scrollbarWidth: "none", p: 1, pb: 7.5}}>
                    <EventNotFound onAdd={() => navigate("/")}/>
                </Container>
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
                    <BottomNavigationAction label="Allgemeines" icon={<FolderOutlined/>}/>
                    <BottomNavigationAction label="Maßnahme" icon={<ShieldOutlined/>}/>
                    <BottomNavigationAction label="Beteiligte" icon={<PeopleOutlined/>}/>
                    <BottomNavigationAction label="Notizen" icon={<FormatListBulleted/>}/>
                </BottomNavigation>
            </Paper>
        </Box>
    )
}

export default Event