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
    { name: "Royal College", status: 'Pending', logo: 'royal' },
    { name: "St. Thomas' College", status: 'Pending', logo: 'st_thomas' },
    { name: "Trinity College", status: 'Pending', logo: 'trinity' },
    { name: "Ladies' College", status: 'Pending', logo: 'ladies' },
    { name: "Bishop's College", status: 'Pending', logo: 'bishops' },
    { name: "Methodist College", status: 'Pending', logo: 'methodists' },
    { name: "St. Bridget's Convent", status: 'Pending', logo: 'bridgets' },
    { name: "Musaeus College", status: 'Pending', logo: 'musaeus' },
    { name: "Ethos International", status: 'Confirmed', logo: 'ethos' },
    { name: "Royal Institute", status: 'Confirmed', logo: 'royal_institute' },
    { name: "The British School", status: 'Confirmed', logo: 'british_school' },
    { name: "Gateway College", status: 'Confirmed', logo: 'gateway' },
    { name: "Elizabeth Moir", status: 'Pending', logo: 'elizabeth_moir' },
    { name: "Stafford International", status: 'Pending', logo: 'stafford' },
    { name: "Colombo International", status: 'Pending', logo: 'cis' },
    { name: "Lyceum International", status: 'Pending', logo: 'lyceum' },
    { name: "Wycherley International", status: 'Pending', logo: 'wycherley' },
];
