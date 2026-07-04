import {Box, Typography, Button} from "@mui/material";
import {GppBad} from "@mui/icons-material";

function EventNotFound({onAdd}: { onAdd: () => void }) {
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
                <GppBad sx={{fontSize: 60, color: "primary.main"}}/>
            </Box>
            <Typography variant="subtitle1" sx={{fontWeight: 500}}>
                Ups... Ereignis nicht gefunden
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{mb: 2, maxWidth: 280}}>
                Dein aufgerufenes Ereignis konnte nicht gefunden werden.
            </Typography>
            <Button variant="contained" onClick={onAdd}>
                Zurück zur Startseite
            </Button>
        </Box>
    )
}

export default EventNotFound;