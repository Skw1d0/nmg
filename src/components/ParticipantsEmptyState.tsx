import {Box, Typography, Button} from "@mui/material";
import {GroupAdd} from "@mui/icons-material";

function ParticipantsEmptyState({onAdd}: { onAdd: () => void }) {
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
                <GroupAdd sx={{fontSize: 60, color: "primary.main"}}/>
            </Box>
            <Typography variant="subtitle1" sx={{fontWeight: 500}}>
                Noch keine Beteiligte
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{mb: 2, maxWidth: 280}}>
                Lege den ersten Beteiligten für dieses Ereignis an, um ihn hier zu sehen.
            </Typography>
            <Button variant="contained" onClick={onAdd}>
                Beteiligten hinzufügen
            </Button>
        </Box>
    )
}

export default ParticipantsEmptyState;