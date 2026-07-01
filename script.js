const questions = [
    {
        type: 'multiple',
        category: 'Geography',
        question: 'What is the capital of France?',
        answers: ['Berlin', 'Madrid', 'Paris', 'Rome'],
        correct: 2
    },
    {
        type: 'multiple',
        category: 'Science',
        question: 'Which planet is known as the Red Planet?',
        answers: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
        correct: 1
    },
    {
        type: 'fill',
        category: 'Chemistry',
        question: 'What is the chemical symbol for water?',
        correctAnswer: 'H2O'
    },
    {
        type: 'multiple',
        category: 'Technology',
        question: 'Who is the co-founder of Apple Inc.?',
        answers: ['Bill Gates', 'Mark Zuckerberg', 'Elon Musk', 'Steve Jobs'],
        correct: 3
    },
    {
        type: 'multiple',
        category: 'History',
        question: 'In which year did World War II end?',
        answers: ['1943', '1944', '1945', '1946'],
        correct: 2
    }
];

// DOM references
const startScreen   = document.getElementById('start-screen');
const quizScreen    = document.getElementById('quiz-screen');
const resultScreen  = document.getElementById('result-screen');
const startBtn      = document.getElementById('start-btn');
const nextBtn       = document.getElementById('next-btn');
const restartBtn    = document.getElementById('restart-btn');
const submitFillBtn = document.getElementById('submit-fill-btn');
const optionsGrid   = document.getElementById('options-grid');
const fillArea      = document.getElementById('fill-area');
const fillInput     = document.getElementById('fill-input');
const feedbackBox   = document.getElementById('feedback-box');
const progressBar   = document.getElementById('progress-bar');
const timerText     = document.getElementById('timer-text');
const timerCircle   = document.getElementById('timer-circle');
const liveScore     = document.getElementById('live-score');
const currentQEl    = document.getElementById('current-q');
const totalQEl      = document.getElementById('total-q');

let currentIndex = 0, score = 0, timerInterval, timeLeft, userAnswers = [];
const TOTAL_TIME = 10;
const CIRCUMFERENCE = 100;

totalQEl.textContent = questions.length;

function showScreen(screen) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    screen.classList.add('active');
    screen.style.display = 'flex';
}

function startQuiz() {
    currentIndex = 0; score = 0; userAnswers = [];
    liveScore.textContent = 0;
    showScreen(quizScreen);
    loadQuestion();
}

function loadQuestion() {
    const q = questions[currentIndex];
    document.getElementById('question-text').textContent = q.question;
    document.getElementById('question-category').textContent = q.category;
    currentQEl.textContent = currentIndex + 1;
    progressBar.style.width = `${((currentIndex) / questions.length) * 100}%`;
    feedbackBox.classList.add('hide');
    nextBtn.classList.add('hide');
    optionsGrid.innerHTML = '';

    if (q.type === 'multiple') {
        optionsGrid.style.display = 'grid';
        fillArea.style.display = 'none';
        q.answers.forEach((ans, i) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = ans;
            btn.onclick = () => selectOption(i, btn);
            optionsGrid.appendChild(btn);
        });
    } else {
        optionsGrid.style.display = 'none';
        fillArea.style.display = 'flex';
        fillInput.value = '';
        fillInput.disabled = false;
        submitFillBtn.disabled = false;
        fillInput.style.borderColor = '#e8eaf6';
    }

    startTimer();
}

function startTimer() {
    clearInterval(timerInterval);
    timeLeft = TOTAL_TIME;
    updateTimerUI();
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerUI();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeout();
        }
    }, 1000);
}

function updateTimerUI() {
    timerText.textContent = timeLeft;
    const offset = CIRCUMFERENCE - (timeLeft / TOTAL_TIME) * CIRCUMFERENCE;
    timerCircle.style.strokeDashoffset = offset;
    timerCircle.style.stroke = timeLeft <= 3 ? '#f59e0b' : '#e94560';
}

