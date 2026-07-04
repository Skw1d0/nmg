import {
    Box,
    Button,
    Dialog, DialogContent,
    DialogTitle,
    Divider,
    Fab, FormControl,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {useState} from "react";
import {Add, FormatListBulleted, Notes} from "@mui/icons-material";
import useStore, {type Event} from "../hooks/useStore.tsx";
import {v4 as uuid4} from "uuid";
import dayjs from "dayjs";
import FormSection from "./FormSection.tsx";
import InputContainer from "./InputContainer.tsx";
import AnimatedCard from "./AnimatedCard.tsx";

type MyNotesProps = {
    id: string
}

export default function MyNotes(props: MyNotesProps) {
    const {changeEventById} = useStore()

    const [open, setOpen] = useState(false);
    const [note, setNote] = useState("")
    const [isEdit, setIsEdit] = useState<string>("")

    const event = useStore((state) => state.events.find((e) => e.id === props.id))
    if (!event) return null;

    function handleOpenDialog() {
        setNote("");
        setIsEdit("");
        setOpen(true);
    }

    function handleAddNote() {
        if (!event) return null;

        const newEvent: Event = {
            ...event,
            myNotes: [
                ...event.myNotes || [],
                {
                    id: uuid4(),
                    date: dayjs(),
                    note: note
                }]
        }

        changeEventById(event.id, newEvent)
        setOpen(false);
    }

    function handleDeleteNoteById(id: string) {
        if (!id) return null;
        if (!event) return null;

        const newEvent: Event = {
            ...event,
            myNotes: event.myNotes.filter((note) => note.id !== id)
        }

        changeEventById(event.id, newEvent)
    }

    function handleChangeNoteById(id: string) {
        if (!id) return null;
        if (!event) return null;

        const newEvent: Event = {
            ...event,
            myNotes: event.myNotes.map((myNote) => {
                if (myNote.id !== id) return myNote;
                return {
                    ...myNote,
                    note: note
                }
            })
        }

        changeEventById(event.id, newEvent)
        setOpen(false);
    }

    function handleEditNoteById(id: string) {
        if (!id) return null;
        if (!event) return null;

        const myNote = event.myNotes.find((note) => note.id === id);
        if (!myNote) return null;

        setNote(myNote.note)
        setOpen(true);
        setIsEdit(id);
    }

    function handleChangeNotes(value: string) {
        if (!event) return null;
        const lines = value.split('\n');

        if (lines.length > 5) return
        const isEveryLineValid = lines.every(line => line.length <= 75);
        if (!isEveryLineValid) return

        const newEvent = {
            ...event,
            notes: value
        }

        changeEventById(newEvent.id, newEvent);
    }

    return (
        <>
            <Stack direction="column" spacing={1}>
                <AnimatedCard>
                    <FormSection icon={<Notes color="secondary"/>} title={"Notizen für die Schutzmaßnahme"}>
                        <InputContainer>
                            <FormControl fullWidth>
                                <TextField fullWidth
                                           multiline
                                           maxRows={5}
                                           value={event.notes}
                                           onChange={(e) => handleChangeNotes(e.target.value)}
                                           label="Notizen"></TextField>
                            </FormControl>
                        </InputContainer>
                    </FormSection>
                </AnimatedCard>
                {/*<Card>*/}
                {/*    <CardHeader title="Notizen" subheader="Notizen für die Schutzmaßnahme"/>*/}
                {/*    <CardContent>*/}
                {/*        <FormControl fullWidth>*/}
                {/*            <TextField fullWidth*/}
                {/*                       variant="filled"*/}
                {/*                       multiline*/}
                {/*                       rows={5}*/}
                {/*                       value={event.notes}*/}
                {/*                       onChange={(e) => handleChangeNotes(e.target.value)}*/}
                {/*                       label="Notizen"></TextField>*/}
                {/*        </FormControl>*/}
                {/*    </CardContent>*/}
                {/*</Card>*/}


                {event.myNotes?.map((myNote, index) => (
                    <AnimatedCard>
                        <FormSection icon={<FormatListBulleted color="secondary"/>}
                                     title="Persönliche Notizen"
                                     hideTitle={true}
                                     badge={`${(index + 1).toString()} / ${(event.myNotes.length)}`}>
                            <Stack direction="column" spacing={1}>
                                <Typography color="secondary"
                                            sx={{fontSize: 13}}>{dayjs(myNote.date).format("DD.MM.YYYY HH.mm")}</Typography>
                                <Divider/>
                                {myNote.note.split("\n").map((zeile) => (
                                    <Typography>{zeile}</Typography>
                                ))}
                            </Stack>
                            <Box sx={{display: "flex", justifyContent: "end"}}>
                                <Button onClick={() => handleEditNoteById(myNote.id)}>Bearbeiten</Button>
                                <Button onClick={() => handleDeleteNoteById(myNote.id)}>Löschen</Button>
                            </Box>

                        </FormSection>
                    </AnimatedCard>
                    // <Card key={myNote.id}>
                    //     <CardContent>
                    //         <Stack direction="column" spacing={1}>
                    //             <Typography
                    //                 sx={{fontSize: 13}}>{dayjs(myNote.date).format("DD.MM.YYYY HH.mm")}</Typography>
                    //             <Divider/>
                    //             <Stack direction="column" spacing={0}>
                    //                 {myNote.note.split("\n").map((zeile) => (
                    //                         <Typography>{zeile}</Typography>
                    //                     )
                    //                 )}
                    //             </Stack>
                    //         </Stack>
                    //     </CardContent>
                    //     <CardActions sx={{justifyContent: "end"}}>
                    //         <Button onClick={() => handleEditNoteById(myNote.id)}>Bearbeiten</Button>
                    //         <Button onClick={() => handleDeleteNoteById(myNote.id)}>Löschen</Button>
                    //     </CardActions>
                    // </Card>
                ))}
            </Stack>

            <Fab sx={{position: "fixed", bottom: 80, right: 10}}
                 color="primary"
                 aria-label="add"
                 size="medium"
                 variant="extended"
                 onClick={() => handleOpenDialog()}
            >
                <Add/>
            </Fab>
            <Dialog fullWidth open={open}>
                <DialogTitle>Eigene Notiz hinzufügen</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth sx={{mt: 1}}>
                        <InputContainer>
                            <TextField multiline
                                       maxRows={3}
                                // minRows={3}
                                       value={note}
                                       onChange={(e) => setNote(e.target.value)}
                                       label="Eigene Notiz"/>
                        </InputContainer>
                    </FormControl>
                    <Box sx={{display: "flex", justifyContent: "end", pt: 2, gap: 1}}>
                        {isEdit ? (
                            <Button variant="contained" onClick={() => handleChangeNoteById(isEdit)}>Speichern</Button>
                        ) : (
                            <Button variant="contained" onClick={() => handleAddNote()}>Hinzufügen</Button>
                        )}
                        <Button variant="outlined" onClick={() => setOpen(false)}>Abbrechen</Button>
                    </Box>
                </DialogContent>
                {/*<DialogActions>*/}
                {/*    {isEdit ? (*/}
                {/*        <Button variant="contained" onClick={() => handleChangeNoteById(isEdit)}>Speichern</Button>*/}
                {/*    ) : (*/}
                {/*        <Button variant="contained" onClick={() => handleAddNote()}>Hinzufügen</Button>*/}
                {/*    )}*/}
                {/*    <Button variant="outlined" onClick={() => setOpen(false)}>Abbrechen</Button>*/}
                {/*</DialogActions>*/}
            </Dialog>
        </>
    )
}