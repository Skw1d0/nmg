import {Box, Typography} from "@mui/material";
import type {MeasureType} from "../hooks/useStore.tsx";
import {Bolt, FrontHand, Hearing, HighlightOff, Speed, Visibility} from "@mui/icons-material";

interface MeasureTextBoxProps {
    type: MeasureType
}

export default function MeasureTextBox(props: MeasureTextBoxProps) {
    let color = ""
    if (props.type === "1") color = "#c50000"
    if (props.type === "2") color = "#2f2fec"
    if (props.type === "A") color = "#c50000"
    if (props.type === "B") color = "#634400"
    if (props.type === "C") color = "#634400"
    if (props.type === "D") color = "#634400"
    if (props.type === "E") color = "#991ba3"

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "row",
            gap: 1,
            width: "100%",
            borderRadius: 1,
            // borderStyle: "solid",
            color: color,
            backgroundColor: `color-mix(in srgb, ${color}, white 85%)`,
            p: 1

        }}>
            {(props.type === "1") && (<HighlightOff sx={{color: color}}/>)}
            {(props.type === "2") && (<Bolt sx={{color: color}}/>)}
            {(props.type === "A") && (<HighlightOff sx={{color: color}}/>)}
            {(props.type === "B") && (<Speed sx={{color: color}}/>)}
            {(props.type === "C") && (<Visibility sx={{color: color}}/>)}
            {(props.type === "D") && (<Hearing sx={{color: color}}/>)}
            {(props.type === "E") && (<FrontHand sx={{color: color}}/>)}

            {props.type === "1" && (
                <Typography sx={{color: color}}>Gleis(e) gesperrt/ Fahrten eingestellt</Typography>)}
            {props.type === "2" && (
                <Typography sx={{color: color}}>Oberleitung ausgeschalten und bahngeerdet</Typography>
            )}
            {props.type === "A" && (
                <Typography sx={{color: color}}>Gleis(2) gesperrt/ Fahrten eingeschränkt zugelassen</Typography>
            )}
            {props.type === "B" && (
                <Typography sx={{color: color}}>Geschwindigkeit max. 5 km/h</Typography>
            )}
            {props.type === "C" && (
                <Typography sx={{color: color}}>Fahren auf Sicht</Typography>
            )}
            {props.type === "D" && (
                <Typography sx={{color: color}}>Signal Zp1</Typography>
            )}
            {props.type === "E" && (
                <Typography sx={{color: color}}>Halt am festgelegten Platz, Weiterfahrt nach Anordnung Nmg</Typography>
            )}
        </Box>
    )
}