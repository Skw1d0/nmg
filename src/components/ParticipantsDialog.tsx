import {Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField} from "@mui/material";
import {useState} from "react";
import useStore, {type Event} from "../stores/useStore.tsx";
import {v4 as uuidv4} from "uuid";
import {Participants} from "../tools/data.ts";

type ParticipantDialogProps = {
    // event: Event
    id: string;
    open: boolean
    handleClose: () => void
    // handleChangeEvent: (e: Event) => void;
}

export default function ParticipantsDialog(props: ParticipantDialogProps) {
    const {changeEventById} = useStore()

    // const [event] = useState<Event>(props.event)
    const event = useStore((state) => state.events.find((e) => e.id === props.id))
    const [participantsOrganisation, setParticipantsOrganisation] = useState("");
    const [participantsFunction, setParticipantsFunction] = useState("");
    const [participantsName, setParticipantsName] = useState("");
    const [participantsCall, setParticipantsCall] = useState("");

    function handleAddParticipants() {
        if (!event) return

        const newEvent: Event = {
            ...event,
            participants: [
                ...event.participants,
                {
                    id: uuidv4(),
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

    return (
        <Dialog open={props.open} fullWidth>
            <DialogTitle>Beteiligte hinzufügen</DialogTitle>
            <DialogContent>
                <Stack direction={"column"} spacing={1} sx={{pt: 1}}>
                    {/*<TextField label={"Organsiation"}*/}
                    {/*           value={participantsOrganisation}*/}
                    {/*           onChange={(event) => setParticipantsOrganisation(event.target.value)}*/}
                    {/*/>*/}
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
                                                                      label="Beschreibung des Ereignisses"/>}/>
                    <TextField label={"Name"}
                               value={participantsName}
                               onChange={(event) => setParticipantsName(event.target.value)}
                    />
                    <TextField label={"Funktion"}
                               value={participantsFunction}
                               onChange={(event) => setParticipantsFunction(event.target.value)}
                    />
                    <TextField label={"Rufnummer"}
                               value={participantsCall}
                               onChange={(event) => setParticipantsCall(event.target.value)}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleAddParticipants} variant="contained">Hinzufügen</Button>
                <Button onClick={props.handleClose} variant="outlined">Abbrechen</Button>
            </DialogActions>
        </Dialog>
    )

}