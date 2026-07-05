import {Autocomplete, IconButton, InputAdornment, TextField} from "@mui/material";
import data from "../tools/data.ts";
import {Clear} from "@mui/icons-material";
import Typography from "@mui/material/Typography";

type AutocompleteBstProps = {
    label: string;
    value: string
    setValue: (value: string) => void;
    max?: number;
}

function AutocompleteBst({label, value, setValue, max}: AutocompleteBstProps) {
    const options = data.ordnungsrahmen.betriebsstellen;

    function handleChange(value: string) {
        if (max && value.length > max) return;
        setValue(value);
    }

    return (
        <Autocomplete
            freeSolo
            options={options}
            clearIcon={null}
            popupIcon={null}
            sx={{
                // '&.MuiAutocomplete-hasPopupIcon.MuiAutocomplete-hasClearIcon .MuiAutocomplete-inputRoot, &.MuiAutocomplete-hasPopupIcon .MuiAutocomplete-inputRoot, &.MuiAutocomplete-hasClearIcon .MuiAutocomplete-inputRoot': {
                //     paddingRight: 0,
                // },
                '&& .MuiAutocomplete-inputRoot': {
                    paddingRight: '0 !important',
                },
            }}
            getOptionLabel={(option) => {
                if (typeof option === 'string') return option;
                return `${option.ds100} - ${option.langname}`;
            }}
            inputValue={value}
            value={options.find((opt) => opt.ds100 === value) || value || ""}
            onChange={(_event, newValue) => {
                if (typeof newValue === 'string') {
                    handleChange(newValue);
                } else if (newValue && newValue.ds100) {
                    handleChange(newValue.langname);
                } else {
                    setValue("");
                }
            }}
            onInputChange={(_event, newInputValue) => {
                handleChange(newInputValue);
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
                <TextField {...params}
                           label={label}
                           slotProps={{
                               ...params.slotProps,
                               input: {
                                   ...params.slotProps.input,
                                   endAdornment: (
                                       <>
                                           <InputAdornment position={"end"}>
                                               {max && (
                                                   <Typography
                                                       variant="caption"
                                                       sx={{color: 'text.secondary', whiteSpace: 'nowrap'}}
                                                   >
                                                       {value.length} / {max}
                                                   </Typography>
                                               )}
                                               {value && (
                                                   <IconButton
                                                       size="small"
                                                       onMouseDown={(e) => e.preventDefault()}
                                                       onClick={() => handleChange("")}
                                                       sx={{
                                                           // padding: '2px',
                                                           // marginRight: '-2px',
                                                           ml: max ? 1 : 0,
                                                       }}
                                                   >
                                                       <Clear fontSize="small"/>
                                                   </IconButton>
                                               )}
                                           </InputAdornment>
                                           {params.slotProps.input?.endAdornment}
                                       </>

                                   )
                               }
                           }}
                />
            )}
        />
    )
}

export default AutocompleteBst