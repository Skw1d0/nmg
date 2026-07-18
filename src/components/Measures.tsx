import useStore, {type Event, type Measure, type Participant} from "../hooks/useStore.tsx";
import dayjs, {type Dayjs} from "dayjs";
import {
    Accordion, AccordionDetails, AccordionSummary,
    Box,
    Button, Fab,
    Stack,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import {Add, AddModerator, ExpandMore, Shield} from "@mui/icons-material";
import {useState} from "react";
import MeasuresDialog from "./MeasuresDialog.tsx";
import MeasureTextBox from "./MeasureTextBox.tsx";
import data from "../tools/data.ts";
import LocationInfo from "./LocationInfo.tsx";
import {DateTimeInput} from "./DateTimeInput.tsx";
import FormSection from "./FormSection.tsx";
import InputContainer from "./InputContainer.tsx";
import AnimatedCard from "./AnimatedCard.tsx";
import EmptyState from "./EmptyState.tsx";


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

    function handleChangeMeasureFromById(id: string, value: Dayjs | null) {
        if (!event) return

        const valueIsValid = Boolean(value && value.isValid() ? value : null)

        const newEvent: Event = {
            ...event,
            measures: event.measures.map((m) => {
                if (m.id !== id) return m;

                return {
                    ...m,
                    from: value && value.isValid() ? value : null,
                    participantsIntroduced: valueIsValid
                        ? m.participantsIntroduced
                        : []
                }
            })
        }

        changeEventById(event.id, newEvent);
    }

    function handleChangeMeasureUntilById(id: string, value: Dayjs | null) {
        if (!event) return

        const valueIsValid = Boolean(value && value.isValid() ? value : null)

        const newEvent: Event = {
            ...event,
            measures: event.measures.map((m) => {
                if (m.id !== id) return m;
                return {
                    ...m,
                    until: value && value.isValid() ? value : null,
                    participantsLifted: valueIsValid
                        ? m.participantsLifted
                        : []
                }
            })
        }

        changeEventById(event.id, newEvent);
    }

    function participantIsIntroduced(measure: Measure, participant: Participant): boolean {
        if (!event) return false;
        if (!measure) return false;
        if (!participant) return false;

        return measure.participantsIntroduced.some((participantIntroduced) => participantIntroduced.id === participant.id);
    }

    function participantIsLifted(measure: Measure, participant: Participant): boolean {
        if (!event) return false;
        if (!measure) return false;
        if (!participant) return false;

        return measure.participantsLifted.some((participantIntroduced) => participantIntroduced.id === participant.id);
    }

    function handleToggleParticipantToIntroduced(measureId: string, participant: Participant) {
        if (!event) return

        const measure = event.measures.find((m) => m.id === measureId);
        if (!measure) return;

        const isAlreadyIntroduced = measure.participantsIntroduced.some(
            (p) => p.id === participant.id
        );

        const newEvent: Event = {
            ...event,
            measures: event.measures.map((m) => {
                if (m.id !== measureId) return m;
                return {
                    ...m,
                    participantsIntroduced: isAlreadyIntroduced
                        ? m.participantsIntroduced.filter((p) => p.id !== participant.id)
                        : [...m.participantsIntroduced, participant]
                };
            })
        };
        changeEventById(event.id, newEvent);
    }

    function handleToggleParticipantToLifted(measureId: string, participant: Participant) {
        if (!event) return

        const measure = event.measures.find((m) => m.id === measureId);
        if (!measure) return;

        const isAlreadyLifted = measure.participantsLifted.some(
            (p) => p.id === participant.id
        );

        const newEvent: Event = {
            ...event,
            measures: event.measures.map((m) => {
                if (m.id !== measureId) return m;
                return {
                    ...m,
                    participantsLifted: isAlreadyLifted
                        ? m.participantsLifted.filter((p) => p.id !== participant.id)
                        : [...m.participantsLifted, participant]
                };
            })
        };
        changeEventById(event.id, newEvent);
    }

    function participantOverlapsMeasureIntroduced(measure: Measure, participant: Participant): boolean {
        return (
            (!participant.from || !measure.until || dayjs(participant.from).isBefore(measure.until))
            && (!participant.until || dayjs(participant.until).isAfter(measure.from))
        );
    }

    function participantOverlapsMeasureLifted(measure: Measure, participant: Participant): boolean {
        return (
            (!participant.from || dayjs(participant.from).isBefore(measure.until))
            && (!participant.until || dayjs(participant.until).isAfter(measure.until))
        );
    }

    function isAllCorrect(measure: Measure, participants: Participant[]): boolean {
        // 1. from und until müssen ausgefüllt sein
        if (!measure.from || !measure.until) {
            return false;
        }

        // 2. alle Beteiligten, die während der aktiven Maßnahmenzeit vor Ort waren,
        //    müssen verständigt worden sein (Aufgehen der Maßnahme)
        const allIntroduced = participants
            .filter((participant) => participantOverlapsMeasureIntroduced(measure, participant))
            .every((participant) =>
                measure.participantsIntroduced.some((p) => p.id === participant.id)
            );

        if (!allIntroduced) {
            return false;
        }

        // 3. Beteiligte, die beim Aufheben der Maßnahme noch vor Ort waren,
        //    müssen auch über das Aufheben verständigt worden sein
        const allLiftedNotified = participants
            .filter((participant) => participantOverlapsMeasureLifted(measure, participant))
            .every((participant) =>
                measure.participantsLifted.some((p) => p.id === participant.id)
            );

        if (!allLiftedNotified) {
            return false;
        }

        return true;
    }

    return (
        <>
            <Stack direction="column" spacing={1}>
                {event?.measures.length
                    ? event.measures.map((measure) => (
                        <AnimatedCard key={measure.id}>
                            <FormSection key={measure.id}
                                         icon={<Shield/>}
                                // allFilled={Boolean(measure.from && measure.until)}
                                         allFilled={isAllCorrect(measure, event.participants)}
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
                                            {measure.from
                                                && event.participants.map((participant) => (
                                                        participantOverlapsMeasureIntroduced(measure, participant) &&
                                                        <Button key={participant.id}
                                                                variant="contained"
                                                                color={!participantIsIntroduced(measure, participant) ? "error" : "success"}
                                                                onClick={() => handleToggleParticipantToIntroduced(measure.id, participant)}
                                                                sx={{boxShadow: "none", borderRadius: 2}}>
                                                            {participant.organisation}
                                                        </Button>
                                                    )
                                                )
                                            }
                                        </Stack>
                                    </InputContainer>
                                    <InputContainer>
                                        <Stack direction="column" spacing={1}>
                                            <DateTimeInput label="Aufgehoben"
                                                           value={measure.until && dayjs(measure.until)}
                                                           handleChange={(value) => handleChangeMeasureUntilById(measure.id, value)}/>
                                            {measure.until
                                                && event.participants.map((participant) => (
                                                        participantOverlapsMeasureLifted(measure, participant) &&
                                                        <Button key={participant.id}
                                                                color={!participantIsLifted(measure, participant) ? "error" : "success"}
                                                                onClick={() => handleToggleParticipantToLifted(measure.id, participant)}
                                                                variant="contained"
                                                                sx={{boxShadow: "none", borderRadius: 2}}>
                                                            {participant.organisation}
                                                        </Button>
                                                    )
                                                )
                                            }
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


                        // ---START OLD CODE ---

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

                        // --- END OLD COLDE ---
                    ))
                    : (
                        // <Typography sx={{py: 2}}>Bitte eine Maßnahme hinzufügen.</Typography>
                        // <EmptyMeasuresState onAdd={handleMeasureDialogOpen}/>
                        <EmptyState title="Noch keine Maßnahme"
                                    subtitle="Lege die erste Maßnahme für dieses Ereignis an, um sie hier zu sehen."
                                    buttonText="Maßnahme hinzufügen"
                                    icon={<AddModerator sx={{fontSize: 60, color: "primary.main"}}/>}
                                    onClick={handleMeasureDialogOpen}
                        />
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