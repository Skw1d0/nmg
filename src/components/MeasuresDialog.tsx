import useStore, {type Event, type Measure, type MeasureType} from "../hooks/useStore.tsx";
import {useState} from "react";
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Stack,

} from "@mui/material";
import Select, {type SelectChangeEvent} from "@mui/material/Select";
import {v4 as uuid4} from "uuid";
import {Cached} from "@mui/icons-material";
import InputContainer from "./InputContainer.tsx";
import AutocompleteBst from "./AutocompleteBst.tsx";
import TextFieldComponent from "./TextFieldComponent.tsx";


type MeasuresDialogProps = {
    eventId: string;
    open: boolean
    handleClose: () => void
    selectedMeasure?: Measure
}

export default function MeasuresDialog(props: MeasuresDialogProps) {
    const {changeEventById} = useStore()

    const event = useStore((state) => state.events.find((e) => e.id === props.eventId))

    const [measureLocationFrom, setMeasureLocationFrom] = useState<string>(props.selectedMeasure ? props.selectedMeasure.locationFrom : "")
    const [measureLocationTo, setMeasureLocationTo] = useState<string>(props.selectedMeasure ? props.selectedMeasure.locationTo : "")
    const [measureLocationDetails, setMeasureLocationDetails] = useState<string>(props.selectedMeasure ? props.selectedMeasure.locationDetails : "")
    const [measureMeasure, setMeasureMeasure] = useState<MeasureType>(props.selectedMeasure ? props.selectedMeasure.measure : "1")

    function handleChangeMeasure(event: SelectChangeEvent) {
        setMeasureMeasure(event.target.value as MeasureType)
    }

    function handleAddMeasure() {
        if (!event) return

        const newEvent: Event = {
            ...event,
            measures: [
                ...(event.measures || []),
                {
                    id: uuid4(),
                    from: null,
                    until: null,
                    locationTo: measureLocationTo || "",
                    locationFrom: measureLocationFrom || "",
                    locationDetails: measureLocationDetails,
                    measure: measureMeasure,
                    participantsIntroduced: [],
                    participantsLifted: []
                }
            ]
        }

        changeEventById(event.id, newEvent);
        props.handleClose();
    }

    function handleEditMeasure() {
        if (!event) return

        const newEvent: Event = {
            ...event,
            measures: event.measures.map((measure) => {
                if (measure.id === props.selectedMeasure?.id) {
                    return {
                        ...measure,
                        locationFrom: measureLocationFrom,
                        locationTo: measureLocationTo,
                        locationDetails: measureLocationDetails,
                        measure: measureMeasure,
                    }
                }
                return measure
            })
        }

        changeEventById(event.id, newEvent);
        props.handleClose();
    }

    function switchFromTo() {
        const tmpMeasureLocationFrom = measureLocationFrom;
        setMeasureLocationFrom(measureLocationTo);
        setMeasureLocationTo(tmpMeasureLocationFrom);
    }

    return (
        <Dialog open={props.open} fullWidth>
            <DialogTitle>Maßnahme hinzufügen</DialogTitle>
            <DialogContent>
                <Stack direction={"column"} spacing={1} sx={{mt: 1}}>
                    <InputContainer>
                        <AutocompleteBst label="Im Bahnhof/ von Zmst/ von Zfst"
                                         value={measureLocationFrom}
                                         setValue={setMeasureLocationFrom}
                                         max={20}
                        />
                    </InputContainer>
                    <Button onClick={switchFromTo}
                            startIcon={<Cached/>}>Tauschen</Button>
                    <InputContainer>
                        <AutocompleteBst label="Bahnhofsgleis(e)/ bis Zmst/ bis Zfst"
                                         value={measureLocationTo}
                                         setValue={setMeasureLocationTo}
                                         max={20}
                        />
                    </InputContainer>
                    <InputContainer>
                        <TextFieldComponent label="bei Bedarf von km bis km/ in km/ von Sig bis Sig/ an Sig"
                                            value={measureLocationDetails}
                                            setValue={setMeasureLocationDetails}
                                            max={20}
                        />
                        {/*<TextField label={"bei Bedarf von km bis km/ in km/ von Sig bis Sig/ an Sig"}*/}
                        {/*           value={measureLocationDetails}*/}
                        {/*           onChange={(e) => {*/}
                        {/*               setMeasureLocationDetails(e.target.value)*/}
                        {/*           }}*/}
                        {/*           slotProps={{*/}
                        {/*               input: {*/}
                        {/*                   endAdornment: measureLocationDetails && (*/}
                        {/*                       <InputAdornment position={"end"}>*/}
                        {/*                           <IconButton size={"small"}*/}
                        {/*                                       onClick={() => setMeasureLocationDetails("")}*/}
                        {/*                                       sx={{*/}
                        {/*                                           padding: '2px',*/}
                        {/*                                           marginRight: '-2px',*/}
                        {/*                                           // visibility: 'hidden',*/}
                        {/*                                           // '.MuiInput-root:hover &': {*/}
                        {/*                                           //     visibility: 'visible',*/}
                        {/*                                           // },*/}
                        {/*                                           // visibility: measureLocationDetails ? 'visible' : 'hidden',*/}
                        {/*                                           // '&:hover': {backgroundColor: 'rgba(0, 0, 0, 0.04)'}*/}
                        {/*                                       }}*/}
                        {/*                           >*/}
                        {/*                               <Clear fontSize={"small"}/>*/}
                        {/*                           </IconButton>*/}
                        {/*                       </InputAdornment>*/}
                        {/*                   )*/}
                        {/*               }*/}
                        {/*           }}*/}
                        {/*/>*/}
                    </InputContainer>
                    <InputContainer>
                        <FormControl fullWidth>
                            <InputLabel id="measures-select-label">Maßnahme</InputLabel>
                            <Select
                                label="Maßnahme"
                                labelId="measures-select-label"
                                id="measures-select"
                                value={measureMeasure}
                                onChange={handleChangeMeasure}
                            >
                                <MenuItem value={"1"}>Gleis(e) gesperrt/ Fahrten eingestellt</MenuItem>
                                <MenuItem value={"2"}>Oberleitung ausgeschalten und bahngeerdet</MenuItem>
                                <MenuItem value={"A"}>Gleis(e) gesperrt/ Fahrten eingeschränkt zugelassen</MenuItem>
                                <MenuItem value={"B"}>Geschwindigkeit max. 5 km/h</MenuItem>
                                <MenuItem value={"C"}>Fahren auf Sicht</MenuItem>
                                <MenuItem value={"D"}>Signal Zp1</MenuItem>
                                <MenuItem value={"E"}>Halt am festgelegten Platz, Weiterfahrt nach Aufforderung
                                    Nmg</MenuItem>
                            </Select>
                        </FormControl>
                    </InputContainer>
                    <Box sx={{display: "flex", justifyContent: "end", gap: 1, pt: 2}}>
                        {!props.selectedMeasure ? (
                            <Button variant="contained" onClick={handleAddMeasure}>Hinzufügen</Button>
                        ) : (
                            <Button variant="contained" onClick={handleEditMeasure}>Speichern</Button>
                        )}
                        <Button variant="outlined" onClick={props.handleClose}>Abbrechen</Button>
                    </Box>
                </Stack>

            </DialogContent>
            {/*<DialogActions>*/}
            {/*    {!props.selectedMeasure ? (*/}
            {/*        <Button variant="contained" onClick={handleAddMeasure}>Hinzufügen</Button>*/}
            {/*    ) : (*/}
            {/*        <Button variant="contained" onClick={handleEditMeasure}>Speichern</Button>*/}
            {/*    )}*/}
            {/*    <Button variant="outlined" onClick={props.handleClose}>Abbrechen</Button>*/}
            {/*</DialogActions>*/}
        </Dialog>
    )
}