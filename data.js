var economicClasses = [{
    "label": "Poorest 20%",
    "name": "lower_class",
    "value": 0,
    "guessedValue": 0,
    "guessedSlices": []
}, {
    "label": "Lower Middle (20\u201140%)",
    "name": "lower_middle_class",
    "value": 0,
    "guessedValue": 0,
    "guessedSlices": []
}, {
    "label": "Middle (40\u201160%)",
    "name": "upper_middle_class",
    "value": 2.5,
    "guessedValue": 0,
    "guessedSlices": []
}, {
    "label": "Upper Middle (60\u201180%)",
    "name": "upper_class",
    "value": 7.5,
    "guessedValue": 0,
    "guessedSlices": []
}, {
    "label": "Richest 20%",
    "name": "upper_upper_class",
    "value": 90,
    "guessedValue": 0,
    "guessedSlices": []
}];


const BONUS_QUESTION = {
    question: "How much wealth does the top 1% own?",
    options: [
        { text: "10%", correct: false },
        { text: "20%", correct: false },
        { text: "32%", correct: true },
        { text: "50%", correct: false }
    ],
    fact: "The top 1% of households own roughly 32% of all private wealth in the United States."
};

const WEALTH_HISTORY = [
    { year: 1945, poorest: 1, lowermid: 2, middle: 6,  uppermid: 15, richest: 76 }, // Post-War
    { year: 1963, poorest: 0, lowermid: 3, middle: 8,  uppermid: 15, richest: 74 }, // Post-War stability
    { year: 1973, poorest: 0, lowermid: 3, middle: 9,  uppermid: 18, richest: 70 }, // Historical peak of middle class
    { year: 1983, poorest: 0, lowermid: 2, middle: 5,  uppermid: 13, richest: 80 }, // Shift towards concentration
    { year: 1992, poorest: 0, lowermid: 1, middle: 5,  uppermid: 11, richest: 83 },
    { year: 2001, poorest: 0, lowermid: 1, middle: 4,  uppermid: 11, richest: 84 }, // Tech bubble peak
    { year: 2007, poorest: 0, lowermid: 1, middle: 3.5,uppermid: 10.5,richest: 85 }, // Pre-GFC
    { year: 2013, poorest: 0, lowermid: 0, middle: 3,  uppermid: 9.5, richest: 87.5}, // Recovery gap
    { year: 2019, poorest: 0, lowermid: 0, middle: 3,  uppermid: 8,   richest: 89 }, // Pre-Pandemic
    { year: 2026, poorest: 0, lowermid: 0, middle: 2.5,uppermid: 7.5, richest: 90 }  // Game Answer State
];