function handleTimeout() {
    userAnswers.push('timeout');
    const q = questions[currentIndex];
    showFeedback('timeout', `⏰ Time's up! The answer was: ${q.type === 'multiple' ? q.answers[q.correct] : q.correctAnswer}`);
    disableOptions();
    nextBtn.classList.remove('hide');
}

function selectOption(index, btn) {
    clearInterval(timerInterval);
    const q = questions[currentIndex];
    const isCorrect = index === q.correct;

    document.querySelectorAll('.option-btn').forEach((b, i) => {
        b.disabled = true;
        if (i === q.correct) b.classList.add('correct');
    });

    if (!isCorrect) {
        btn.classList.add('wrong');
        showFeedback('wrong', `✗ Wrong! The correct answer is: ${q.answers[q.correct]}`);
    } else {
        score++;
        liveScore.textContent = score;
        showFeedback('correct', '✓ Correct! Great job!');
    }
    userAnswers.push(isCorrect ? 'correct' : 'wrong');
    nextBtn.classList.remove('hide');
}

submitFillBtn.onclick = function() {
    clearInterval(timerInterval);
    const q = questions[currentIndex];
    const userVal = fillInput.value.trim().toUpperCase();
    const isCorrect = userVal === q.correctAnswer.toUpperCase();

    fillInput.disabled = true;
    submitFillBtn.disabled = true;

    if (isCorrect) {
        fillInput.style.borderColor = '#22c55e';
        score++;
        liveScore.textContent = score;
        showFeedback('correct', '✓ Correct! Well done!');
    } else {
        fillInput.style.borderColor = '#e94560';
        showFeedback('wrong', `✗ Wrong! The answer is: ${q.correctAnswer}`);
    }
    userAnswers.push(isCorrect ? 'correct' : 'wrong');
    nextBtn.classList.remove('hide');
};

function showFeedback(type, msg) {
    feedbackBox.textContent = msg;
    feedbackBox.className = `feedback-box ${type}`;
}

function disableOptions() {
    document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
    fillInput.disabled = true;
    submitFillBtn.disabled = true;
}

nextBtn.onclick = function() {
    currentIndex++;
    if (currentIndex < questions.length) {
        loadQuestion();
    } else {
        showResults();
    }
};

function showResults() {
    clearInterval(timerInterval);
    progressBar.style.width = '100%';
    showScreen(resultScreen);

    document.getElementById('final-score').textContent = score;
    const pct = (score / questions.length) * 100;
    const ring = document.getElementById('score-ring-fill');
    setTimeout(() => {
        ring.style.strokeDashoffset = 314 - (314 * pct / 100);
    }, 300);

    const resultEmoji = document.getElementById('result-emoji');
    const resultTitle  = document.getElementById('result-title');
    const resultSub    = document.getElementById('result-subtitle');

    if (pct === 100) { resultEmoji.textContent = '🏆'; resultTitle.textContent = 'Perfect Score!'; resultSub.textContent = 'You answered everything correctly!'; }
    else if (pct >= 60) { resultEmoji.textContent = '🎉'; resultTitle.textContent = 'Great Job!'; resultSub.textContent = 'You did really well!'; }
    else { resultEmoji.textContent = '😅'; resultTitle.textContent = 'Keep Practicing!'; resultSub.textContent = 'Try again to beat your score!'; }

    const summary = document.getElementById('answer-summary');
    summary.innerHTML = '';
    userAnswers.forEach((ans, i) => {
        const dot = document.createElement('div');
        dot.className = `answer-dot ${ans === 'correct' ? 'c' : ans === 'timeout' ? 't' : 'w'}`;
        dot.textContent = ans === 'correct' ? '✓' : ans === 'timeout' ? '⏰' : '✗';
        dot.title = `Q${i + 1}: ${ans}`;
        summary.appendChild(dot);
    });
}

startBtn.onclick = startQuiz;
restartBtn.onclick = () => { showScreen(startScreen); };
startScreen.style.display = 'flex';
