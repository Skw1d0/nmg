import {Box, Typography, Button} from "@mui/material";
import {AddModerator} from "@mui/icons-material"; // oder AddModerator, GppMaybe

function MeasuresEmptyState({onAdd}: { onAdd: () => void }) {
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
                <AddModerator sx={{fontSize: 60, color: "primary.main"}}/>
            </Box>
            <Typography variant="subtitle1" sx={{fontWeight: 500}}>
                Noch keine Maßnahme
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{mb: 2, maxWidth: 280}}>
                Lege die erste Maßnahme für dieses Ereignis an, um sie hier zu sehen.
            </Typography>
            <Button variant="contained" onClick={onAdd}>
                Maßnahme hinzufügen
            </Button>
        </Box>
    )
}

export default MeasuresEmptyState;