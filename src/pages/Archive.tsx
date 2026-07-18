import {Add, RailwayAlert} from "@mui/icons-material";
import Navbar from "../components/Navbar.tsx";
import {Box, Container, Fab, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useNavigate} from "react-router";
import useStore from "../hooks/useStore.tsx";
import dayjs from "dayjs";
import FormSection from "../components/FormSection.tsx";
import AnimatedCard from "../components/AnimatedCard.tsx";
import EmptyState from "../components/EmptyState.tsx";

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
                <Container maxWidth="md"
                           sx={{flexGrow: 1, overflow: "auto", scrollbarWidth: "none", p: 1, pb: 7.5}}>
                    {events.length > 0 ? (
                        <Stack direction="column" spacing={1}>
                            {events
                                .sort((a, b) => {
                                    const aDate = a.protectionFrom ? dayjs(a.protectionFrom) : null;
                                    const bDate = b.protectionFrom ? dayjs(b.protectionFrom) : null;

                                    if (!aDate || !bDate) return 0;

                                    if (aDate.isBefore(bDate)) return 1;
                                    if (aDate.isAfter(bDate)) return -1;
                                    return 0;
                                })
                                .map((event) => (
                                    <AnimatedCard key={event.id}>
                                        <Box
                                            onMouseDown={(e) => e.preventDefault()}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/event/${event.id}`);
                                            }}
                                            sx={{cursor: "pointer"}}>
                                            <FormSection icon={<RailwayAlert/>}
                                                         title={event.description || "Ereignis"}>
                                                {dayjs(event.protectionFrom)?.isValid()
                                                    && (
                                                        <Typography
                                                            // color="secondary"
                                                            variant="body2">
                                                            {dayjs(event.protectionFrom).format("DD.MM.YYYY HH:mm")} Uhr
                                                        </Typography>
                                                    )}
                                            </FormSection>
                                        </Box>
                                    </AnimatedCard>
                                    // <Card key={event.id} variant="outlined"
                                    //       sx={{mb: 1, cursor: "pointer", minHeight: 100}}
                                    //       onMouseDown={(e) => e.preventDefault()}
                                    //       onClick={(e) => {
                                    //           e.stopPropagation();
                                    //           navigate(`/event/${event.id}`)
                                    //       }}
                                    // >
                                    //     <CardHeader title={event.description || "Ereignis"}
                                    //                 subheader={dayjs(event.protectionFrom).format("DD.MM.YYYY HH:mm")}/>
                                    // </Card>
                                ))}
                        </Stack>
                    ) : (
                        // <Typography sx={{m: 2}}>Bitte ein neues Ereignis anlegen</Typography>
                        <EmptyState title="Noch kein Ereignis"
                                    subtitle="Lege das erste Ereignis an, um es hier zu sehen."
                                    buttonText="Ereignis hinzufügen"
                                    icon={<RailwayAlert sx={{fontSize: 60, color: "primary.main"}}/>}
                                    onClick={handleCreateNewEvent}
                        />
                        // <EmptyEventsState onClick={handleCreateNewEvent}/>
                    )}
                </Container>
                {/*</Stack>*/}
            </Box>
            {events.length > 0 && (
                <Fab sx={{position: "fixed", bottom: 10, right: 10}}
                     color="primary"
                     aria-label="add"
                     onClick={handleCreateNewEvent}
                >
                    <Add/>
                </Fab>
            )}
        </>
    )
}