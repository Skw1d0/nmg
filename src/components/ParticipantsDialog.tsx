import {
    Autocomplete,
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Stack,
    TextField
} from "@mui/material";
import {useState} from "react";
import useStore, {type Event, type Participant} from "../hooks/useStore.tsx";
import {v4 as uuid4} from "uuid";
import {Participants, ParticipantsFunctions} from "../tools/data.ts";
import InputContainer from "./InputContainer.tsx";

type ParticipantDialogProps = {
    eventId: string
    open: boolean
    handleClose: () => void
    selectedParticipant?: Participant
}

export default function ParticipantsDialog(props: ParticipantDialogProps) {
    const {changeEventById} = useStore()

    // const [event] = useState<Event>(props.event)
    const event = useStore((state) => state.events.find((e) => e.id === props.eventId))

    const [participantsOrganisation, setParticipantsOrganisation] = useState(props.selectedParticipant ? props.selectedParticipant.organisation : "")
    const [participantsFunction, setParticipantsFunction] = useState(props.selectedParticipant ? props.selectedParticipant.function : "")
    const [participantsName, setParticipantsName] = useState(props.selectedParticipant ? props.selectedParticipant.name : "")
    const [participantsCall, setParticipantsCall] = useState(props.selectedParticipant ? props.selectedParticipant.call : "")

    function handleAddParticipants() {
        if (!event) return

        const newEvent: Event = {
            ...event,
            participants: [
                ...event.participants,
                {
                    id: uuid4(),
                    organisation: participantsOrganisation,
                    function: participantsFunction,
                    name: participantsName,
                    call: participantsCall,
                    from: null,
                    until: null,
                }
            ]
        }

        // props.handleChangeEvent(newEvent);
        changeEventById(event.id, newEvent);
        props.handleClose();
    }

    function handleEditParticipant() {
        if (!event) return

        const newEvent = {
            ...event,
            participants: event.participants.map((participant) => {
                if (participant.id === props.selectedParticipant?.id) {
                    return {
                        ...participant,
                        organisation: participantsOrganisation,
                        name: participantsName,
                        function: participantsFunction,
                        call: participantsCall,
                    }
                }
                return participant
            }),
        }

        changeEventById(event.id, newEvent);
        props.handleClose();
    }

    return (
        <Dialog open={props.open} fullWidth>
            <DialogTitle>Beteiligte hinzufügen</DialogTitle>
            <DialogContent>
                <Stack direction={"column"} spacing={1} sx={{pt: 1}}>
                    <InputContainer>
                        <Autocomplete freeSolo
                                      options={Participants}
                                      value={participantsOrganisation}
                                      onChange={(_event, newValue) => {
                                          setParticipantsOrganisation(newValue || "")
                                      }}
                                      onInputChange={(_event, newInputValue) => {
                                          setParticipantsOrganisation(newInputValue);
                                      }}
                                      renderInput={(params) => <TextField {...params}
                                                                          label="EVU/ EIU, Institut/ Organisation"/>}/>
                    </InputContainer>
                    <InputContainer>
                        <TextField label={"Name"}
                                   value={participantsName}
                                   onChange={(event) => setParticipantsName(event.target.value)}
                        />
                    </InputContainer>
                    <InputContainer>
                        <Autocomplete freeSolo
                                      options={ParticipantsFunctions}
                                      value={participantsFunction}
                                      onChange={(_event, newValue) => {
                                          setParticipantsFunction(newValue || "")
                                      }}
                                      onInputChange={(_event, newInputValue) => {
                                          setParticipantsFunction(newInputValue);
                                      }}
                                      renderInput={(params) => <TextField {...params}
                                                                          label="Funktion"/>}/>
                    </InputContainer>
                    <InputContainer>
                        <TextField label={"Rufnummer"}
                                   value={participantsCall}
                                   onChange={(event) => setParticipantsCall(event.target.value)}/>
                    </InputContainer>
                    <Box sx={{display: "flex", justifyContent: "end", gap: 1, pt: 2}}>
                        {props.selectedParticipant ? (
                            <Button onClick={handleEditParticipant} variant="contained">Speichern</Button>
                        ) : (
                            <Button onClick={handleAddParticipants} variant="contained">Hinzufügen</Button>
                        )}
                        <Button onClick={props.handleClose} variant="outlined">Abbrechen</Button>
                    </Box>
                </Stack>
            </DialogContent>
            {/*<DialogActions>*/}
            {/*    {props.selectedParticipant ? (*/}
            {/*        <Button onClick={handleEditParticipant} variant="contained">Speichern</Button>*/}
            {/*    ) : (*/}
            {/*        <Button onClick={handleAddParticipants} variant="contained">Hinzufügen</Button>*/}
            {/*    )}*/}
            {/*    <Button onClick={props.handleClose} variant="outlined">Abbrechen</Button>*/}
            {/*</DialogActions>*/}
        </Dialog>
    )

}