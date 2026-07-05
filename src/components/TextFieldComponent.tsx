import {InputAdornment, TextField} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {Clear} from "@mui/icons-material";
import Typography from "@mui/material/Typography";

type TextFieldComponentProps = {
    label: string;
    value: string;
    setValue: (text: string) => void;
    max?: number;
    fullWidth?: boolean;
}

function TextFieldComponent(
    {
        label,
        value,
        setValue,
        max,
        fullWidth = false,
    }: TextFieldComponentProps) {

    function handleChange(value: string) {
        if (max && value.length > max) return;
        setValue(value);
    }

    return (
        <TextField fullWidth={fullWidth}
                   label={label}
                   value={value}
                   onChange={(e) => {
                       handleChange(e.target.value)
                   }}
                   slotProps={{
                       input: {
                           endAdornment:
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
                                       <IconButton size={"small"}
                                                   onClick={() => handleChange("")}
                                                   sx={{
                                                       padding: '2px',
                                                       marginRight: '-2px',
                                                       ml: max ? 1 : 0,
                                                   }}
                                       >
                                           <Clear fontSize={"small"}/>
                                       </IconButton>
                                   )}
                               </InputAdornment>
                       }
                   }}
        />
    )
}

export default TextFieldComponent;