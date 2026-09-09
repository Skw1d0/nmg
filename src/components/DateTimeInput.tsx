import {DateTimePicker} from "@mui/x-date-pickers";
import dayjs, {type Dayjs} from "dayjs";
import {useState} from "react";
import {IconButton, InputAdornment, useMediaQuery, useTheme} from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';

type DateTimePickerProps = {
    label: string;
    value: Dayjs | null;
    handleChange: (value: Dayjs) => void
    format?: string;
}

export function DateTimeInput({label, value, handleChange, format}: DateTimePickerProps) {
    const theme = useTheme();
    const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));

    const [open, setOpen] = useState(false);
    const safeValue = value && dayjs.isDayjs(value) && value.isValid() ? value : null;

    return (
        <DateTimePicker label={label}
                        sx={{width: "100%"}}
                        open={open}
                        value={safeValue}
                        onChange={(value) => handleChange(dayjs(value))}
                        onOpen={() => setOpen(true)}
                        onClose={() => setOpen(false)}
                        format={
                            format
                                ? format
                                : isSmUp ? "DD.MM.YYYY HH:mm" : "HH:mm"
                        }
                        timeSteps={{minutes: 1}}
                        closeOnSelect
                        slotProps={{
                            actionBar: {
                                actions: ['clear', 'cancel', 'accept'],
                            },
                            textField: {
                                slotProps: {
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    // onClick={() => handleChange(dayjs())}
                                                    sx={{m: -1}}
                                                    onMouseDown={(e) => e.preventDefault()}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleChange(dayjs());
                                                    }}
                                                >
                                                    <AccessTimeIcon fontSize="medium"/>
                                                </IconButton>
                                                <IconButton onClick={() => setOpen(true)}>
                                                    <EventIcon fontSize="medium"/>
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    },
                                },
                            },
                        }}
        />
    )
}