import {Box, Typography, Button} from "@mui/material";
import type {ReactNode} from "react";

type EmptyEventsStateProps = {
    title: string;
    subtitle: string;
    buttonText: string;
    icon: ReactNode;
    onClick: () => void;
}

function EmptyState({title, subtitle, buttonText, icon, onClick}: EmptyEventsStateProps) {
    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            minHeight: "60vh",
            px: 3,
        }}>
            <Box sx={{
                width: 56, height: 56, borderRadius: "50%",
                color: "primary.light", opacity: 0.8,
                display: "flex", alignItems: "center", justifyContent: "center",
                mb: 2,
            }}>
                {icon}
                {/*<RailwayAlert sx={{fontSize: 60, color: "primary.main"}}/>*/}
            </Box>
            <Typography variant="subtitle1" sx={{fontWeight: 500}} color="secondary">
                {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{mb: 2, maxWidth: 230}}>
                {subtitle}
            </Typography>
            <Button variant="contained" onClick={onClick}>
                {buttonText}
            </Button>
        </Box>
    )
}

export default EmptyState;