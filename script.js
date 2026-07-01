const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-btn');
const quizArea = document.getElementById('quiz-area');
const scoreArea = document.getElementById('score-area');
const scoreElement = document.getElementById('score');
const totalQuestionsElement = document.getElementById('total-questions');
const restartButton = document.getElementById('restart-btn');
const fillInBlankContainer = document.getElementById('fill-in-blank-container');
const answerInput = document.getElementById('answer-input');
const submitAnswerBtn = document.getElementById('submit-answer-btn');

let currentQuestionIndex = 0;
let score = 0;

const questions = [
    {
        type: 'multiple',
        question: 'What is the capital of France?',
        answers: [
            { text: 'New York', correct: false },
            { text: 'London', correct: false },
            { text: 'Paris', correct: true },
            { text: 'Dublin', correct: false }
        ]
    },
    {
        type: 'multiple',
        question: 'Which planet is known as the Red Planet?',
        answers: [
            { text: 'Earth', correct: false },
            { text: 'Mars', correct: true },
            { text: 'Jupiter', correct: false },
            { text: 'Saturn', correct: false }
        ]
    },
    {
        type: 'fill',
        question: 'The chemical symbol for water is ___ (two letters, one number).',
        correctAnswer: 'H2O'
    },
    {
        type: 'multiple',
        question: 'What is 2 + 2?',
        answers: [
            { text: '3', correct: false },
            { text: '4', correct: true },
            { text: '5', correct: false },
            { text: '6', correct: false }
        ]
    }
];

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    scoreArea.classList.add('hide');
    quizArea.classList.remove('hide');
    nextButton.innerHTML = 'Next Question';
    showQuestion();
}

function showQuestion() {
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    questionElement.innerText = currentQuestion.question;

    if (currentQuestion.type === 'multiple') {
        fillInBlankContainer.style.display = 'none';
        answerButtonsElement.style.display = 'grid';
        
        currentQuestion.answers.forEach(answer => {
            const button = document.createElement('button');
            button.innerText = answer.text;
            button.classList.add('btn');
            if (answer.correct) {
                button.dataset.correct = answer.correct;
            }
            button.addEventListener('click', selectAnswer);
            answerButtonsElement.appendChild(button);
        });
    } else if (currentQuestion.type === 'fill') {
        answerButtonsElement.style.display = 'none';
        fillInBlankContainer.style.display = 'block';
        answerInput.value = '';
    }
}

function resetState() {
    nextButton.classList.add('hide');
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct === 'true';
    if (correct) {
        score++;
    }
    
    Array.from(answerButtonsElement.children).forEach(button => {
        setStatusClass(button, button.dataset.correct === 'true');
        button.disabled = true;
    });
    
    if (questions.length > currentQuestionIndex + 1) {
        nextButton.classList.remove('hide');
    } else {
        nextButton.innerHTML = 'Finish Quiz';
        nextButton.classList.remove('hide');
    }
}

submitAnswerBtn.onclick = function() {
    let currentQuestion = questions[currentQuestionIndex];
    let userAnswer = answerInput.value.trim().toUpperCase();
    
    if (userAnswer === currentQuestion.correctAnswer.toUpperCase()) {
        score++;
        answerInput.style.backgroundColor = '#d4edda';
    } else {
        answerInput.style.backgroundColor = '#f8d7da';
    }
    
    submitAnswerBtn.disabled = true;
    answerInput.disabled = true;
    
    if (questions.length > currentQuestionIndex + 1) {
        nextButton.classList.remove('hide');
    } else {
        nextButton.innerHTML = 'Finish Quiz';
        nextButton.classList.remove('hide');
    }
};

function setStatusClass(element, correct) {
    clearStatusClass(element);
    if (correct) {
        element.classList.add('correct');
    } else {
        element.classList.add('wrong');
    }
}

function clearStatusClass(element) {
    element.classList.remove('correct');
    element.classList.remove('wrong');
}

nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        submitAnswerBtn.disabled = false;
        answerInput.disabled = false;
        answerInput.style.backgroundColor = 'white';
        showQuestion();
    } else {
        showScore();
    }
});

function showScore() {
    quizArea.classList.add('hide');
    scoreArea.classList.remove('hide');
    scoreElement.innerText = score;
    totalQuestionsElement.innerText = questions.length;
}

restartButton.addEventListener('click', startQuiz);

// Start the game on load
startQuiz();
