import * as React from "react";
import {FormControl} from "@mui/material";

type FormSectionInputProps = {
    children: React.ReactNode,
}

function InputContainer({children}: FormSectionInputProps) {
    return (
        <FormControl sx={{
            backgroundColor: "background.default",
            padding: 2,
            borderRadius: 2,
        }}>
            {/*<FormLabel sx={{fontSize: 12}}>{label}</FormLabel>*/}
            {children}
        </FormControl>
    )
}

export default InputContainer;