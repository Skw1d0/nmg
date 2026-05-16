import {Autocomplete, Box, Card, CardContent, CardHeader, Stack, TextField} from "@mui/material";
import {DateTimePicker} from "@mui/x-date-pickers";
import dayjs, {type Dayjs} from "dayjs";
import useStore from "../stores/useStore.tsx";
import {Descriptions} from "../tools/data.ts";

type GeneralsProps = {
    id: string;
}

export default function Generals(props: GeneralsProps) {
    const {changeEventById} = useStore()

    const event = useStore((state) => state.events.find((e) => e.id === props.id))
    if (!event) return null;

    function handleChangeDescription(value: string) {
        if (!event) return;

        const newEvent = {
            ...event,
            description: value
        }

        changeEventById(event.id, newEvent);
    }

    function handleChangeProtectionFrom(value: Dayjs) {
        if (!event) return;

        const newEvent = {
            ...event,
            protectionFrom: value
        }

        changeEventById(event.id, newEvent);
    }

    function handleChangeProtectionUntil(value: Dayjs) {
        if (!event) return;

        const newEvent = {
            ...event,
            protectionUntil: value
        }

        changeEventById(event.id, newEvent);
    }

    function handleChangeOnSiteFrom(value: Dayjs) {
        if (!event) return;

        const newEvent = {
            ...event,
            onSiteFrom: value
        }

        changeEventById(event.id, newEvent);
    }

    function handleChangeOnSiteUntil(value: Dayjs) {
        if (!event) return;

        const newEvent = {
            ...event,
            onSiteUntil: value
        }

        changeEventById(event.id, newEvent);
    }

    function handleChangeName(value: string) {
        if (!event) return;

        const newEvent = {
            ...event,
            name: value
        }

        changeEventById(event.id, newEvent);
    }

    function handleChangeInitials(value: string) {
        if (!event) return;

        const newEvent = {
            ...event,
            initials: value
        }

        changeEventById(event.id, newEvent);
    }

    function handleChangeDistrict(value: string) {
        if (!event) return;

        const newEvent = {
            ...event,
            district: value
        }

        changeEventById(event.id, newEvent);
    }

    function handleChangeEventNumber(value: string) {
        if (!event) return;

        const newEvent = {
            ...event,
            eventNumber: value
        }

        changeEventById(event.id, newEvent);
    }

    return (
        <Box>
            <Stack direction={"column"} spacing={1}>
                {/*<Stack direction={"column"} spacing={1}>*/}
                {/*    */}
                {/*    <Typography>Beschreibung:</Typography>*/}
                {/*    <TextField value={event.description}*/}
                {/*               onChange={(e) => handleChangeDescription(e.target.value)}/>*/}
                {/*</Stack>*/}
                <Card variant="outlined">
                    <CardHeader title="Allgemeine Angaben" subheader="Um welches Ereignis handelt es sich?"/>
                    <CardContent>
                        <Stack direction="column" spacing={1}>
                            <Autocomplete freeSolo
                                          options={Descriptions}
                                          value={event.description}
                                          onChange={(_event, newValue) => {
                                              handleChangeDescription(newValue || "")
                                          }}
                                          onInputChange={(_event, newInputValue) => {
                                              handleChangeDescription(newInputValue);
                                          }}
                                          renderInput={(params) => <TextField {...params}
                                                                              label="Beschreibung des Ereignisses"/>}/>
                            <Stack direction="row" spacing={1}>
                                <TextField label="Name"
                                           value={event.name}
                                           onChange={(e) => handleChangeName(e.target.value)}
                                           fullWidth={true}
                                />
                                <TextField label="Namenszeichen"
                                           value={event.initials}
                                           onChange={(e) => handleChangeInitials(e.target.value)}
                                           sx={{width: 260}}
                                />
                            </Stack>
                            <TextField label="Notfallbezirk"
                                       value={event.district}
                                       onChange={(e) => handleChangeDistrict(e.target.value)}/>
                            <TextField label="Ereignisnummer"
                                       value={event.eventNumber}
                                       onChange={(e) => handleChangeEventNumber(e.target.value)}
                            />
                        </Stack>
                    </CardContent>
                </Card>
                <Card variant="outlined">
                    <CardHeader title="Gesamtschutzdauer" subheader="Wann begann der Schutz der Rettungskräfte?"/>
                    <CardContent>
                        <Stack direction={"column"} spacing={1}>
                            {/*    <Typography>Gesamtschutzdauer:</Typography>*/}
                            <DateTimePicker label={"Von"} sx={{width: "100%"}}
                                            value={event.protectionFrom && dayjs(event.protectionFrom)}
                                            onChange={(value) => handleChangeProtectionFrom(dayjs(value))}
                                            slotProps={{
                                                actionBar: {
                                                    actions: ['today', 'cancel', 'accept'],
                                                },
                                            }}
                            />
                            <DateTimePicker label={"Bis"} sx={{width: "100%"}}
                                            value={event.protectionUntil && dayjs(event.protectionUntil)}
                                            onChange={(value) => handleChangeProtectionUntil(dayjs(value))}
                                            slotProps={{
                                                actionBar: {
                                                    actions: ['today', 'cancel', 'accept'],
                                                },
                                            }}
                            />
                        </Stack>
                    </CardContent>
                </Card>
                <Card variant="outlined">
                    <CardHeader title="Notfallmanager am Ereignisort" subheader="Wann warst du Vorort?"/>
                    <CardContent>
                        <Stack direction={"column"} spacing={1}>
                            {/*<Typography>Notfallmanager am Ereignisort:</Typography>*/}
                            <DateTimePicker label={"Von"} sx={{width: "100%"}}
                                            value={event.onSiteFrom && dayjs(event.onSiteFrom)}
                                            onChange={(value) => handleChangeOnSiteFrom(dayjs(value))}
                                            slotProps={{
                                                actionBar: {
                                                    actions: ['today', 'cancel', 'accept'],
                                                },
                                            }}
                            />
                            <DateTimePicker label={"Bis"} sx={{width: "100%"}}
                                            value={event.onSiteUntil && dayjs(event.onSiteUntil)}
                                            onChange={(value) => handleChangeOnSiteUntil(dayjs(value))}
                                            slotProps={{
                                                actionBar: {
                                                    actions: ['today', 'cancel', 'accept'],
                                                },
                                            }}
                            />
                        </Stack>

                    </CardContent>
                </Card>
            </Stack>
        </Box>
    )
}