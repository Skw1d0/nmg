import Typography from "@mui/material/Typography";
import data from "../tools/data.ts";
import {Bolt, LocationPin, Map, PictureInPicture} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import {Stack} from "@mui/material";
import useOpenWebsites from "../hooks/useOpenWebsite.tsx";
// import {useEffect, useState} from "react";

type LocationInfoProps = {
    location: string
}

export default function LocationInfo({location}: LocationInfoProps) {
    const {openAPN, openOpenrailwaymaps, openGoogleMaps} = useOpenWebsites()

    // const ds100Code = data.ordnungsrahmen.betriebsstellen.find((e) => e.langname === location)?.ds100;
    // const [isDisabled, setIsDisabled] = useState(true);
    //
    // useEffect(() => {
    //     let isMounted = true;
    //
    //     async function verifyAPN() {
    //         if (!ds100Code) {
    //             setIsDisabled(true);
    //             return;
    //         }
    //
    //         // Asynchronen Check ausführen
    //         const isValid = await checkAPN(ds100Code);
    //
    //         // State nur aktualisieren, wenn Komponente noch aktiv ist
    //         if (isMounted) {
    //             // Wenn APN gültig (true), wird disabled = false
    //             setIsDisabled(!isValid);
    //         }
    //     }
    //
    //     verifyAPN();
    //
    //     return () => {
    //         isMounted = false;
    //     }; // Cleanup gegen Memory Leaks
    // }, [ds100Code]);


    return (
        <Stack direction="row" spacing={1}
               sx={{display: "flex", alignItems: "center"}}>
            <Typography>
                {data.ordnungsrahmen.betriebsstellen.find((e) => e.langname === location)?.betriebsstellentypen.map((bst) => {
                    if (bst === "bahnhof") return "Bf ";
                    if (bst === "bahnhofsteil") return "Bft ";
                    if (bst === "haltepunkt") return "Hp ";
                    if (bst === "abzweigstelle") return "Azwst ";
                    if (bst === "ueberleitstelle") return "Üst ";
                })}
            </Typography>
            <Typography>
                {data.ordnungsrahmen.betriebsstellen.find((e) => e.langname === location)?.ds100}
            </Typography>
            {data.ordnungsrahmen.betriebsstellen.find((e) => e.langname === location)?.elektrifiziert &&
                <Bolt color="warning"/>}
            <Typography sx={{flexGrow: 1}}></Typography>
            <IconButton
                onClick={() => openAPN(data.ordnungsrahmen.betriebsstellen.find((e) => e.langname === location)?.ds100)}>
                <PictureInPicture/>
            </IconButton>
            <IconButton
                onClick={() => openOpenrailwaymaps(data.ordnungsrahmen.betriebsstellen.find((e) => e.langname === location)?.geo_koordinaten.breite, data.ordnungsrahmen.betriebsstellen.find((e) => e.langname === location)?.geo_koordinaten.laenge)}>
                <LocationPin/>
            </IconButton>
            <IconButton
                onClick={() => openGoogleMaps(data.ordnungsrahmen.betriebsstellen.find((e) => e.langname === location)?.geo_koordinaten.breite, data.ordnungsrahmen.betriebsstellen.find((e) => e.langname === location)?.geo_koordinaten.laenge)}>
                <Map/>
            </IconButton>
        </Stack>
    )
}