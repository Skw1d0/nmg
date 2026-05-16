import useStore, {type Event, type MeasureType} from "../stores/useStore.tsx";
import {useState} from "react";
import {
    Autocomplete,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl, InputAdornment,
    InputLabel,
    MenuItem,
    Stack,
    TextField
} from "@mui/material";
import Select, {type SelectChangeEvent} from "@mui/material/Select";
import {v4 as uuid4} from "uuid";
import {Cached, Clear} from "@mui/icons-material";
import data from "../tools/data.ts"
import IconButton from "@mui/material/IconButton";

type MeasuresDialogProps = {
    id: string;
    open: boolean
    handleClose: () => void
}

export default function MeasuresDialog(props: MeasuresDialogProps) {
    const {changeEventById} = useStore()

    const event = useStore((state) => state.events.find((e) => e.id === props.id))
    const [measureLocationFrom, setMeasureLocationFrom] = useState<string | null>(null);
    const [measureLocationTo, setMeasureLocationTo] = useState<string | null>(null);
    const [measureLocationDetails, setMeasureLocationDetails] = useState<string>("");
    const [measureMeasure, setMeasureMeasure] = useState<MeasureType>("1");

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

    function switchFromTo() {
        const tmpMeasureLocationFrom = measureLocationFrom;
        setMeasureLocationFrom(measureLocationTo);
        setMeasureLocationTo(tmpMeasureLocationFrom);
    }

    const options = data.ordnungsrahmen.betriebsstellen;

    return (
        <Dialog open={props.open} fullWidth>
            <DialogTitle>Maßnahme hinzufügen</DialogTitle>
            <DialogContent>
                <Stack direction={"column"} spacing={2} sx={{mt: 1}}>
                    <Autocomplete
                        freeSolo
                        options={options}
                        getOptionLabel={(option) => {
                            if (typeof option === 'string') return option;
                            return option.langname;
                        }}
                        value={options.find((opt) => opt.ds100 === measureLocationFrom) || measureLocationFrom || ""}
                        onChange={(_event, newValue) => {
                            if (typeof newValue === 'string') {
                                setMeasureLocationFrom(newValue);
                            } else if (newValue && newValue.ds100) {
                                setMeasureLocationFrom(newValue.langname);
                            } else {
                                setMeasureLocationFrom(null);
                            }
                        }}
                        onInputChange={(_event, newInputValue) => {
                            setMeasureLocationFrom(newInputValue);
                        }}
                        filterOptions={(options, params) => {
                            const input = params.inputValue.toLowerCase();
                            const filtered = options.filter(
                                (option) =>
                                    option.langname.toLowerCase().includes(input) ||
                                    option.ds100.toLowerCase().includes(input)
                            );
                            return filtered.slice(0, 10);
                        }}
                        renderInput={(params) => (
                            <TextField {...params} label="Im Bahnhof/ von Zmst/ von Zfst"/>
                        )}
                    />
                    <Button onClick={switchFromTo}
                            startIcon={<Cached/>}>Tauschen</Button>
                    <Autocomplete
                        freeSolo
                        options={options}
                        getOptionLabel={(option) => {
                            if (typeof option === 'string') return option;
                            return option.langname;
                        }}
                        value={options.find((opt) => opt.ds100 === measureLocationTo) || measureLocationTo || ""}
                        onChange={(_event, newValue) => {
                            if (typeof newValue === 'string') {
                                setMeasureLocationTo(newValue);
                            } else if (newValue && newValue.ds100) {
                                setMeasureLocationTo(newValue.langname);
                            } else {
                                setMeasureLocationTo(null);
                            }
                        }}
                        onInputChange={(_event, newInputValue) => {
                            setMeasureLocationTo(newInputValue);
                        }}
                        filterOptions={(options, params) => {
                            const input = params.inputValue.toLowerCase();
                            const filtered = options.filter(
                                (option) =>
                                    option.langname.toLowerCase().includes(input) ||
                                    option.ds100.toLowerCase().includes(input)
                            );
                            return filtered.slice(0, 10);
                        }}
                        renderInput={(params) => (
                            <TextField {...params} label="Bahnhofsgleis(e)/ bis Zmst/ bis Zfst"/>
                        )}
                    />
                    <TextField label={"bei Bedarf von km bis km/ in km/ von Sig bis Sig/ an Sig"}
                               value={measureLocationDetails}
                               onChange={(e) => {
                                   setMeasureLocationDetails(e.target.value)
                               }}
                               slotProps={{
                                   input: {
                                       endAdornment: measureLocationDetails && (
                                           <InputAdornment position={"end"}>
                                               <IconButton size={"small"}
                                                           onClick={() => setMeasureLocationDetails("")}
                                                           sx={{
                                                               padding: '2px', // Autocomplete-Standard
                                                               marginRight: '-2px',
                                                               visibility: 'hidden',
                                                               '.MuiOutlinedInput-root:hover &': {
                                                                   visibility: 'visible',
                                                               },
                                                               // visibility: measureLocationDetails ? 'visible' : 'hidden',
                                                               // '&:hover': {backgroundColor: 'rgba(0, 0, 0, 0.04)'}
                                                           }}
                                               >
                                                   <Clear fontSize={"small"}/>
                                               </IconButton>
                                           </InputAdornment>
                                       )
                                   }
                               }}
                    />
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Maßnahme</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={measureMeasure}
                            onChange={handleChangeMeasure}
                            label="Maßnahme"
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
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={handleAddMeasure}>Hinzufügen</Button>
                <Button variant="outlined" onClick={props.handleClose}>Abbrechen</Button>
            </DialogActions>
        </Dialog>
    )
}