import useStore, {type Event, type Measure, type MeasureType} from "../hooks/useStore.tsx";
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

    const options = data.ordnungsrahmen.betriebsstellen;

    return (
        <Dialog open={props.open} fullWidth>
            <DialogTitle>Maßnahme hinzufügen</DialogTitle>
            <DialogContent>
                <Stack direction={"column"} spacing={2} sx={{mt: 1}}>
                    {/*<Autocomplete*/}
                    {/*    freeSolo*/}
                    {/*    options={options}*/}
                    {/*    getOptionLabel={(option) => {*/}
                    {/*        if (typeof option === 'string') return option;*/}
                    {/*        return option.langname;*/}
                    {/*    }}*/}
                    {/*    value={options.find((opt) => opt.ds100 === measureLocationFrom) || measureLocationFrom || ""}*/}
                    {/*    onChange={(_event, newValue) => {*/}
                    {/*        if (typeof newValue === 'string') {*/}
                    {/*            setMeasureLocationFrom(newValue);*/}
                    {/*        } else if (newValue && newValue.ds100) {*/}
                    {/*            setMeasureLocationFrom(newValue.langname);*/}
                    {/*        } else {*/}
                    {/*            setMeasureLocationFrom(null);*/}
                    {/*        }*/}
                    {/*    }}*/}
                    {/*    onInputChange={(_event, newInputValue) => {*/}
                    {/*        setMeasureLocationFrom(newInputValue);*/}
                    {/*    }}*/}
                    {/*    filterOptions={(options, params) => {*/}
                    {/*        const input = params.inputValue.toLowerCase();*/}
                    {/*        const filtered = options.filter(*/}
                    {/*            (option) =>*/}
                    {/*                option.langname.toLowerCase().includes(input) ||*/}
                    {/*                option.ds100.toLowerCase().includes(input)*/}
                    {/*        );*/}
                    {/*        return filtered.slice(0, 10);*/}
                    {/*    }}*/}
                    {/*    renderInput={(params) => (*/}
                    {/*        <TextField {...params} label="Im Bahnhof/ von Zmst/ von Zfst"/>*/}
                    {/*    )}*/}
                    {/*/>*/}
                    <Autocomplete
                        freeSolo
                        options={options}
                        getOptionLabel={(option) => {
                            if (typeof option === 'string') return option;
                            return `${option.ds100} - ${option.langname}`;
                        }}
                        value={options.find((opt) => opt.ds100 === measureLocationFrom) || measureLocationFrom || ""}
                        onChange={(_event, newValue) => {
                            if (typeof newValue === 'string') {
                                setMeasureLocationFrom(newValue);
                            } else if (newValue && newValue.ds100) {
                                setMeasureLocationFrom(newValue.langname);
                            } else {
                                setMeasureLocationFrom("");
                            }
                        }}
                        onInputChange={(_event, newInputValue) => {
                            setMeasureLocationFrom(newInputValue);
                        }}
                        filterOptions={(options, params) => {
                            // Bereinigt die Eingabe von Leerzeichen und Bindestrichen am Ende
                            const input = params.inputValue.trim().toLowerCase().replace(/[- ]+$/, "");
                            if (!input) return options.slice(0, 10);

                            return options
                                .filter(
                                    (option) =>
                                        option.ds100.toLowerCase().includes(input) ||
                                        option.langname.toLowerCase().includes(input)
                                )
                                .sort((a, b) => {
                                    const aDs = a.ds100.toLowerCase();
                                    const bDs = b.ds100.toLowerCase();

                                    // 1. Priorität: Exakter DS100-Treffer (z.B. "mh" getippt für "MH")
                                    if (aDs === input && bDs !== input) return -1;
                                    if (bDs === input && aDs !== input) return 1;

                                    // 2. Priorität: DS100 beginnt mit der Eingabe (z.B. "m" oder "mh")
                                    const aStartsDs = aDs.startsWith(input);
                                    const bStartsDs = bDs.startsWith(input);
                                    if (aStartsDs && !bStartsDs) return -1;
                                    if (!aStartsDs && bStartsDs) return 1;

                                    // 3. Priorität: Irgendein anderer DS100-Treffer
                                    const aMatchDs = aDs.includes(input);
                                    const bMatchDs = bDs.includes(input);
                                    if (aMatchDs && !bMatchDs) return -1;
                                    if (!aMatchDs && bMatchDs) return 1;

                                    return 0;
                                })
                                .slice(0, 10);
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
                        // getOptionLabel={(option) => {
                        //     if (typeof option === 'string') return option;
                        //     return option.langname;
                        // }}
                        getOptionLabel={(option) => {
                            if (typeof option === 'string') return option;
                            return `${option.ds100} - ${option.langname}`;
                        }}
                        value={options.find((opt) => opt.ds100 === measureLocationTo) || measureLocationTo || ""}
                        onChange={(_event, newValue) => {
                            if (typeof newValue === 'string') {
                                setMeasureLocationTo(newValue);
                            } else if (newValue && newValue.ds100) {
                                setMeasureLocationTo(newValue.langname);
                            } else {
                                setMeasureLocationTo("");
                            }
                        }}
                        onInputChange={(_event, newInputValue) => {
                            setMeasureLocationTo(newInputValue);
                        }}
                        // filterOptions={(options, params) => {
                        //     const input = params.inputValue.toLowerCase();
                        //     const filtered = options.filter(
                        //         (option) =>
                        //             option.langname.toLowerCase().includes(input) ||
                        //             option.ds100.toLowerCase().includes(input)
                        //     );
                        //     return filtered.slice(0, 10);
                        // }}
                        filterOptions={(options, params) => {
                            // Bereinigt die Eingabe von Leerzeichen und Bindestrichen am Ende
                            const input = params.inputValue.trim().toLowerCase().replace(/[- ]+$/, "");
                            if (!input) return options.slice(0, 10);

                            return options
                                .filter(
                                    (option) =>
                                        option.ds100.toLowerCase().includes(input) ||
                                        option.langname.toLowerCase().includes(input)
                                )
                                .sort((a, b) => {
                                    const aDs = a.ds100.toLowerCase();
                                    const bDs = b.ds100.toLowerCase();

                                    // 1. Priorität: Exakter DS100-Treffer (z.B. "mh" getippt für "MH")
                                    if (aDs === input && bDs !== input) return -1;
                                    if (bDs === input && aDs !== input) return 1;

                                    // 2. Priorität: DS100 beginnt mit der Eingabe (z.B. "m" oder "mh")
                                    const aStartsDs = aDs.startsWith(input);
                                    const bStartsDs = bDs.startsWith(input);
                                    if (aStartsDs && !bStartsDs) return -1;
                                    if (!aStartsDs && bStartsDs) return 1;

                                    // 3. Priorität: Irgendein anderer DS100-Treffer
                                    const aMatchDs = aDs.includes(input);
                                    const bMatchDs = bDs.includes(input);
                                    if (aMatchDs && !bMatchDs) return -1;
                                    if (!aMatchDs && bMatchDs) return 1;

                                    return 0;
                                })
                                .slice(0, 10);
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
                {!props.selectedMeasure ? (
                    <Button variant="contained" onClick={handleAddMeasure}>Hinzufügen</Button>
                ) : (
                    <Button variant="contained" onClick={handleEditMeasure}>Speichern</Button>
                )}
                <Button variant="outlined" onClick={props.handleClose}>Abbrechen</Button>
            </DialogActions>
        </Dialog>
    )
}