const {readFileSync, existsSync} = require('fs');
module.exports = function(path) {
    function loadQuestions(path) {
        if (existsSync(path)) {
            return JSON.parse(readFileSync(path));    
        } else {
            return {};
        }
    }
    const questions = loadQuestions(path);
    const categories = Object.keys(questions);
    let currentCategoryIndex = -1;
    let currentTopic = null;
    let currentQuestion = null;
    return {
        getNextQuestion() {
            currentCategoryIndex = ++currentCategoryIndex % categories.length;
            let topics = Object.keys(questions[categories[currentCategoryIndex]]);
            let topicIndex = Math.floor(Math.random() * topics.length);
            currentTopic = topics[topicIndex];
            let topicQuestions = Object.keys(questions[categories[currentCategoryIndex]][currentTopic]);
            let questionIndex = Math.floor(Math.random() * topicQuestions.length);
            currentQuestion = topicQuestions[questionIndex];
            return {
                category: categories[currentCategoryIndex],
                topic: currentTopic,
                question: currentQuestion,
                answer: questions[categories[currentCategoryIndex]][currentTopic][currentQuestion]
            }
        },
        getAnotherQuestion() {
            if (currentCategoryIndex === -1) {
                currentCategoryIndex = 0;
            }
            let topics = Object.keys(questions[categories[currentCategoryIndex]]);
            let topicIndex = Math.floor(Math.random() * topics.length);
            currentTopic = topics[topicIndex];
            let topicQuestions = Object.keys(questions[categories[currentCategoryIndex]][currentTopic]);
            let questionIndex = Math.floor(Math.random() * topicQuestions.length);
            currentQuestion = topicQuestions[questionIndex];
            return {
                category: categories[currentCategoryIndex],
                topic: currentTopic,
                question: currentQuestion,
                answer: questions[categories[currentCategoryIndex]][currentTopic][currentQuestion]
            }
        },
        getCurrentQuestion() {
            if (currentTopic && currentQuestion) {
                return {
                    category: categories[currentCategoryIndex],
                    topic: currentTopic,
                    question: currentQuestion,
                    answer: questions[categories[currentCategoryIndex]][currentTopic][currentQuestion]
                }
            } else {
                return {
                    category: '',
                    topic: '',
                    question: '',
                    answer: ''
                };
            }
        },
        resetCurrentQuestion() {
            currentCategoryIndex = -1;
            currentTopic = null;
            currentQuestion = null;
            return {
                category: '',
                topic: '',
                question: '',
                answer: ''
            };            
        }
    };
};