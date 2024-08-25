let questions = [];
const questioncount = document.getElementById("QueCount");
let currentQuestion = 0;
let score = 0;
let timer;
let correctCount = 0;
let incorrectCount = 0;

loadQuestions();

function displayCurrentQuestion() {
    const questionElement = document.getElementById("Question");
    const options = document.querySelectorAll("input[name='answer']");

    if (currentQuestion < questions.length) {
        const currentQuestionData = questions[currentQuestion];
        questionElement.textContent = currentQuestionData.question;
        options.forEach((option, index) => {
            option.nextElementSibling.textContent = currentQuestionData.options[index];
        });
        startTimer();
    } else {
        clearInterval(timer);
    }
}

function loadQuestions() {
    if (questions.length === 0) {
        fetch('/get-questions')
            .then((response) => response.json())
            .then((data) => {
                questions = data;
                displayCurrentQuestion();
            })
            .catch((error) => {
                console.error('Error fetching questions:', error);
            });
    }
}

function submitAnswer() {
    const selectedOption = document.querySelector("input[type='radio']:checked");
    if (!selectedOption) {
        incorrectCount++;
    } else {
        const userAnswer = selectedOption.value.trim();
        const currentQuestionData = questions[currentQuestion];
        if (userAnswer === currentQuestionData.correctanswer) {
            correctCount++;
            score++;
        } else {
            incorrectCount++;
        }
        document.getElementById("correct").textContent = correctCount;
        document.getElementById("incorrect").textContent = incorrectCount;
    }

    currentQuestion++;
    questioncount.textContent = currentQuestion + 1;
    if (currentQuestion < questions.length) {
        clearInterval(timer);
        displayCurrentQuestion();
    } else {
        clearInterval(timer);
        displayResultMessage();
    }

    if (selectedOption) {
        selectedOption.checked = false;
    }
}

function startTimer() {
    let timeLeft = 45;
    timer = setInterval(function () {
        document.getElementById("timesec").textContent = timeLeft;
        timeLeft--;
        if (timeLeft < 0) {
            clearInterval(timer);
            submitAnswer();
        }
    }, 1000);
}

function displayResultMessage() {
    const passScore = 11;
    let result;
    const resultModal = document.getElementById("result-modal");
    const resultText = document.getElementById("result-text");
    if (correctCount >= passScore) {
        result = "pass";
        resultText.textContent = "Hurray! You passed the exam.";
    } else {
        result = "fail";
        resultText.textContent = "Sorry, you failed the exam";
    }

    resultModal.style.display = "block";

    const quizResult = {
        count: correctCount,
        result,
    };

    fetch('/save-quiz-result', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(quizResult),
    })
    .catch((error) => {
        console.error('Error submitting quiz result:', error);
    });

    document.getElementById("ok-button").addEventListener("click", function() {
        const resultModal = document.getElementById("result-modal");
        resultModal.style.display = "none";
        window.location.href = '/startover';
    });
}


document.querySelector(".submit-button").addEventListener("click", function () {
    if (currentQuestion === questions.length - 1) {
        submitAnswer();
    } else {
        submitAnswer();
    }
});