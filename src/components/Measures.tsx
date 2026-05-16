import useStore, {type Event, type Measure, type Participant} from "../stores/useStore.tsx";
import dayjs, {type Dayjs} from "dayjs";
import {
    Button, Card, CardActions, CardContent, Fab,
    Stack,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import {Add} from "@mui/icons-material";
import {DateTimePicker} from "@mui/x-date-pickers";
import {useState} from "react";
import MeasuresDialog from "./MeasuresDialog.tsx";
import MeasureTextBox from "./MeasureTextBox.tsx";

type MeasuresProps = {
    id: string;
}

export default function Measures(props: MeasuresProps) {
    const {changeEventById} = useStore()

    const event = useStore((state) => state.events.find((e) => e.id === props.id))
    const [measureDialogOpen, setMeasureDialogOpen] = useState<boolean>(false);

    function handleMeasureDialogOpen() {
        setMeasureDialogOpen(true);
    }

    function handleMeasureDialogClose() {
        setMeasureDialogOpen(false);
    }

    function handleDeleteMeasureById(id: string) {
        if (!event) return

        const newEvent: Event = {
            ...event,
            measures: event.measures.filter((measure) => measure.id !== id)
        }

        changeEventById(event.id, newEvent);
    }

    function handleChangeMeasureFromById(id: string, value: Dayjs) {
        if (!event) return

        const newEvent: Event = {
            ...event,
            measures: event.measures.map((measure) => {
                if (measure.id !== id) return measure;

                return {
                    ...measure,
                    from: value
                }
            })
        }

        changeEventById(event.id, newEvent);
    }

    function handleChangeMeasureUntilById(id: string, value: Dayjs) {
        if (!event) return

        const newEvent: Event = {
            ...event,
            measures: event.measures.map((measure) => {
                if (measure.id !== id) return measure;

                return {
                    ...measure,
                    until: value
                }
            })
        }

        changeEventById(event.id, newEvent);
    }

    function checkParticipantIntoIntroduced(measure: Measure, participant: Participant): boolean {
        if (!event) return false;
        if (!measure) return false;
        if (!participant) return false;

        return !!measure.participantsIntroduced.find((participantIntroduced) => participantIntroduced.id === participant.id);
    }

    function checkParticipantIntoLifted(measure: Measure, participant: Participant): boolean {
        if (!event) return false;
        if (!measure) return false;
        if (!participant) return false;

        return !!measure.participantsLifted.find((participantIntroduced) => participantIntroduced.id === participant.id);
    }

    function handleAddParticipantToIntroduced(measureId: string, participant: Participant) {
        if (!event) return

        const newEvent: Event = {
            ...event,
            measures: event.measures.map((measure) => {
                if (measure.id !== measureId) return measure;
                return {
                    ...measure,
                    participantsIntroduced: [
                        ...measure.participantsIntroduced,
                        participant
                    ]

                }
            })
        }
        changeEventById(event.id, newEvent);
    }

    function handleAddParticipantToLifted(measureId: string, participant: Participant) {
        if (!event) return

        const newEvent: Event = {
            ...event,
            measures: event.measures.map((measure) => {
                if (measure.id !== measureId) return measure;
                return {
                    ...measure,
                    participantsLifted: [
                        ...measure.participantsLifted,
                        participant
                    ]

                }
            })
        }
        changeEventById(event.id, newEvent);
    }

    return (
        <>
            <Stack direction="column" spacing={1}>
                {event?.measures.length ? event.measures.map((measure) => (
                    <Card key={measure.id}
                          variant="outlined"
                          elevation={0}
                    >
                        <CardContent>
                            <Stack direction="column"
                                   spacing={1}
                                   sx={{width: "100%"}}>
                                <Stack direction="column" spacing={1} sx={{pb: 2}}>
                                    <Typography
                                        variant={"h5"}>{measure.locationFrom} {measure.locationTo && ` - ${measure.locationTo}`}</Typography>
                                    <Typography sx={{mb: 1}}>{measure.locationDetails}</Typography>
                                    <MeasureTextBox type={measure.measure}/>
                                </Stack>
                                <Stack direction="column" spacing={1} sx={{pb: 2}}>
                                    <DateTimePicker label={"Eingeführt"}
                                                    sx={{width: "100%"}}
                                                    value={measure.from && dayjs(measure.from)}
                                                    onChange={(value) => handleChangeMeasureFromById(measure.id, dayjs(value))}
                                                    slotProps={{
                                                        actionBar: {
                                                            actions: ['today', 'cancel', 'accept'],
                                                        },
                                                    }}
                                    />
                                    {measure.from && event.participants.map((participant) => (
                                        (dayjs(participant.until).unix() > dayjs(measure.from).unix() || !participant.until) &&
                                        <Button key={participant.id}
                                                color={!checkParticipantIntoIntroduced(measure, participant) ? "warning" : "success"}
                                                onClick={() => handleAddParticipantToIntroduced(measure.id, participant)}
                                                variant="contained">{participant.organisation}</Button>
                                    ))}
                                </Stack>
                                <Stack direction="column" spacing={1}>
                                    <DateTimePicker label={"Aufgehoben"}
                                                    sx={{width: "100%"}}
                                                    value={measure.until && dayjs(measure.until)}
                                                    onChange={(value) => handleChangeMeasureUntilById(measure.id, dayjs(value))}
                                                    slotProps={{
                                                        actionBar: {
                                                            actions: ['today', 'cancel', 'accept'],
                                                        },
                                                    }}
                                    />
                                    {measure.until && event.participants.map((participant) => (
                                        (dayjs(participant.until).unix() > dayjs(measure.until).unix() || !participant.until) &&
                                        <Button key={participant.id}
                                                color={!checkParticipantIntoLifted(measure, participant) ? "warning" : "success"}
                                                onClick={() => handleAddParticipantToLifted(measure.id, participant)}
                                                variant="contained">{participant.organisation}</Button>
                                    ))}
                                </Stack>
                            </Stack>
                        </CardContent>
                        <CardActions>
                            <Typography sx={{flexGrow: 1}}/>
                            {/*<Button>Bearbeiten</Button>*/}
                            <Button onClick={() => handleDeleteMeasureById(measure.id)}>Löschen</Button>
                        </CardActions>
                    </Card>
                )) : (
                    <Typography sx={{py: 2}}>Bitte eine Maßnahme hinzufügen</Typography>
                )}
                {/*<Button variant="contained"*/}
                {/*        onClick={handleMeasureDialogOpen}>Hinzufügen</Button>*/}
            </Stack>
            <Fab sx={{position: "fixed", bottom: 80, right: 10}}
                 color="primary"
                 aria-label="add"
                 size="medium"
                 variant="extended"
                 onClick={handleMeasureDialogOpen}
            >
                <Add/>
            </Fab>
            <MeasuresDialog id={props.id}
                            open={measureDialogOpen}
                            handleClose={handleMeasureDialogClose}/>
        </>

    )
}