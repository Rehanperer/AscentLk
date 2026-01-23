export const CONFIG = {
    tournamentDate: "2026-07-17T09:00:00",
    social: {
        instagram: "https://www.instagram.com/ascent.2026/",
        youtube: "https://www.youtube.com/@ascent.2026"
    }
};

export interface School {
    name: string;
    status: 'Confirmed' | 'Qualified' | 'Not Registered';
}

export const SCHOOLS_DATA: School[] = [
    { name: "Ethos", status: 'Qualified' },
    { name: "Gateway", status: 'Confirmed' },
    { name: "British School", status: 'Confirmed' },
    { name: "Stafford", status: 'Not Registered' },
    { name: "Wycherley", status: 'Not Registered' },
    { name: "Lyceum", status: 'Not Registered' },
    { name: "Musaeus", status: 'Not Registered' },
    { name: "Visakha", status: 'Not Registered' },
    { name: "HFC", status: 'Not Registered' },
    { name: "CIS", status: 'Not Registered' },
    { name: "St. Peter's", status: 'Confirmed' },
    { name: "St. Joseph's", status: 'Confirmed' },
    { name: "Nalanda", status: 'Confirmed' },
    { name: "Ananda", status: 'Not Registered' },
    { name: "Bishop's", status: 'Not Registered' },
    { name: "Elizabeth Moir", status: 'Not Registered' },
    { name: "S. Thomas'", status: 'Not Registered' },
    { name: "Royal", status: 'Not Registered' },
    { name: "Ladies'", status: 'Not Registered' },
    { name: "Trinity", status: 'Not Registered' },
    { name: "St. Bridget's", status: 'Not Registered' },
    { name: "Isipathana", status: 'Not Registered' },
    { name: "D.S. Senanayake", status: 'Not Registered' }
];
