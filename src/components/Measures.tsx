import useStore, {type Event, type Measure, type Participant} from "../hooks/useStore.tsx";
import dayjs, {type Dayjs} from "dayjs";
import {
    Accordion, AccordionDetails, AccordionSummary,
    Box,
    Button, Fab,
    Stack,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import {Add, ExpandMore, Shield} from "@mui/icons-material";
import {useState} from "react";
import MeasuresDialog from "./MeasuresDialog.tsx";
import MeasureTextBox from "./MeasureTextBox.tsx";
import data from "../tools/data.ts";
import LocationInfo from "./LocationInfo.tsx";
import {DateTimeInput} from "./DateTimeInput.tsx";
import MeasuresEmptyState from "./MeasuresEmptyState.tsx";
import FormSection from "./FormSection.tsx";
import InputContainer from "./InputContainer.tsx";
import AnimatedCard from "./AnimatedCard.tsx";


type MeasuresProps = {
    id: string;
}

export default function Measures(props: MeasuresProps) {
    const {changeEventById} = useStore()

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

    function handleEditMeasure(measure: Measure) {
        setSelectedMeasure(measure);
        setMeasureDialogOpen(true);
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

                    <AnimatedCard>
                        <FormSection key={measure.id}
                                     icon={<Shield color="secondary"/>}
                                     title={measure.locationFrom + (measure.locationTo && ` - ${measure.locationTo}`)}>
                            <Stack direction="column"
                                   spacing={1}
                                   sx={{width: "100%"}}>
                                <Typography sx={{mb: 1, fontStyle: "italic"}}>{measure.locationDetails}</Typography>
                                <Box>
                                    <Accordion variant="outlined">
                                        <AccordionSummary expandIcon={<ExpandMore/>}>
                                            <Typography>Betriebsstelleninformationen</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Stack direction="column" spacing={1} sx={{pb: 2}}>
                                                <Stack direction="column" spacing="1">
                                                    {data.ordnungsrahmen.betriebsstellen.find((e) => e.langname === measure.locationFrom) && (
                                                        <LocationInfo location={measure.locationFrom}/>
                                                    )}
                                                    {data.ordnungsrahmen.betriebsstellen.find((e) => e.langname === measure.locationTo) && (
                                                        <LocationInfo location={measure.locationTo}/>
                                                    )}
                                                </Stack>
                                            </Stack>
                                        </AccordionDetails>
                                    </Accordion>
                                </Box>
                                <MeasureTextBox type={measure.measure}/>


                                <InputContainer>
                                    <Stack direction="column" spacing={1} sx={{pb: 2}}>
                                        <DateTimeInput label="Eingeführt"
                                                       value={measure.from && dayjs(measure.from)}
                                                       handleChange={(value) => handleChangeMeasureFromById(measure.id, value)}/>
                                        {measure.from && event.participants.map((participant) => (
                                            (dayjs(participant.until).unix() > dayjs(measure.from).unix() || !participant.until) &&
                                            <Button key={participant.id}
                                                    variant={"contained"}
                                                    color={!checkParticipantIntoIntroduced(measure, participant) ? "warning" : "success"}
                                                    onClick={() => handleAddParticipantToIntroduced(measure.id, participant)}
                                                    sx={{boxShadow: "none", borderRadius: 2}}
                                            >
                                                {participant.organisation}
                                            </Button>
                                        ))}
                                    </Stack>
                                </InputContainer>
                                <InputContainer>
                                    <Stack direction="column" spacing={1}>
                                        <DateTimeInput label="Aufgehoben"
                                                       value={measure.until && dayjs(measure.until)}
                                                       handleChange={(value) => handleChangeMeasureUntilById(measure.id, value)}/>
                                        {measure.until && event.participants.map((participant) => (
                                            (dayjs(participant.until).unix() > dayjs(measure.until).unix() || !participant.until) &&
                                            <Button key={participant.id}
                                                    color={!checkParticipantIntoLifted(measure, participant) ? "warning" : "success"}
                                                    onClick={() => handleAddParticipantToLifted(measure.id, participant)}
                                                    variant="contained"
                                                    sx={{boxShadow: "none", borderRadius: 2}}
                                            >
                                                {participant.organisation}
                                            </Button>
                                        ))}
                                    </Stack>
                                </InputContainer>
                                <Box sx={{
                                    display: "flex",
                                    justifyContent: "end"
                                }}>
                                    <Button onClick={() => handleEditMeasure(measure)}>Bearbeiten</Button>
                                    <Button onClick={() => handleDeleteMeasureById(measure.id)}>Löschen</Button>
                                </Box>
                            </Stack>
                        </FormSection>
                    </AnimatedCard>

                    // <Card key={measure.id}
                    //       variant="outlined"
                    //       elevation={0}
                    // >
                    //     <CardContent>
                    //         <Stack direction="column"
                    //                spacing={1}
                    //                sx={{width: "100%"}}>
                    //             <Stack direction="column" spacing={1} sx={{pb: 2}}>
                    //                 <Typography
                    //                     variant={"h5"}>{measure.locationFrom} {measure.locationTo && ` - ${measure.locationTo}`}</Typography>
                    //                 <Typography sx={{mb: 1, fontStyle: "italic"}}>{measure.locationDetails}</Typography>
                    //                 <Stack direction="column" spacing="1">
                    //                     {data.ordnungsrahmen.betriebsstellen.find((e) => e.langname === measure.locationFrom) && (
                    //                         <LocationInfo location={measure.locationFrom}/>
                    //                     )}
                    //                     {data.ordnungsrahmen.betriebsstellen.find((e) => e.langname === measure.locationTo) && (
                    //                         <LocationInfo location={measure.locationTo}/>
                    //                     )}
                    //                 </Stack>
                    //                 <MeasureTextBox type={measure.measure}/>
                    //             </Stack>
                    //             <Stack direction="column" spacing={1} sx={{pb: 2}}>
                    //                 {/*<DateTimePicker label={"Eingeführt"}*/}
                    //                 {/*                sx={{width: "100%"}}*/}
                    //                 {/*                value={measure.from && dayjs(measure.from)}*/}
                    //                 {/*                onChange={(value) => handleChangeMeasureFromById(measure.id, dayjs(value))}*/}
                    //                 {/*                slotProps={{*/}
                    //                 {/*                    actionBar: {*/}
                    //                 {/*                        actions: ['today', 'cancel', 'accept'],*/}
                    //                 {/*                    },*/}
                    //                 {/*                }}*/}
                    //                 {/*/>*/}
                    //                 <DateTimeInput label="Eingeführt"
                    //                                value={measure.from && dayjs(measure.from)}
                    //                                handleChange={(value) => handleChangeMeasureFromById(measure.id, value)}/>
                    //                 {measure.from && event.participants.map((participant) => (
                    //                     (dayjs(participant.until).unix() > dayjs(measure.from).unix() || !participant.until) &&
                    //                     <Button key={participant.id}
                    //                             color={!checkParticipantIntoIntroduced(measure, participant) ? "warning" : "success"}
                    //                             onClick={() => handleAddParticipantToIntroduced(measure.id, participant)}
                    //                             variant="contained">{participant.organisation}</Button>
                    //                 ))}
                    //             </Stack>
                    //             <Stack direction="column" spacing={1}>
                    //                 {/*<DateTimePicker label={"Aufgehoben"}*/}
                    //                 {/*                sx={{width: "100%"}}*/}
                    //                 {/*                value={measure.until && dayjs(measure.until)}*/}
                    //                 {/*                onChange={(value) => handleChangeMeasureUntilById(measure.id, dayjs(value))}*/}
                    //                 {/*                slotProps={{*/}
                    //                 {/*                    actionBar: {*/}
                    //                 {/*                        actions: ['today', 'cancel', 'accept'],*/}
                    //                 {/*                    },*/}
                    //                 {/*                }}*/}
                    //                 {/*/>*/}
                    //                 <DateTimeInput label="Aufgehoben"
                    //                                value={measure.until && dayjs(measure.until)}
                    //                                handleChange={(value) => handleChangeMeasureUntilById(measure.id, value)}/>
                    //                 {measure.until && event.participants.map((participant) => (
                    //                     (dayjs(participant.until).unix() > dayjs(measure.until).unix() || !participant.until) &&
                    //                     <Button key={participant.id}
                    //                             color={!checkParticipantIntoLifted(measure, participant) ? "warning" : "success"}
                    //                             onClick={() => handleAddParticipantToLifted(measure.id, participant)}
                    //                             variant="contained">{participant.organisation}</Button>
                    //                 ))}
                    //             </Stack>
                    //         </Stack>
                    //     </CardContent>
                    //     <CardActions>
                    //         <Typography sx={{flexGrow: 1}}/>
                    //         <Button onClick={() => handleEditMeasure(measure)}>Bearbeiten</Button>
                    //         <Button onClick={() => handleDeleteMeasureById(measure.id)}>Löschen</Button>
                    //     </CardActions>
                    // </Card>
                )) : (
                    // <Typography sx={{py: 2}}>Bitte eine Maßnahme hinzufügen.</Typography>
                    <MeasuresEmptyState onAdd={handleMeasureDialogOpen}/>
                )}
                {/*<Button variant="contained"*/}
                {/*        onClick={handleMeasureDialogOpen}>Hinzufügen</Button>*/}
            </Stack>
            {event?.measures && event?.measures.length > 0 && (
                <Fab sx={{position: "fixed", bottom: 80, right: 10}}
                     disabled={event && event.measures.length > 8}
                     color="primary"
                     aria-label="add"
                     size="medium"
                     variant="extended"
                     onClick={handleMeasureDialogOpen}
                >
                    <Add/>
                </Fab>

            )}
            <MeasuresDialog key={selectedMeasure?.id}
                            eventId={props.id}
                            open={measureDialogOpen}
                            handleClose={handleMeasureDialogClose}
                            selectedMeasure={selectedMeasure}/>
        </>

    )
}