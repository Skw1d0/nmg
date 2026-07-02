import {Add} from "@mui/icons-material";
import Navbar from "../components/Navbar.tsx";
import {Box, Card, CardHeader, Container, Fab} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useNavigate} from "react-router";
import useStore from "../hooks/useStore.tsx";
import dayjs from "dayjs";

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
                <Container maxWidth="md" sx={{flexGrow: 1, overflow: "auto", scrollbarWidth: "none", p: 1, pb: 7.5}}>
                    {events.length > 0 ?
                        events.map((event) => (
                            <Card key={event.id} variant="outlined"
                                  sx={{mb: 1, cursor: "pointer", minHeight: 100}}
                                  onMouseDown={(e) => e.preventDefault()}
                                  onClick={(e) => {
                                      e.stopPropagation();
                                      navigate(`/event/${event.id}`)
                                  }}
                            >
                                <CardHeader title={event.description || "Ereignis"}
                                            subheader={dayjs(event.protectionFrom).format("DD.MM.YYYY HH:mm")}/>
                                {/*<CardActions sx={{display: "flex", justifyContent: "end"}}>*/}
                                {/*    <Button variant="contained"*/}
                                {/*            onClick={() => navigate(`/event/${event.id}`)}*/}
                                {/*            endIcon={<ArrowForwardIos/>}*/}
                                {/*    >Bearbeiten</Button>*/}
                                {/*</CardActions>*/}
                            </Card>
                        )) : (
                            <Typography sx={{m: 2}}>Bitte ein neues Ereignis anlegen</Typography>
                        )}
                </Container>
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