let preQuestions = null;

let next = document.querySelector('.next');
let previous = document.querySelector('.previous');

let question = document.querySelector('.question');
let answers = document.querySelectorAll('.list-group-item');

let pointsElem = document.querySelector('.score');
let restart = document.querySelector('.restart');
let results = document.querySelector('.results');
let userScorePoint = document.querySelector('.userScorePoint');
let average = document.querySelector('.average');
let list = document.querySelector('.list');
let index = 0;
let points = 0;
let nrQuestion = document.querySelector('#nr-question');


fetch('https://quiztai.herokuapp.com/api/quiz')
    .then(resp => resp.json())
    .then(resp => {
        preQuestions = resp;
        setQuestion(0);
    });


function activateAnswers() {
    for (let i = 0; i < answers.length; i++) {
        answers[i].addEventListener('click', doAction);
    }
}
activateAnswers();

function doAction(event) {
    //event.target - Zwraca referencję do elementu, do którego zdarzenie zostało pierwotnie wysłane.
    if (event.target.innerHTML === preQuestions[index].correct_answer) {
        points++;
        pointsElem.innerText = points;
        markCorrect(event.target);
    } else {
        markInCorrect(event.target);
    }
    disableAnswers();
}

function markCorrect(elem) {
    elem.classList.add('correct');
}

function markInCorrect(elem) {
    elem.classList.add('incorrect');
}

function disableAnswers() {
    for (let i = 0; i < answers.length; i++) {
        answers[i].removeEventListener('click', doAction);
    }
}

function setQuestion(index) {
    clearClass();
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


next.addEventListener('click', function () {
    index++;
    if (preQuestions.length  <= index) {
         let obj = JSON.parse(localStorage.getItem("value"));
         if(obj === null){
             localStorage.setItem("value", JSON.stringify({count:0,average:0}));
             obj = JSON.parse(localStorage.getItem("value"));
         }
         obj.count = obj.count+1;
         obj.average = Math.round((obj.average + points));
         localStorage.setItem("value", JSON.stringify(obj));
         console.log(obj)
         list.style.display = 'none';
         results.style.display = 'block';
         userScorePoint.innerHTML = points;
         average.innerText = (Math.round((obj.average / (obj.count * preQuestions.length))*100)).toFixed(2);
    }else{
        setQuestion(index);
        activateAnswers();
    }
});


previous.addEventListener('click', function () {
    index--;
    if (index < 0) {
        index = 0;
        activateAnswers();
    }
    setQuestion(index);
});


function clearClass(){
    for (let i = 0; i < answers.length; i++){
        if(answers[i].classList.contains("correct")){
            answers[i].classList.remove("correct");
        }else if(answers[i].classList.contains("incorrect")){
            answers[i].classList.remove("incorrect");
        }
    }
}

restart.addEventListener('click', function (event) {
    event.preventDefault();

    index = 0;
    points = 0;
    let userScorePoint = document.querySelector('.score');
    userScorePoint.innerHTML = points;
    setQuestion(index);
    activateAnswers();
    list.style.display = 'block';
    results.style.display = 'none';
});
