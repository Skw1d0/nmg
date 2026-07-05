import {Box, Stack} from "@mui/material";
import dayjs, {type Dayjs} from "dayjs";
import useStore from "../hooks/useStore.tsx";
import {Descriptions, Districts} from "../tools/data.ts";
import {DateTimeInput} from "./DateTimeInput.tsx";
import {
    AccessTimeFilled,
    AdminPanelSettings,
    ArrowForward,
    Info,
} from "@mui/icons-material";
import FormSection from "./FormSection.tsx";
import InputContainer from "./InputContainer.tsx";
import AnimatedCard from "./AnimatedCard.tsx";
import AutocompleteString from "./AutocompleteString.tsx";
import TextFieldComponent from "./TextFieldComponent.tsx";


type GeneralsProps = {
    id: string;
}

export default function Generals(props: GeneralsProps) {
    const {changeEventById, changeDistrict, changeInitials, changeName} = useStore()

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

        changeName(value);
        changeEventById(event.id, newEvent);
    }

    function handleChangeInitials(value: string) {
        if (!event) return;

        const newEvent = {
            ...event,
            initials: value
        }

        changeInitials(value)
        changeEventById(event.id, newEvent);
    }

    function handleChangeDistrict(value: string) {
        if (!event) return;

        const newEvent = {
            ...event,
            district: value
        }

        changeDistrict(value)
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
                <AnimatedCard>
                    <FormSection icon={<Info color="secondary"/>} title="Allgemeines">
                        <Stack direction="column" spacing={1}>
                            <InputContainer>
                                <AutocompleteString label="Beschreibung des Ereignisses"
                                                    value={event.description}
                                                    setValue={handleChangeDescription}
                                                    options={Descriptions}
                                />
                                {/*<Autocomplete freeSolo*/}
                                {/*              options={Descriptions}*/}
                                {/*              value={event.description}*/}
                                {/*              onChange={(_event, newValue) => {*/}
                                {/*                  handleChangeDescription(newValue || "")*/}
                                {/*              }}*/}
                                {/*              onInputChange={(_event, newInputValue) => {*/}
                                {/*                  handleChangeDescription(newInputValue);*/}
                                {/*              }}*/}
                                {/*              renderInput={(params) => <TextField {...params}*/}
                                {/*                                                  label="Beschreibung des Ereignisses"/>}*/}
                                {/*/>*/}
                            </InputContainer>
                            <InputContainer>
                                <Stack direction="row" spacing={1}>
                                    <TextFieldComponent label="Name"
                                                        value={event.name}
                                                        setValue={handleChangeName}
                                                        fullWidth
                                                        max={20}/>
                                    {/*<TextField*/}
                                    {/*    label="Name"*/}
                                    {/*    value={event.name}*/}
                                    {/*    onChange={(e) => handleChangeName(e.target.value)}*/}
                                    {/*    fullWidth={true}*/}
                                    {/*/>*/}


                                    <TextFieldComponent label="Namenszeichen"
                                                        value={event.initials}
                                                        setValue={handleChangeInitials}
                                                        max={5}
                                    />
                                    {/*<TextField*/}
                                    {/*    label="Namenszeichen"*/}
                                    {/*    value={event.initials}*/}
                                    {/*    onChange={(e) => handleChangeInitials(e.target.value)}*/}
                                    {/*    sx={{width: 260}}*/}
                                    {/*/>*/}
                                </Stack>
                            </InputContainer>
                            <InputContainer>
                                <AutocompleteString label="Notfallbezirk"
                                                    value={event.district}
                                                    setValue={handleChangeDistrict}
                                                    options={Districts}
                                                    max={25}
                                />
                                {/*<Autocomplete freeSolo*/}
                                {/*              options={Districts}*/}
                                {/*              value={event.district}*/}
                                {/*              onChange={(_event, newValue) => {*/}
                                {/*                  handleChangeDistrict(newValue || "")*/}
                                {/*              }}*/}
                                {/*              onInputChange={(_event, newInputValue) => {*/}
                                {/*                  handleChangeDistrict(newInputValue);*/}
                                {/*              }}*/}
                                {/*              renderInput={(params) => <TextField {...params} label="Notfallbezirk"/>}*/}
                                {/*/>*/}
                            </InputContainer>
                            <InputContainer>
                                <TextFieldComponent label="Ereignisnummer"
                                                    value={event.eventNumber}
                                                    setValue={handleChangeEventNumber}
                                                    max={15}
                                />
                                {/*<TextField*/}
                                {/*    label="Ereignisnummer"*/}
                                {/*    value={event.eventNumber}*/}
                                {/*    onChange={(e) => handleChangeEventNumber(e.target.value)}/>*/}
                            </InputContainer>
                        </Stack>
                    </FormSection>
                </AnimatedCard>

                <AnimatedCard>
                    <FormSection icon={<AccessTimeFilled color="secondary"/>} title="Gesamtschutzdauer">
                        <InputContainer>
                            <Stack direction="row" spacing={1}>
                                <DateTimeInput label="Von"
                                               format="HH:mm"
                                               value={dayjs(event.protectionFrom)}
                                               handleChange={handleChangeProtectionFrom}/>
                                <Box sx={{display: "flex", alignItems: "center"}}>
                                    <ArrowForward/>
                                </Box>
                                <DateTimeInput label="Bis"
                                               format="HH:mm"
                                               value={dayjs(event.protectionUntil)}
                                               handleChange={handleChangeProtectionUntil}/>
                            </Stack>
                        </InputContainer>
                    </FormSection>
                </AnimatedCard>
                <AnimatedCard>
                    <FormSection icon={<AdminPanelSettings color="secondary"/>}
                                 title="Notfallmanager am Ereignisort">
                        <InputContainer>
                            <Stack direction="row" spacing={1}>
                                <DateTimeInput label="Von"
                                               format="HH:mm"
                                               value={event.onSiteFrom}
                                               handleChange={handleChangeOnSiteFrom}/>
                                <Box sx={{display: "flex", alignItems: "center"}}>
                                    <ArrowForward/>
                                </Box>
                                <DateTimeInput label="Bis"
                                               format="HH:mm"
                                               value={event.onSiteUntil}
                                               handleChange={handleChangeOnSiteUntil}/>
                            </Stack>
                        </InputContainer>
                    </FormSection>
                </AnimatedCard>

                {/*<Card variant="outlined">*/}
                {/*    <CardHeader title="Allgemeines"/>*/}
                {/*    <CardContent>*/}
                {/*        <Stack direction="column" spacing={1}>*/}
                {/*            <Autocomplete freeSolo*/}
                {/*                          options={Descriptions}*/}
                {/*                          value={event.description}*/}
                {/*                          onChange={(_event, newValue) => {*/}
                {/*                              handleChangeDescription(newValue || "")*/}
                {/*                          }}*/}
                {/*                          onInputChange={(_event, newInputValue) => {*/}
                {/*                              handleChangeDescription(newInputValue);*/}
                {/*                          }}*/}
                {/*                          renderInput={(params) => <TextField {...params}*/}
                {/*                                                              label="Beschreibung des Ereignisses"*/}
                {/*                                                              variant="filled"/>}/>*/}
                {/*            <Stack direction="row" spacing={1}>*/}
                {/*                <TextField label="Name"*/}
                {/*                           variant="filled"*/}
                {/*                           value={event.name}*/}
                {/*                           onChange={(e) => handleChangeName(e.target.value)}*/}
                {/*                           fullWidth={true}*/}
                {/*                />*/}
                {/*                <TextField label="Namenszeichen"*/}
                {/*                           variant="filled"*/}
                {/*                           value={event.initials}*/}
                {/*                           onChange={(e) => handleChangeInitials(e.target.value)}*/}
                {/*                           sx={{width: 260}}*/}
                {/*                />*/}
                {/*            </Stack>*/}
                {/*            <Autocomplete freeSolo*/}
                {/*                          options={Districts}*/}
                {/*                          value={event.district}*/}
                {/*                          onChange={(_event, newValue) => {*/}
                {/*                              handleChangeDistrict(newValue || "")*/}
                {/*                          }}*/}
                {/*                          onInputChange={(_event, newInputValue) => {*/}
                {/*                              handleChangeDistrict(newInputValue);*/}
                {/*                          }}*/}
                {/*                          renderInput={(params) => <TextField {...params}*/}
                {/*                                                              label="Notfallbezirk"*/}
                {/*                                                              variant="filled"/>}/>*/}
                {/*            <TextField label="Ereignisnummer"*/}
                {/*                       variant="filled"*/}
                {/*                       value={event.eventNumber}*/}
                {/*                       onChange={(e) => handleChangeEventNumber(e.target.value)}*/}
                {/*            />*/}
                {/*        </Stack>*/}
                {/*    </CardContent>*/}
                {/*</Card>*/}
                {/*<Card variant="outlined">*/}
                {/*    <CardHeader title="Gesamtschutzdauer"/>*/}
                {/*    <CardContent>*/}
                {/*        <Stack direction={"column"} spacing={1}>*/}
                {/*            <DateTimeInput label="Von"*/}
                {/*                           value={dayjs(event.protectionFrom)}*/}
                {/*                           handleChange={handleChangeProtectionFrom}/>*/}
                {/*            <DateTimeInput label="Bis"*/}
                {/*                           value={dayjs(event.protectionUntil)}*/}
                {/*                           handleChange={handleChangeProtectionUntil}/>*/}
                {/*        </Stack>*/}
                {/*    </CardContent>*/}
                {/*</Card>*/}
                {/*<Card variant="outlined">*/}
                {/*    <CardHeader title="Notfallmanager am Ereignisort"/>*/}
                {/*    <CardContent>*/}
                {/*        <Stack direction={"column"} spacing={1}>*/}
                {/*            <DateTimeInput label="Von"*/}
                {/*                           value={event.onSiteFrom}*/}
                {/*                           handleChange={handleChangeOnSiteFrom}/>*/}
                {/*            <DateTimeInput label="Bis"*/}
                {/*                           value={event.onSiteUntil}*/}
                {/*                           handleChange={handleChangeOnSiteUntil}/>*/}
                {/*        </Stack>*/}
                {/*    </CardContent>*/}
                {/*</Card>*/}
            </Stack>
        </Box>
    )
}