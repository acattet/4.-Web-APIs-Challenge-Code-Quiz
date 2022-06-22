/*
GIVEN I am taking a code quiz
WHEN I click the start button
THEN a timer starts and I am presented with a question
WHEN I answer a question
THEN I am presented with another question
WHEN I answer a question incorrectly
THEN time is subtracted from the clock
WHEN all questions are answered or the timer reaches 0
THEN the game is over
WHEN the game is over
THEN I can save my initials and score
*/

//list of QuerySelectors
var bodyEl = document.querySelector("body");
var timerEl = document.querySelector("#timer");
var startingPageEl = document.querySelector("#starting-page");
var questionContainerEl = document.querySelector("#question-container");
var checkAnswerEl = document.createElement("h2");
var finishScreenEl = document.querySelector("#finish-screen");
var scoreEl = document.querySelector("#score");
var formEl = document.querySelector("#submit-score");
var highScoreEl = document.querySelector("#high-scores");
var scoreListEl = document.querySelector("#score-list");

//questions pulled from assignment example
var questionContent = [
    "<h1>Commonly used data types do not include:</h1><ul><li class='wrong'>1. strings</li><li class='correct'>2. alerts</li><li class='wrong'>3. booleans</li><li class='wrong'>4. numbers</li></ul>",
    "<h1>A very useful tool used during development and debugging for printing content to the debugger is:</h1><ul><li class='wrong'>1. JavaScript</li><li class='wrong'>2. terminal / bash</li><li class='wrong'>3. for loops</li><li class='correct'>4. console.log</li></ul>",
    "<h1>Arrays in JavaScript can be used to store ________.</h1><ul><li class='wrong'>1. numbers and strings</li><li class='wrong'>2. other arrays</li><li class='wrong'>3. booleans</li><li class='correct'>4. all of the above</li></ul>",
    "<h1>String values must be enclosed within ________ when being assigned to variables.</h1><ul><li class='wrong'>1. commas</li><li class='wrong'>2. curly brackets</li><li class='correct'>3. quotes</li><li class='wrong'>4. parentheses</li></ul>",
    "<h1>The condition in an if / else statement is enclosed with ________.</h1><ul><li class='wrong'>1. quotes</li><li class='wrong'>2. curly brackets</li><li class='correct'>3. parentheses</li><li class='wrong'>4. square brackets</li></ul>"
];
var scores = [];
var scoreIdCounter = 0;
var questionNumber = 1;
var timeLeft = 0;
var finalScore = 0;


//button events
var buttonHandler = function(event) {
    var targetEl = event.target;

    if (targetEl.matches("#view-high-scores") && (startingPageEl.className === "display-none" && highScoreEl.className === "display-none")) {
       
    }
   //start quiz
    else if (targetEl.matches("#start")) {
        startingPageEl.className = "display-none";
        questionContainerEl.classList.remove("display-none");
        timeLeft = 75;
        timerEl.textContent = timeLeft;
        timer();
        quizHandler();
    }
    //effects of correct
    else if (targetEl.matches(".correct")) {
        checkAnswerEl.remove();
        questionNumber++;
        quizHandler();
        checkAnswerEl.textContent = "Correct!";
        questionContainerEl.appendChild(checkAnswerEl);
    }
    //effects of wrong
    else if (targetEl.matches(".wrong")) {
        checkAnswerEl.remove();
        questionNumber++;
        timeLeft = timeLeft - 10;
        quizHandler();
        checkAnswerEl.textContent = "Wrong!";
        questionContainerEl.appendChild(checkAnswerEl);
    }
};


//quiz events
var quizHandler = function() {
    if (questionNumber <= questionContent.length) {
        questionContainerEl.innerHTML = questionContent[questionNumber - 1];
    }
    else {
        finalScore = timeLeft;
        timeLeft = 0;
        questionNumber = 1;
        questionContainerEl.className = "display-none";
        finishScreenEl.classList.remove("display-none");
        scoreEl.textContent = finalScore;
    }
};

//timer behavior
var timer = function() {
    var timeInterval = setInterval(function() {
        if (timeLeft > 0) {
            timerEl.textContent = timeLeft;
            timeLeft--;
        }
        else {
            timerEl.textContent = 0;
            questionNumber = 1;
            questionContainerEl.className = "display-none";
            finishScreenEl.classList.remove("display-none");
            clearInterval(timeInterval);
        }
    }, 1000);
};

//score submission
var submitScore = function() {
    event.preventDefault();
    var nameInput = document.querySelector("input[name='name']").value;

    var scoreItem = {
        name: nameInput,
        score: finalScore
    };

    finishScreenEl.className = "display-none";
    highScoreEl.classList.remove("display-none");

    createScoreItem(scoreItem);
};

var createScoreItem = function(scoreItem) {
    var scoreItemEl = document.createElement("li");
    scoreItemEl.setAttribute("score-id", scoreIdCounter);
    scoreItemEl.textContent = scoreItem.name + " - " + scoreItem.score;
    scoreListEl.appendChild(scoreItemEl);

    scores.push(scoreItem);
    scoreIdCounter++;

    saveScores();
};
//save score to local
var saveScores = function() {
    localStorage.setItem("scores", JSON.stringify(scores));
};
//load score from local
var loadScores = function() {
    var savedScores = localStorage.getItem("scores");
    if (!savedScores) {
        return false;
    }

    savedScores = JSON.parse(savedScores);

    for (var i = 0; i < savedScores.length; i++) {
        createScoreItem(savedScores[i]);
    }
};

bodyEl.addEventListener("click", buttonHandler);
formEl.addEventListener("submit", submitScore);
loadScores();