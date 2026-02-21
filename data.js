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

const INITIAL_PIECES = [
    {
        "id": 1,
        "value": 2.5, "img": "images/slices/slice-12.png"
    },
    { "id": 2, "value": 2.5, "img": "images/slices/slice-13.png" },
    { "id": 3, "value": 2.5, "img": "images/slices/slice-12.png" },
    { "id": 4, "value": 2.5, "img": "images/slices/slice-13.png" },
    
    { "id": 5, "value": 5, "img": "images/slices/slice-1.png" },
    { "id": 6, "value": 5, "img": "images/slices/slice-1.png" },
    { "id": 7, "value": 5, "img": "images/slices/slice-1.png" },
    { "id": 8, "value": 5, "img": "images/slices/slice-1.png" },
    { "id": 9, "value": 5, "img": "images/slices/slice-1.png" },
    { "id": 10, "value": 5, "img": "images/slices/slice-1.png" },
    { "id": 11, "value": 5, "img": "images/slices/slice-1.png" },
    { "id": 12, "value": 5, "img": "images/slices/slice-1.png" },

    { "id": 13, "value": 10, "img": "images/slices/slice-3.png" },
    { "id": 14, "value": 10, "img": "images/slices/slice-4.png" },
    { "id": 15, "value": 10, "img": "images/slices/slice-5.png" },
    { "id": 16, "value": 10, "img": "images/slices/slice-6.png" },
    { "id": 17, "value": 10, "img": "images/slices/slice-7.png" }
];

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

const WEALTH_HISTORY = {
    startYear: 1963,
    endYear: 2016,
    // Values for: Poorest, Lower-Mid, Middle, Upper-Mid, Richest
    start: [1, 2, 6, 15, 76], 
    end: [-1, 0, 2, 8, 90]
};