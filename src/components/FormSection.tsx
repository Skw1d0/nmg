import {Box, Typography, Chip,} from "@mui/material";
import type {ReactNode} from "react";

type FormSectionProps = {
    icon: ReactNode;
    title: string;
    badge?: string;
    backgroundColor?: string;
    hideTitle?: boolean;
    children: ReactNode;
}

function FormSection({icon, title, badge, backgroundColor, children, hideTitle = false}: FormSectionProps) {
    return (
        <Box sx={{
            backgroundColor: backgroundColor || "background.paper",
            borderRadius: 3,
            borderLeft: 6,
            borderBottom: 1,
            borderRight: 1,
            borderTop: 1,
            borderColor: "secondary.main",
            mb: 0,
            overflow: "hidden",
        }}>
            <Box sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 2,
                pt: 1.75,
                pb: 1,
            }}>
                {!hideTitle && (
                    <>
                        <Box sx={{display: "flex", alignItems: "center", gap: 1,}}>
                            {icon}
                            <Typography variant="h6" sx={{fontWeight: 500}}>{title}</Typography>
                        </Box>
                        {badge && (
                            <Chip label={badge} size="small"
                                  sx={{fontSize: 11, height: 20, backgroundColor: "action.hover"}}/>
                        )}
                    </>
                )}
            </Box>
            <Box sx={{px: 2, pb: 2, display: "flex", flexDirection: "column", gap: 1.25}}>
                {children}
            </Box>
        </Box>
    )
}


export default FormSection;