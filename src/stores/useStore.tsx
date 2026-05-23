import {Dayjs} from "dayjs";
import dayjs from "dayjs";
import {v4 as uuid4} from "uuid";
import {create} from "zustand/react";
import {persist} from "zustand/middleware";

export interface Participant {
    id: string;
    organisation: string;
    function: string;
    name: string;
    call: string;
    from: Dayjs | null;
    until: Dayjs | null;
}

export type MeasureType = "1" | "2" | "A" | "B" | "C" | "D" | "E"

export interface Measure {
    id: string;
    locationFrom: string;
    locationTo: string;
    locationDetails: string;
    measure: MeasureType
    from: Dayjs | null;
    until: Dayjs | null;
    participantsIntroduced: Participant[];
    participantsLifted: Participant[];
}

export interface Event {
    id: string;
    description: string;
    name: string;
    initials: string;
    district: string;
    eventNumber: string;
    protectionFrom: Dayjs | null;
    protectionUntil: Dayjs | null;
    onSiteFrom: Dayjs | null;
    onSiteUntil: Dayjs | null;
    participants: Participant[];
    measures: Measure[];
    notes: string;
}

type State = {
    darkMode: boolean,
    name: string,
    initials: string,
    district: string,
    events: Event[],
}

type Action = {
    setDarkMode: (value: boolean) => void,
    toggleDarkMode: () => void,
    addNewEvent: () => string;
    getEventById: (id: string | undefined) => Event | undefined;
    deleteEventById: (id: string) => void;
    changeEventById: (id: string, value: Event) => void;
    changeName: (name: string) => void;
    changeInitials: (initials: string) => void;
    changeDistrict: (district: string) => void;
}

const useStore = create<State & Action>()(
    persist(
        (set, get) => ({
            darkMode: false,
            name: "",
            initials: "",
            district: "",
            events: [],
            setDarkMode: (value: boolean) => set(() => ({darkMode: value})),
            toggleDarkMode: () => set((state) => ({darkMode: !state.darkMode})),
            addNewEvent: () => {
                const {events, name, initials, district} = get()
                const newID = uuid4();
                const newEvents: Event[] = [
                    ...events,
                    {
                        id: newID,
                        description: "",
                        name: name || "",
                        initials: initials || "",
                        district: district || "",
                        eventNumber: "",
                        protectionFrom: dayjs(),
                        protectionUntil: null,
                        onSiteFrom: null,
                        onSiteUntil: null,
                        participants: [],
                        measures: [],
                        notes: ""
                    }
                ]
                set({events: newEvents})
                return newID;
            },
            getEventById: (id: string | undefined): Event | undefined => {
                if (!id) return undefined;
                const {events} = get()
                return events.find((e) => e.id === id)
            },
            deleteEventById: (id: string) => {
                const {events} = get()
                const newEvents = events.filter(e => e.id !== id)
                set({events: newEvents})
            },
            changeEventById: (id: string, value: Event) => {
                const {events} = get()
                const newEvents = events.map((event) => {
                    if (event.id === id) {
                        return value
                    }
                    return event
                })
                set({events: newEvents})
            },
            changeName: (value: string) => {
                set({name: value})
            },
            changeInitials: (value: string) => {
                set({initials: value})
            },
            changeDistrict: (value: string) => {
                set({district: value})
            },
        }),
        {
            name: "protective-measures-storage",
            version: 1
        }
    )
)

export default useStore;