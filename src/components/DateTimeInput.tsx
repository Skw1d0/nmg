import {DateTimePicker} from "@mui/x-date-pickers";
import dayjs, {type Dayjs} from "dayjs";
import {useState} from "react";
import {IconButton, InputAdornment} from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';

type DateTimePickerProps = {
    label: string;
    value: Dayjs | null;
    handleChange: (value: Dayjs) => void
}

export function DateTimeInput({label, value, handleChange}: DateTimePickerProps) {
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
                        slotProps={{
                            actionBar: {
                                actions: ['clear', 'cancel', 'accept'],
                            },
                            textField: {
                                variant: "filled",
                                slotProps: {
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    // onClick={() => handleChange(dayjs())}
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