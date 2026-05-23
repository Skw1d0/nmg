import {Card, CardContent, CardHeader, TextField} from "@mui/material";
import useStore from "../hooks/useStore.tsx";

interface NotesProps {
    id: string;
}

export default function Notes(props: NotesProps) {
    const {changeEventById} = useStore()

    const event = useStore((state) => state.events.find((e) => e.id === props.id))
    if (!event) return null;

    function handleChangeNotes(value: string) {
        if (!event) return null;

        const newEvent = {
            ...event,
            notes: value
        }

        changeEventById(newEvent.id, newEvent);
    }

    return (
        <Card>
            <CardHeader title="Notizen" subheader="Sonstige Dokumentation/ Aufschreibungen"/>
            <CardContent>
                <TextField fullWidth
                           multiline
                           minRows={10}
                           maxRows={10}
                           value={event.notes}
                           onChange={(e) => handleChangeNotes(e.target.value)}
                           label="Notizen"></TextField>

            </CardContent>
        </Card>
    )
}