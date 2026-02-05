export const CONFIG = {
    tournamentDate: "2026-07-17T09:00:00",
    social: {
        instagram: "https://www.instagram.com/ascent.2026/",
        youtube: "https://www.youtube.com/@ascent.2026"
    }
};

export interface School {
    name: string;
    status: 'Confirmed' | 'Qualified' | 'Not Registered' | 'Pending';
    logo?: string;
}

export const SCHOOLS_DATA: School[] = [
    { name: "St. Peter's College", status: 'Confirmed', logo: 'peters' },
    { name: "St. Joseph's College", status: 'Confirmed', logo: 'josephs' },
    { name: "Royal College", status: 'Confirmed', logo: 'royal' },
    { name: "St. Thomas' College", status: 'Confirmed', logo: 'st_thomas' },
    { name: "Trinity College", status: 'Confirmed', logo: 'trinity' },
    { name: "Ladies' College", status: 'Confirmed', logo: 'ladies' },
    { name: "Bishop's College", status: 'Confirmed', logo: 'bishops' },
    { name: "Methodist College", status: 'Confirmed', logo: 'methodists' },
    { name: "St. Bridget's Convent", status: 'Confirmed', logo: 'bridgets' },
    { name: "Musaeus College", status: 'Confirmed', logo: 'musaeus' },
    { name: "Ethos International", status: 'Confirmed', logo: 'ethos' },
    { name: "Royal Institute", status: 'Confirmed', logo: 'royal_institute' },
    { name: "The British School", status: 'Confirmed', logo: 'british_school' },
    { name: "Gateway College", status: 'Confirmed', logo: 'gateway' },
    { name: "Elizabeth Moir", status: 'Confirmed', logo: 'elizabeth_moir' },
    { name: "Stafford International", status: 'Confirmed', logo: 'stafford' },
    { name: "Colombo International", status: 'Confirmed', logo: 'cis' },
    { name: "Lyceum International", status: 'Confirmed', logo: 'lyceum' },
    { name: "Wycherley International", status: 'Confirmed', logo: 'wycherley' },
];
