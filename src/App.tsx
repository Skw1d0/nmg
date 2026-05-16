import {BrowserRouter, Routes, Route} from "react-router";
import {ThemeProvider} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {LocalizationProvider} from "@mui/x-date-pickers";
import 'dayjs/locale/de';
import useStore from "./stores/useStore.tsx";

import {lightTheme, darkTheme} from "./styles/theme.ts";

import Event from "./pages/Event.tsx"
import Archive from "./pages/Archive.tsx";

function App() {
    const {darkMode} = useStore();

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"de"}>
            <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
                <CssBaseline/>
                <BrowserRouter basename={import.meta.env.BASE_URL}>
                    <Routes>
                        <Route index element={<Archive/>}/>
                        <Route path="event/:id" element={<Event/>}/>
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </LocalizationProvider>
    );
}

import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";

export default App;
