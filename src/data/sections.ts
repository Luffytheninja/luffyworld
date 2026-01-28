// Section copy data for Luffy World
// All copy formatted for direct placement beside or over each 3D asset

export interface SectionData {
    id: string;
    label: string;
    title: string;
    copy: string[];
    route: string;
}

export const SECTIONS: SectionData[] = [
    {
        id: 'altered-state',
        label: 'A ritual',
        title: 'Altered State',
        copy: [
            'An Ode to bohem',
            'Bohem,',
            'If nor be for you I for don craze today.',
            'You na real one,',
            'You resemble Igbeaux but you na fag',
            'T for Tenks.',
            'Gbayi!',
        ],
        route: '/altered-state',
    },
    {
        id: 'music',
        label: 'A habit',
        title: 'Music',
        copy: [
            'I listen more than I collect.',
            'Music fills the spaces that conversation can\'t reach.',
            'It sets the pace of the night.',
        ],
        route: '/music',
    },
    {
        id: 'bass-fantasy',
        label: 'A habit',
        title: 'Bass Fantasy',
        copy: [
            'Low frequencies feel physical.',
            'I like the tension in the strings, the resistance, the weight of sound.',
            'It keeps my hands honest.',
        ],
        route: '/bass-fantasy',
    },
    {
        id: 'tech-fantasy',
        label: 'An obsession',
        title: 'Tech Fantasy',
        copy: [
            'I\'m interested in how things evolve.',
            'Old machines had patience. New ones have speed.',
            'I like standing between them.',
        ],
        route: '/tech-fantasy',
    },
    {
        id: 'anime',
        label: 'An influence',
        title: 'Anime / Pop / Y2K',
        copy: [
            'Some things stay with you longer than you expect.',
            'Screens. Sounds. Interfaces from another time.',
            'They shaped how I see.',
        ],
        route: '/anime',
    },
];

export const HOMEPAGE_COPY = {
    hero: "I'm Luffy. This is how I spend my time when nothing is required of me.",
    supporting: "Sound, screens, solitude, and motion.",
    cta: "Enter the habits.",
};
