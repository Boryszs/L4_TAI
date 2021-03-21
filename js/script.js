let preQuestions = null;
let answerUser = [];
let reverse_counter = 20;

let question = document.querySelector('.question');
let answers = document.querySelectorAll('.list-group-item');

let pointsElem = document.querySelector('.score');
let restart = document.querySelector('.restart');
let shows = document.querySelector('.shows');
let results = document.querySelector('.results');
let userScorePoint = document.querySelector('.userScorePoint');
let average = document.querySelector('.average');
let list = document.querySelector('.list');
let score = document.querySelector('.scors');
let index = 0;
let points = 0;
let nrQuestion = document.querySelector('#nr-question');
let qtBar = document.querySelector('.qt-bar');

let averagePoint = document.querySelector('.averagePoint');
let averagePercent = document.querySelector('.averagePercent');

fetch('https://quiztai.herokuapp.com/api/quiz')
    .then(resp => resp.json())
    .then(resp => {
        preQuestions = _.shuffle(resp);
        activateAnswers();
        start_countdown();
        setQuestionBox();
        setQuestion(0);
        barAnswer();
    });

function setQuestionBox() {
    for (let i = 0; i < preQuestions.length; i++) {
        answerUser.push({nr: -1, style: "box-question"});
    }
}

function barAnswer() {
    let bar = "<div class=boxes>";
    for (let i = 0; i < preQuestions.length; i++) {
        bar += "<div class = 'boxe " + answerUser[i].style + "'></div>";
    }
    bar += "</div>";
    qtBar.innerHTML = bar;
}

function activateAnswers() {
    for (let i = 0; i < answers.length; i++) {
        answers[i].addEventListener('click', doAction);
    }
}

function showSolutionQuestion() {

    if (score.style.display === 'block') {
        score.style.display = 'none';
    } else {
        score.style.display = 'block';
    }

    let questionsShow = "<ul class=list-group>";
    for (let i = 0; i < preQuestions.length; i++) {
        questionsShow += "<span>Question:" + (i + 1) + "</span> <h4>" + preQuestions[i].question + "</h4>";

        for (let j = 0; j < preQuestions[i].answers.length; j++) {
            if (answerUser[i].nr === j) {
                questionsShow += "<li class='list-group-item " + answerUser[i].style + "'>" + preQuestions[i].answers[j] + "</li>";
            } else {
                questionsShow += "<li class=list-group-item>" + preQuestions[i].answers[j] + "</li>";
            }
        }

    }
    questionsShow += "</ul>"
    score.innerHTML = questionsShow;
}

function doAction(event) {
    //event.target - Zwraca referencję do elementu, do którego zdarzenie zostało pierwotnie wysłane.
    if (event.target.innerHTML === preQuestions[index].correct_answer) {
        points++;
        pointsElem.innerText = points;
        answerUser[index].style = 'correct';
        answerUser[index].nr = parseInt(event.target.id);
    } else {
        answerUser[index].style = 'incorrect';
        answerUser[index].nr = parseInt(event.target.id);
    }

    disableAnswers();
    nextQuestion()
}


function disableAnswers() {
    for (let i = 0; i < answers.length; i++) {
        answers[i].removeEventListener('click', doAction);
    }
}

function start_countdown() {

    let downloadTimer = setInterval(function () {
        document.getElementById("pbar").value = 20 - --reverse_counter;
        if (reverse_counter <= 0) {
            nextQuestion();
        } else if (index === preQuestions.length) {
            clearInterval(downloadTimer);
        }
    }, 1000);
}

function changeColorBar(index) {
    if (index > 0) {
        answerUser[index - 1].style === "box-current" ? answerUser[index - 1].style = "box-question" : answerUser[index - 1].style;
    }
    if (index === preQuestions.length) {
        return;
    }
    answerUser[index].style = "box-current";
}


function setQuestion(index) {

    changeColorBar(index);

    nrQuestion.innerText = index + 1;
    question.innerHTML = preQuestions[index].question;

    answers[0].innerHTML = preQuestions[index].answers[0];
    answers[1].innerHTML = preQuestions[index].answers[1];
    answers[2].innerHTML = preQuestions[index].answers[2];
    answers[3].innerHTML = preQuestions[index].answers[3];

    if (preQuestions[index].answers.length === 2) {
        answers[2].style.display = 'none';
        answers[3].style.display = 'none';
    } else {
        answers[2].style.display = 'block';
        answers[3].style.display = 'block';
    }
}

function nextQuestion() {
    reverse_counter = 21;
    index++;
    if (preQuestions.length <= index) {
        let obj = JSON.parse(localStorage.getItem("value"));

        if (obj === null) {
            localStorage.setItem("value", JSON.stringify({count: 0, average: 0}));
            obj = JSON.parse(localStorage.getItem("value"));
        }

        obj.count = obj.count + 1;
        obj.average = Math.round((obj.average + points));

        localStorage.setItem("value", JSON.stringify(obj));
        list.style.display = 'none';
        results.style.display = 'block';

        changeColorBar(index);
        barAnswer();

        userScorePoint.innerHTML = points;
        average.innerText = (((parseFloat(points) / 20) * 100).toFixed(2)).toString();
        averagePoint.innerHTML = (Math.round((obj.average / (obj.count * preQuestions.length)) * 20)).toFixed(2);
        averagePercent.innerHTML = (Math.round((obj.average / (obj.count * preQuestions.length)) * 100)).toFixed(2);
    } else {
        setQuestion(index);
        activateAnswers();
        barAnswer();
    }
}

shows.addEventListener('click', function () {
    showSolutionQuestion();
});

restart.addEventListener('click', function (event) {
    event.preventDefault();
    score.style.display = 'none';
    list.style.display = 'block';
    results.style.display = 'none';
    index = 0;
    points = 0;
    let userScorePoint = document.querySelector('.score');
    userScorePoint.innerHTML = points.toString();
    activateAnswers();
    answerUser = [];
    setQuestionBox();
    setQuestion(index);
    barAnswer();
    start_countdown()
});
