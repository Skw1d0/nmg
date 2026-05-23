import useStore, {type Event, type Measure, type Participant} from "../hooks/useStore.tsx";
import dayjs, {type Dayjs} from "dayjs";
import {
    Button, Card, CardActions, CardContent, Fab,
    Stack,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import {Add, Bolt, Map, PictureInPicture, LocationPin} from "@mui/icons-material";
import {DateTimePicker} from "@mui/x-date-pickers";
import {useState} from "react";
import MeasuresDialog from "./MeasuresDialog.tsx";
import MeasureTextBox from "./MeasureTextBox.tsx";
import data from "../tools/data.ts";
import IconButton from "@mui/material/IconButton";
import useOpenWebsites from "../hooks/useOpenWebsite.ts";


type MeasuresProps = {
    id: string;
}

export default function Measures(props: MeasuresProps) {
    const {changeEventById} = useStore()
    const {openAPN, openOpenrailwaymaps, openGoogleMaps} = useOpenWebsites()

    const event = useStore((state) => state.events.find((e) => e.id === props.id))
    const [measureDialogOpen, setMeasureDialogOpen] = useState<boolean>(false);
    const [selectedMeasure, setSelectedMeasure] = useState<Measure | undefined>(undefined);

    function handleMeasureDialogOpen() {
        setSelectedMeasure(undefined)
        setMeasureDialogOpen(true)
    }

    function handleMeasureDialogClose() {
        setMeasureDialogOpen(false)
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

    function handleEditMeasure(measure: Measure) {
        setSelectedMeasure(measure);
        setMeasureDialogOpen(true);
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
                                    <Typography sx={{mb: 1, fontStyle: "italic"}}>{measure.locationDetails}</Typography>
                                    <Stack direction="column" spacing="1">
                                        {data.ordnungsrahmen.betriebsstellen.find((e) => e.langname === measure.locationFrom) && (
                                            <Stack direction="row" spacing={1}
                                                   sx={{display: "flex", alignItems: "center"}}>
                                                <Typography>
                                                    {data.ordnungsrahmen.betriebsstellen.find((e) => e.langname === measure.locationFrom)?.betriebsstellentypen.map((bst) => {
                                                        if (bst === "bahnhof") return "Bf ";
                                                        if (bst === "bahnhofsteil") return "Bft ";
                                                        if (bst === "haltepunkt") return "Hp ";
                                                        if (bst === "abzweigstelle") return "Azwst ";
                                                        if (bst === "ueberleitstelle") return "Üst ";
                                                    })}
                                                </Typography>
                                                <Typography>
                                                    {data.ordnungsrahmen.betriebsstellen.find((e) => e.langname === measure.locationFrom)?.ds100}
                                                </Typography>
                                                {data.ordnungsrahmen.betriebsstellen.find((e) => e.langname === measure.locationFrom)?.elektrifiziert &&
                                                    <Bolt color="warning"/>}
                                                <Typography sx={{flexGrow: 1}}></Typography>
                                                <IconButton color="inherit"
                                                            onClick={() => openAPN(data.ordnungsrahmen.betriebsstellen.find((e) => e.langname === measure.locationFrom)?.ds100)}>
                                                    <PictureInPicture/>
                                                </IconButton>
                                                <IconButton color="inherit"
                                                            onClick={() => openOpenrailwaymaps(data.ordnungsrahmen.betriebsstellen.find((e) => e.langname === measure.locationFrom)?.geo_koordinaten.breite, data.ordnungsrahmen.betriebsstellen.find((e) => e.langname === measure.locationFrom)?.geo_koordinaten.laenge)}>
                                                    <LocationPin/>
                                                </IconButton>
                                                <IconButton color="inherit"
                                                            onClick={() => openGoogleMaps(data.ordnungsrahmen.betriebsstellen.find((e) => e.langname === measure.locationFrom)?.geo_koordinaten.breite, data.ordnungsrahmen.betriebsstellen.find((e) => e.langname === measure.locationFrom)?.geo_koordinaten.laenge)}>
                                                    <Map/>
                                                </IconButton>
                                            </Stack>
                                        )}
                                        {data.ordnungsrahmen.betriebsstellen.find((e) => e.langname === measure.locationTo) && (
                                            <Stack direction="row" spacing={1}
                                                   sx={{display: "flex", alignItems: "center"}}>
                                                <Typography>
                                                    {data.ordnungsrahmen.betriebsstellen.find((e) => e.langname === measure.locationFrom)?.betriebsstellentypen.map((bst) => {
                                                        if (bst === "bahnhof") return "Bf ";
                                                        if (bst === "bahnhofsteil") return "Bft ";
                                                        if (bst === "haltepunkt") return "Hp ";
                                                        if (bst === "abzweigstelle") return "Azwst ";
                                                        if (bst === "ueberleitstelle") return "Üst ";
                                                    })}
                                                </Typography>
                                                <Typography>
                                                    {data.ordnungsrahmen.betriebsstellen.find((e) => e.langname === measure.locationTo)?.ds100}
                                                </Typography>
                                                {data.ordnungsrahmen.betriebsstellen.find((e) => e.langname === measure.locationTo)?.elektrifiziert &&
                                                    <Bolt color="warning"/>}
                                                <Typography sx={{flexGrow: 1}}></Typography>
                                                <IconButton color="inherit"
                                                            onClick={() => openAPN(data.ordnungsrahmen.betriebsstellen.find((e) => e.langname === measure.locationTo)?.ds100)}>
                                                    <PictureInPicture/>
                                                </IconButton>
                                                <IconButton color="inherit"
                                                            onClick={() => openOpenrailwaymaps(data.ordnungsrahmen.betriebsstellen.find((e) => e.langname === measure.locationTo)?.geo_koordinaten.breite, data.ordnungsrahmen.betriebsstellen.find((e) => e.langname === measure.locationTo)?.geo_koordinaten.laenge)}>
                                                    <LocationPin/>
                                                </IconButton>
                                                <IconButton color="inherit"
                                                            onClick={() => openGoogleMaps(data.ordnungsrahmen.betriebsstellen.find((e) => e.langname === measure.locationTo)?.geo_koordinaten.breite, data.ordnungsrahmen.betriebsstellen.find((e) => e.langname === measure.locationTo)?.geo_koordinaten.laenge)}>
                                                    <Map/>
                                                </IconButton>
                                            </Stack>
                                        )}
                                    </Stack>
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
                            <Button onClick={() => handleEditMeasure(measure)}>Bearbeiten</Button>
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
            <MeasuresDialog key={selectedMeasure?.id}
                            eventId={props.id}
                            open={measureDialogOpen}
                            handleClose={handleMeasureDialogClose}
                            selectedMeasure={selectedMeasure}/>
        </>

    )
}