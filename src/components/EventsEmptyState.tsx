import {Box, Typography, Button} from "@mui/material";
import {RailwayAlert} from "@mui/icons-material"; // oder AddModerator, GppMaybe

function EventsEmptyState({onAdd}: { onAdd: () => void }) {
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
                <RailwayAlert sx={{fontSize: 60, color: "primary.main"}}/>
            </Box>
            <Typography variant="subtitle1" sx={{fontWeight: 500}}>
                Noch kein Ereignis
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{mb: 2, maxWidth: 230}}>
                Lege das erste Ereignis an, um sie hier zu sehen.
            </Typography>
            <Button variant="contained" onClick={onAdd}>
                Ereignis hinzufügen
            </Button>
        </Box>
    )
}

export default EventsEmptyState;