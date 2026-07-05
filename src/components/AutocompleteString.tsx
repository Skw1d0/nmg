import {Autocomplete, IconButton, InputAdornment, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import {Clear} from "@mui/icons-material";

type AutocompleteStringProps = {
    label: string;
    value: string;
    setValue: (value: string) => void;
    options: string[],
    max?: number;
}

function AutocompleteString({label, value, setValue, options, max}: AutocompleteStringProps) {
    const safeValue = value ?? "";

    function handleChange(value: string) {
        if (max && value.length > max) return;
        setValue(value);
    }

    return (
        <Autocomplete freeSolo
                      options={options}
                      clearIcon={null}
                      popupIcon={null}
                      inputValue={safeValue}
                      sx={{
                          '&& .MuiAutocomplete-inputRoot': {
                              paddingRight: '0 !important',
                          },
                      }}
                      value={options.find((opt) => opt === safeValue) || value || ""}
                      onChange={(_event, newValue) => {
                          handleChange(newValue || "")
                      }}
                      onInputChange={(_event, newInputValue) => {
                          handleChange(newInputValue);
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

export default AutocompleteString;