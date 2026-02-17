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
    { name: "Royal Institute", status: 'Confirmed', logo: 'royal_institute' },
    { name: "Gateway College", status: 'Confirmed', logo: 'gateway' },
    { name: "St. Thomas' College", status: 'Confirmed', logo: 'st_thomas' },
    { name: "Ladies' College", status: 'Confirmed', logo: 'ladies' },
    { name: "Ethos International", status: 'Confirmed', logo: 'ethos' },
    { name: "The British School", status: 'Confirmed', logo: 'british_school' },
    { name: "Ananda College", status: 'Confirmed', logo: 'ananda' },
    { name: "Nalanda College", status: 'Confirmed', logo: 'nalanda' },
    { name: "Royal College", status: 'Pending', logo: 'royal' },
    { name: "Bishop's College", status: 'Pending', logo: 'bishops' },

    { name: "Musaeus College", status: 'Pending', logo: 'musaeus' },
    { name: "Elizabeth Moir", status: 'Pending', logo: 'elizabeth_moir' },
    { name: "Stafford International", status: 'Pending', logo: 'stafford' },
    { name: "Colombo International", status: 'Pending', logo: 'cis' },
    { name: "Lyceum International", status: 'Pending', logo: 'lyceum' },
    { name: "Wycherley International", status: 'Pending', logo: 'wycherley' },
];
