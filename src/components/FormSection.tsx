import {Box, Typography, Chip, Stack,} from "@mui/material";
import type {ReactNode} from "react";

type FormSectionProps = {
    icon: ReactNode;
    title: string;
    badge?: string;
    backgroundColor?: string;
    hideTitle?: boolean;
    allFilled?: boolean;
    children: ReactNode;
}

function FormSection(
    {
        icon,
        title,
        badge,
        backgroundColor,
        children,
        allFilled,
        hideTitle = false
    }: FormSectionProps) {

    return (
        <Box sx={{
            backgroundColor: backgroundColor || "background.paper",
            borderRadius: 3,
            borderLeft: 6,
            borderBottom: 1,
            borderRight: 1,
            borderTop: 1,
            borderColor:
                allFilled === undefined
                    ? "secondary.main"
                    : allFilled ? "success.main" : "error.main",
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
                {!hideTitle
                    && (
                        <>
                            <Stack direction="row" spacing={1}>
                                <Typography sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    color: allFilled === undefined
                                        ? ""
                                        : allFilled ? "success.main" : "error.main"
                                }}>
                                    {icon}
                                </Typography>
                                <Typography variant="h6"
                                            sx={{fontWeight: 500}}>{title}</Typography>
                            </Stack>
                            {badge
                                && (
                                    <Chip label={badge}
                                          size="small"
                                          sx={{fontSize: 11, height: 20, backgroundColor: "action.hover"}}/>
                                )
                            }
                        </>
                    )
                }
            </Box>
            <Box sx={{px: 2, pb: 2, display: "flex", flexDirection: "column", gap: 1.25}}>
                {children}
            </Box>
        </Box>
    )
}


export default FormSection;