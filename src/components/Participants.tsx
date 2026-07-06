import useStore, {type Event, type Participant} from "../hooks/useStore.tsx"
import {
    Box,
    Button, Fab,
    Link,
    Stack,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import dayjs, {type Dayjs} from "dayjs";
import {useState} from "react";
import ParticipantsDialog from "./ParticipantsDialog.tsx";
import {Add, ArrowForward, GroupAdd, LocalPhone, People, Person} from "@mui/icons-material";
import {DateTimeInput} from "./DateTimeInput.tsx";
import FormSection from "./FormSection.tsx";
import InputContainer from "./InputContainer.tsx";
import AnimatedCard from "./AnimatedCard.tsx";
import EmptyState from "./EmptyState.tsx";

type ParticipantProps = {
    id: string;
}

export default function Participants(props: ParticipantProps) {
    const {changeEventById} = useStore()

    const event = useStore((state) => state.events.find((e) => e.id === props.id))
    const [participantsDialogOpen, setParticipantsDialogOpen] = useState<boolean>(false);
    const [selectedParticipant, setSelectedParticipant] = useState<Participant | undefined>(undefined);

    function handleParticipantsDialogClose() {
        setParticipantsDialogOpen(false);
    }

    function handleParticipantsDialogOpen() {
        setSelectedParticipant(undefined)
        setParticipantsDialogOpen(true);
    }

    function handleDeleteParticipantsById(id: string) {
        if (!event) return

        const newEvent: Event = {
            ...event,
            participants: event.participants.filter((participant) => participant.id !== id)
        }

        changeEventById(event.id, newEvent);
    }

    function handleChangeParticipantsFrom(participantId: string, value: Dayjs) {
        if (!event) return

        const newEvent: Event = {
            ...event,
            participants: event.participants.map((participant) => {
                if (participant.id === participantId) {
                    return {
                        ...participant,
                        from: value
                    }
                }
                return {
                    ...participant
                }
            })
        }

        changeEventById(event.id, newEvent);
    }

    function handleChangeParticipantsUntil(participantId: string, value: Dayjs) {
        if (!event) return

        const newEvent: Event = {
            ...event,
            participants: event.participants.map((participant) => {
                if (participant.id === participantId) {
                    return {
                        ...participant,
                        until: value
                    }
                }
                return {
                    ...participant
                }
            })
        }

        changeEventById(event.id, newEvent);
    }

    function handleEditParticipant(participant: Participant) {
        setSelectedParticipant(participant)
        setParticipantsDialogOpen(true)
    }

    return (
        <>
            <Box>
                <Stack direction={"column"} spacing={1}>
                    {event?.participants.length ? event.participants.map((participant) => (
                        <AnimatedCard key={participant.id}>
                            <FormSection key={participant.id}
                                         icon={<People color="secondary"/>}
                                         title={participant.organisation}>

                                <Stack direction="column"
                                       spacing={1}
                                       sx={{width: "100%"}}>
                                    {(participant.name || participant.call) && (
                                        <Stack direction="column" spacing={1} sx={{py: 2}}>
                                            {participant.name && (
                                                <Stack direction="row" spacing={1}>
                                                    <Person fontSize="small"/>
                                                    <Typography>{participant.name} {participant.function && ` (${participant.function})`}</Typography>
                                                </Stack>
                                            )}
                                            {participant.call && (
                                                <Stack direction="row" spacing={1}>
                                                    <LocalPhone fontSize="small"/>
                                                    <Link href={`tel:${participant.call}`}>{participant.call}</Link>
                                                </Stack>
                                            )}
                                        </Stack>
                                    )}

                                    <InputContainer>
                                        <Stack direction="row" spacing={1}>
                                            <DateTimeInput label="Anmeldung"
                                                           format="HH:mm"
                                                           value={participant.from && dayjs(participant.from)}
                                                           handleChange={(value) => handleChangeParticipantsFrom(participant.id, value)}/>
                                            <Box sx={{display: "flex", alignItems: "center"}}>
                                                <ArrowForward/>
                                            </Box>
                                            <DateTimeInput label="Abmeldung"
                                                           format="HH:mm"
                                                           value={participant.until && dayjs(participant.until)}
                                                           handleChange={(value) => handleChangeParticipantsUntil(participant.id, value)}/>
                                        </Stack>
                                    </InputContainer>
                                </Stack>
                                <Box sx={{
                                    display: "flex",
                                    justifyContent: "end"
                                }}>
                                    <Button onClick={() => handleEditParticipant(participant)}>Bearbeiten</Button>
                                    <Button
                                        onClick={() => handleDeleteParticipantsById(participant.id)}>Löschen</Button>
                                </Box>
                            </FormSection>
                        </AnimatedCard>

                        // <Card key={participant.id}
                        //       variant="outlined"
                        //       sx={{mb: 1}}>
                        //     <CardHeader title={participant.organisation}/>
                        //     <CardContent>
                        //         <Stack direction="column"
                        //                spacing={1}
                        //                sx={{width: "100%"}}>
                        //             <Stack direction="column" sx={{pb: 2}}>
                        //                 <Typography>{participant.name} {participant.function && ` (${participant.function})`}</Typography>
                        //
                        //                 <Link
                        //                     href={`tel:${participant.call}`}>{participant.call}</Link>
                        //             </Stack>
                        //             <DateTimeInput label="Anmeldung"
                        //                            value={participant.from && dayjs(participant.from)}
                        //                            handleChange={(value) => handleChangeParticipantsFrom(participant.id, value)}/>
                        //             <DateTimeInput label="Abmeldung"
                        //                            value={participant.until && dayjs(participant.until)}
                        //                            handleChange={(value) => handleChangeParticipantsUntil(participant.id, value)}/>
                        //
                        //         </Stack>
                        //     </CardContent>
                        //     <CardActions>
                        //         <Typography sx={{flexGrow: 1}}/>
                        //         <Button onClick={() => handleEditParticipant(participant)}>Bearbeiten</Button>
                        //         <Button onClick={() => handleDeleteParticipantsById(participant.id)}>Löschen</Button>
                        //     </CardActions>
                        // </Card>
                    )) : (
                        <EmptyState title="Noch keine Beteiligten"
                                    subtitle="Lege den ersten Beteiligten für dieses Ereignis an, um ihn hier zu sehen."
                                    buttonText="Beteiligten hinzufügen"
                                    icon={<GroupAdd sx={{fontSize: 60, color: "primary.main"}}/>}
                                    onClick={handleParticipantsDialogOpen}
                        />
                        // <EmptyParticipantsState onAdd={handleParticipantsDialogOpen}/>
                    )}
                    {/*<Button variant="contained"*/}
                    {/*        onClick={handleParticipantsDialogOpen}>Hinzufügen</Button>*/}
                </Stack>
            </Box>
            {event && event.participants.length > 0 && (
                <Fab sx={{position: "fixed", bottom: 80, right: 10}}
                     disabled={event && event?.participants.length > 14}
                     color="primary"
                     aria-label="add"
                     size="medium"
                     variant="extended"
                     onClick={handleParticipantsDialogOpen}
                >
                    <Add/>
                </Fab>
            )}
            <ParticipantsDialog key={selectedParticipant?.id}
                                eventId={props.id}
                                open={participantsDialogOpen}
                                handleClose={handleParticipantsDialogClose}
                                selectedParticipant={selectedParticipant}/>
        </>
    )
}