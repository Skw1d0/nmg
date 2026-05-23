import {Add, ArrowForwardIos} from "@mui/icons-material";
import Navbar from "../components/Navbar.tsx";
import {
    Box,
    Button, Card, CardActions, CardHeader,
    Fab,

} from "@mui/material";
import {useNavigate} from "react-router";
import useStore from "../hooks/useStore.tsx";
import dayjs from "dayjs";
import Typography from "@mui/material/Typography";

export default function Archive() {
    const navigate = useNavigate()
    const {addNewEvent, events} = useStore()

    const handleCreateNewEvent = () => {
        const newEventID = addNewEvent()
        navigate(`/event/${newEventID}`)
    }

    return (
        <>
            <Box sx={{display: "flex", flexDirection: "column", height: "100dvh"}}>
                <Navbar/>
                {events.length > 0 ? (
                    <Box sx={{flexGrow: 1, overflow: "auto", p: 1}}>
                        {events.map((event) => (
                            <Card key={event.id} variant="outlined" sx={{mb: 1}}>
                                <CardHeader title={event.description}
                                            subheader={dayjs(event.protectionFrom).format("DD.MM.YYYY HH:mm")}/>
                                <CardActions sx={{display: "flex", justifyContent: "end"}}>
                                    <Button variant="contained"
                                            onClick={() => navigate(`/event/${event.id}`)}
                                            endIcon={<ArrowForwardIos/>}
                                    >Bearbeiten</Button>
                                </CardActions>
                            </Card>
                        ))}
                    </Box>
                ) : (
                    <Typography sx={{m: 2}}>Bitte ein neues Ereignis anlegen</Typography>
                )}
                {/*</Stack>*/}
            </Box>
            <Fab sx={{position: "fixed", bottom: 10, right: 10}}
                 color="primary"
                 aria-label="add"
                 onClick={handleCreateNewEvent}
            >
                <Add/>
            </Fab>
        </>
    )
}