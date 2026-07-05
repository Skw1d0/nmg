import {createTheme} from "@mui/material";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import {deDE} from "@mui/x-date-pickers/locales"
// import { deDE } from "@mui/x-data-grid/locales";
//
// export const THEME = {
//     Light: 0,
//     Dark: 1,
// } as const;

// export type THEME = (typeof THEME)[keyof typeof THEME];

export const lightTheme = createTheme(
    {
        components: {
            MuiAccordion: {
                defaultProps: {
                    square: false,
                },
                styleOverrides: {
                    root: {
                        overflow: 'hidden',
                        '&:before': {
                            display: 'none',
                        },
                        '&.Mui-expanded': {
                            margin: 0,
                        },
                        '&:first-of-type': {
                            borderTopLeftRadius: 8,
                            borderTopRightRadius: 8,
                        },
                        '&:last-of-type': {
                            borderBottomLeftRadius: 8,
                            borderBottomRightRadius: 8,
                        },
                    },
                },
            },
            MuiFormControl: {
                defaultProps: {
                    variant: "standard",
                }
            },
            MuiTextField: {
                defaultProps: {
                    variant: "standard",
                },
            },
            MuiPickersTextField: {
                defaultProps: {
                    variant: "standard",
                },
            },
            MuiInputLabel: {
                defaultProps: {
                    shrink: true,
                }
            },
            MuiBottomNavigationAction: {
                styleOverrides: {
                    root: {
                        "&.Mui-selected": {
                            color: "#EC0016",
                        },
                    },
                },
            },
        },
        palette: {
            primary: {
                light: "#878C96",
                main: "#282D37",
                dark: "#131821",
            },
            secondary: {
                light: "#F75056",
                main: "#EC0016",
                dark: "#9B000E",
            },
            info: {
                light: "#FACA7F",
                main: "#F39200",
                dark: "#C05E00",
            },
            success: {
                light: "#8CBC80",
                main: "#408335",
                dark: "#165C27",
            },
            background: {
                default: "#eff3f6",
            },
            mode: "light",
        },
    },
    deDE
);

export const darkTheme = createTheme(
    {
        components: {
            MuiAccordion: {
                defaultProps: {
                    square: false,
                },
                styleOverrides: {
                    root: {
                        overflow: 'hidden',
                        '&:before': {
                            display: 'none',
                        },
                        '&.Mui-expanded': {
                            margin: 0,
                        },
                        '&:first-of-type': {
                            borderTopLeftRadius: 8,
                            borderTopRightRadius: 8,
                        },
                        '&:last-of-type': {
                            borderBottomLeftRadius: 8,
                            borderBottomRightRadius: 8,
                        },
                    },
                },
            },
            MuiFormControl: {
                defaultProps: {
                    variant: "standard",
                }
            },
            MuiTextField: {
                defaultProps: {
                    variant: "standard",
                },
            },
            MuiPickersTextField: {
                defaultProps: {
                    variant: "standard",
                },
            },
            MuiInputLabel: {
                defaultProps: {
                    shrink: true,
                }
            },
            MuiDialog: {
                styleOverrides: {
                    paper: {
                        // backgroundColor: "#1a1d24",
                        backgroundImage: "none",

                    }
                }
            },
            MuiBottomNavigationAction: {
                styleOverrides: {
                    root: {
                        "&.Mui-selected": {
                            color: "#ff7d8a",
                        },
                    },
                },
            },
        },
        palette: {
            primary: {
                light: "#ffffffff",
                main: "#d6d6d6ff",
                dark: "#b4b4b4ff",
            },
            secondary: {
                light: "#fbacb2",
                main: "#ff7d8a",
                dark: "#fd4354",
            },
            // secondary: {
            //     light: "#F75056",
            //     main: "#EC0016",
            //     dark: "#9B000E",
            // },
            info: {
                light: "#FACA7F",
                main: "#F39200",
                dark: "#C05E00",
            },
            success: {
                light: "#8CBC80",
                main: "#408335",
                dark: "#165C27",
            },
            background: {
                default: "#131821",
                paper: "#282D37",
            },
            mode: "dark",
        },
    },
    deDE
);
