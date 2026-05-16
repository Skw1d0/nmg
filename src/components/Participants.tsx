import useStore, {type Event} from "../stores/useStore.tsx"
import {
    Box,
    Button, Card, CardActions, CardContent, CardHeader, Fab,
    Link,
    Stack,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import {DateTimePicker} from "@mui/x-date-pickers";
import dayjs, {type Dayjs} from "dayjs";
import {useState} from "react";
import ParticipantsDialog from "./ParticipantsDialog.tsx";
import {Add} from "@mui/icons-material";

type ParticipantProps = {
    id: string;
}

export default function Participants(props: ParticipantProps) {
    const {changeEventById} = useStore()

    const event = useStore((state) => state.events.find((e) => e.id === props.id))
    const [participantsDialogOpen, setParticipantsDialogOpen] = useState<boolean>(false);

    function handleParticipantsDialogClose() {
        setParticipantsDialogOpen(false);
    }

    function handleParticipantsDialogOpen() {
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

    return (
        <>
            <Box>
                <Stack direction={"column"} spacing={1}>
                    {event?.participants.length ? event.participants.map((participant) => (
                        <Card key={participant.id}
                              variant="outlined"
                              sx={{mb: 1}}>
                            <CardHeader title={participant.organisation}/>
                            <CardContent>
                                <Stack direction="column"
                                       spacing={1}
                                       sx={{width: "100%"}}>
                                    <Stack direction="column" sx={{pb: 2}}>
                                        <Typography>{participant.name} ({participant.function})</Typography>
                                        <Link
                                            href={`tel:${participant.call}`}>{participant.call}</Link>
                                    </Stack>
                                    <DateTimePicker label={"Anmeldung"}
                                                    sx={{width: "100%"}}
                                                    value={participant.from && dayjs(participant.from)}
                                                    onChange={(value) => handleChangeParticipantsFrom(participant.id, dayjs(value))}
                                                    slotProps={{
                                                        actionBar: {
                                                            actions: ['today', 'cancel', 'accept'],
                                                        },
                                                    }}
                                    />
                                    <DateTimePicker label={"Abmeldung"}
                                                    sx={{width: "100%"}}
                                                    value={participant.until && dayjs(participant.until)}
                                                    onChange={(value) => handleChangeParticipantsUntil(participant.id, dayjs(value))}
                                                    slotProps={{
                                                        actionBar: {
                                                            actions: ['today', 'cancel', 'accept'],
                                                        },
                                                    }}
                                    />
                                </Stack>
                            </CardContent>
                            <CardActions>
                                <Typography sx={{flexGrow: 1}}/>
                                {/*<Button>Bearbeiten</Button>*/}
                                <Button onClick={() => handleDeleteParticipantsById(participant.id)}>Löschen</Button>
                            </CardActions>
                        </Card>
                    )) : (
                        <Typography sx={{py: 2}}>Bitte einen Beteiligten hinzufügen</Typography>
                    )}
                    {/*<Button variant="contained"*/}
                    {/*        onClick={handleParticipantsDialogOpen}>Hinzufügen</Button>*/}
                </Stack>
            </Box>
            <Fab sx={{position: "fixed", bottom: 80, right: 10}}
                 color="primary"
                 aria-label="add"
                 size="medium"
                 variant="extended"
                 onClick={handleParticipantsDialogOpen}
            >
                <Add/>
            </Fab>
            <ParticipantsDialog id={props.id}
                                open={participantsDialogOpen}
                                handleClose={handleParticipantsDialogClose}/>
        </>
    )
}