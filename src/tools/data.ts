import data from "./data.json";

export interface GeoKoordinaten {
    breite: number;
    laenge: number;
}

export interface Betriebsstelle {
    x: number;
    y: number;
    ds100: string;
    betriebsstellentypen: string[];
    primary_location_code: string;
    langname: string;
    geo_koordinaten: GeoKoordinaten;
    elektrifiziert: boolean;
    bahnhof: boolean;
}

export interface MutterBetriebsstelle {
    ds100: string;
    langname: string;
    geo_koordinaten: GeoKoordinaten;
    tochterbetriebsstellen: string[];
}

export interface Streckensegment {
    von: string;
    bis: string;
    streckennummer: number;
    von_km: number;
    bis_km: number;
}

export interface Ordnungsrahmen {
    betriebsstellen: Betriebsstelle[];
    mutter_betriebsstellen: MutterBetriebsstelle[];
    streckensegmente: Streckensegment[];
}

export interface Data {
    id: number;
    anzeigename: string;
    fahrplanjahr: number;
    gueltig_von: string;
    gueltig_bis: string;
    ordnungsrahmen: Ordnungsrahmen;
}

export const Descriptions = [
    "Zugkollision",
    "Sonstige Kollision",
    "Zugentgleisung",
    "Sonstige Entgleisung",
    "Personenunfall am bew. Einsenbahnfahrzeug",
    "Personenunfall am steh. Einsenbahnfahrzeug",
    "Bahnübergangsunfall",
    "Feuer/ Explosion in einem Eisenbahnfahrzeug",
    "Sonstiger Unfall",
    "Vorbeifahrt eines Zuges am Haltebegriff",
    "Einfahrt in besetzten Gleisabschnitt",
    "Störung am Bahnübergang",
    "Störung am Fahrzeug",
    "Störung an der Infrastruktur",
    "Störung durch betriebliche Fehlhandlung",
    "Zugkollision mit Gegenstand",
    "Sonstige Kollision mit Gegenstand",
    "Anfahrt am Haltebegriff ohne Zustimmung durch Zug- und Rangierfahrt",
    "Vorbeifahrt am Haltebegriff ohne Zustimmung durch Rangierfahrt",
    "Störung am Bahnübergang bei Rangierfahrten",
    "Störung durch betriebliche Fehlhandlung bei Rangierfahrten",
    "Mögliches Austreten von gefährlichen Gütern",
    "Freiwerden gefährlicher Betriebsstoffe",
    "Suizid/ versuchter Suizid",
    "Sonstige gefährliches Ereignis",
    "Stromunfälle",
    "Personenunfall durch Stromschlag am stehenden Fahrzeug"
]

export const Participants = [
    "Feuerwehr",
    "Bundespolizei",
    "Landespolizei",
    "Rettungsdienst",
    "Notdienst EVU",
    "Nmg Assistent",
    "Aufgleisleiter",
    "THW",
    "EBA",
    "BEU",
]

export const Districts = [
    "Aachen",
    "Altenburg",
    "Anklam",
    "Ansbach",
    "Augsburg",
    "auswählen",
    "Bad Kleinen",
    "Bamberg",
    "Basel",
    "Bautzen",
    "Bebra",
    "Berlin-Grunewald",
    "Berlin-Pankow",
    "Berlin-Rummelsburg",
    "Bestwig",
    "Bielefeld",
    "Bingen",
    "Bitterfeld",
    "Bochum Nord",
    "Bochum Süd",
    "Bonn",
    "Brandenburg",
    "Braunschweig",
    "Bremen",
    "Bremerhaven",
    "Buchloe",
    "Chemnitz",
    "Cochem",
    "Coesfeld",
    "Cottbus",
    "Crailsheim",
    "Darmstadt",
    "Diepholz",
    "Doberlug-Kirchhain",
    "Donauwörth",
    "Dortmund",
    "Dresden",
    "Duisburg Nord",
    "Duisburg Süd",
    "Düsseldorf",
    "Eisenach",
    "Erfurt",
    "Falkenberg",
    "Finnetrop",
    "Frankfurt (M)",
    "Frankfurt (O)",
    "Freiberg (Sachs)",
    "Freiburg",
    "Freilassing",
    "Fulda",
    "Fürth",
    "Gemünden",
    "Gera",
    "Gerolstein",
    "Gießen",
    "Göttingen",
    "Güsten",
    "Güstrow",
    "Hagen",
    "Hagenow Land",
    "Halberstadt",
    "Halle",
    "Hamburg Hbf",
    "Hamburg-Altona",
    "Hamburg-Harburg Nord",
    "Hamburg-Harburg Süd",
    "Hameln",
    "Hamm",
    "Hanau",
    "Hannover",
    "Heidelberg",
    "Heilbronn",
    "Hof",
    "Hoyerswerda",
    "Husum",
    "Ingolstadt",
    "Itzehoe",
    "Jüterbog",
    "Kaiserslautern",
    "Karlsruhe",
    "Kassel",
    "Kempten",
    "Kiel",
    "Kirchenlaibach",
    "Kirn",
    "Koblenz",
    "Köln Mitte",
    "Köln-Deutz",
    "Königs-Wusterhausen",
    "Krefeld",
    "Kreiensen",
    "Kronach",
    "Landshut",
    "Leer",
    "Lehrte",
    "Leipzig",
    "Limburg",
    "Lingen (Ems)",
    "Löwenberg",
    "Lübeck",
    "Ludwigshafen (Rhein)",
    "Lutherstadt Wittenberg",
    "Magdeburg",
    "Mainz",
    "Minden",
    "Mühldorf (Obb)",
    "München Ost",
    "München West",
    "Münster (Westf)",
    "Murnau",
    "Naumburg",
    "Neustadt (Dosse)",
    "Neustadt (Weinstraße)",
    "Neustrelitz",
    "Nordhausen",
    "Nürnberg",
    "Oebisfelde",
    "Offenburg",
    "Oldenburg (Oldb)",
    "Osnabrück",
    "Paderborn",
    "Pirna",
    "Plattling",
    "Plauen",
    "Plochingen",
    "Prenzlau",
    "Ravensburg",
    "Regensburg",
    "Riesa",
    "Rosenheim",
    "Rostock",
    "Saalfeld",
    "Saarbrücken",
    "Salzwedel",
    "S-Bahn-Berlin",
    "Schwandorf",
    "Schweinfurt",
    "Seddin",
    "Siegen",
    "Singen",
    "Stendal",
    "Stralsund",
    "Strausberg",
    "Stuttgart",
    "Suhl",
    "Treysa",
    "Trier",
    "Troisdorf",
    "Tübingen",
    "Uelzen",
    "Ulm",
    "Vaihingen",
    "Verden (Aller)",
    "Villingen",
    "Weiden",
    "Wesel",
    "Wittenberge",
    "Wuppertal",
    "Würzburg",
    "Wustermark",
    "Zwickau"
]


export default data as Data;