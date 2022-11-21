import birdsData from "./birds";
import loadAudioPlayerControls from "./modules/audio-player";
import {
  changeQuizQuestion,
  changeQuizQuestionAnswered,
  generateQuizOptions,
  generateInstruction,
  generateBirdCard,
  generateWinWindow
} from "./modules/generate-dom";

document.addEventListener('DOMContentLoaded', () => {

  console.log("Самооценка: 250/270 (не реализован Extra scope -20). Остальные задачи выполнены в соответствии с условием");

  const pagination = document.querySelector('.header-pagination');
  const startBtn = document.querySelector('.start-game-btn');
  const nextLevelBtn = document.querySelector('.next-level-btn');

  let quizPage = 0,
      score = 0,
      maxScoreOnPage = birdsData[0].length - 1,
      correntAnswerNumber = randomNumber(birdsData[0].length);

  const scoreSelector = document.querySelector(".score-number"),
        modalStart = document.querySelector(".quiz-start"),
        quizWin = document.querySelector(".quiz-win"),
        birdsQuestion = document.querySelector(".bird-question-container"),
        birdsQuiz = document.querySelector(".birds-quiz-container"),
        birdDescr = document.querySelector(".bird-details-container"),
        headerLogo = document.querySelector(".header-logo");

  // Entrance
  (() => {
    birdsQuiz.innerHTML = generateQuizOptions(quizPage);
    changeQuizQuestion(birdsQuestion, quizPage, correntAnswerNumber);
    addAnswersClickEvent();
    disableNextLevelBtn();
  })();

  startBtn.addEventListener('click', () => {
    modalStart.classList.add("hide");
  });

  headerLogo.addEventListener('click', () => {
    handleResetGameBtn();
  });

  nextLevelBtn.addEventListener('click', () => {
    for (let i = 0; i < birdsData.length; i++) {
      if (pagination.children[i].classList.contains("active")) {

        if (i + 1 >= birdsData.length) {
          pagination.children[i].classList.remove("active");
          displayWinMessage();
          return;
        }

        ++quizPage;
        correntAnswerNumber = randomNumber(birdsData[quizPage].length);
        maxScoreOnPage = birdsData[quizPage].length - 1;

        changeQuizQuestion(birdsQuestion, quizPage, correntAnswerNumber);
        birdsQuiz.innerHTML = generateQuizOptions(quizPage);
        birdDescr.innerHTML = generateInstruction();

        addAnswersClickEvent();
        disableNextLevelBtn();

        pagination.children[i].classList.remove("active");
        pagination.children[i + 1].classList.add("active");

        return;
      }
    }
  });

  function disableNextLevelBtn() {
    nextLevelBtn.setAttribute('disabled', '');
  }

  function enableNextLevelBtn() {
    nextLevelBtn.removeAttribute('disabled');
  }

  function addAnswersClickEvent() {
    let answers = document.querySelector(".answers-list");
    answers.addEventListener('mousedown', handleAnswersClickEvent);
    answers.addEventListener('mousedown', handleDescriptionClickEvent);
  }

  function removeAnswersClickEvent() {
    let answers = document.querySelector(".answers-list");
    answers.removeEventListener('mousedown', handleAnswersClickEvent);
  }

  function handleAnswersClickEvent(e) {
    if (e.target.innerText.trim() === birdsData[quizPage][correntAnswerNumber].name) {
      updateScore(false, e.target, true);
      new Audio("./assets/audio/win.mp3").play();
      e.target.classList.add("success");

      birdsQuestion.querySelector("audio").pause();
      birdsQuestion.querySelector(".audio-play-btn img").setAttribute("src", "./assets/icons/play.png");

      changeQuizQuestionAnswered(birdsQuestion, quizPage, correntAnswerNumber);
      removeAnswersClickEvent();
      enableNextLevelBtn();
    } else {
      updateScore(false, e.target, false);
      new Audio("./assets/audio/error.mp3").play();
      e.target.classList.add("error");
    }
    handleDescriptionClickEvent(e);
  }

  function handleDescriptionClickEvent(e) {
    birdDescr.innerHTML = generateBirdCard(quizPage, convertBirdNameToBirdObj(quizPage, e.target.innerText).id - 1);
    loadAudioPlayerControls("#audio-player-card");

    birdsQuestion.querySelector("audio").addEventListener('play', () => {
      birdDescr.querySelector("audio").pause();
      birdDescr.querySelector(".audio-play-btn img").setAttribute("src", "./assets/icons/play.png");
    });

    birdDescr.querySelector("audio").addEventListener('play', () => {
      birdsQuestion.querySelector("audio").pause();
      birdsQuestion.querySelector(".audio-play-btn img").setAttribute("src", "./assets/icons/play.png");
    });
  }

  function handleResetGameBtn() {
    for (let i = 0; i < birdsData.length; i++) {
      if (pagination.children[i].classList.contains("active")) {
        pagination.children[i].classList.remove("active");
      }
    }

    quizPage = 0;
    quizWin.innerHTML = "";
    correntAnswerNumber = randomNumber(birdsData[0].length);

    changeQuizQuestion(birdsQuestion, quizPage, correntAnswerNumber);
    birdsQuiz.innerHTML = generateQuizOptions(quizPage);
    birdDescr.innerHTML = generateInstruction();

    updateScore(true);

    addAnswersClickEvent();
    disableNextLevelBtn();

    nextLevelBtn.classList.remove("hide");
    birdsQuestion.classList.remove("hide");
    pagination.children[0].classList.add("active");
  }

  function displayWinMessage() {
    nextLevelBtn.classList.add("hide");
    birdsQuestion.classList.add("hide");

    birdsQuiz.innerHTML = "";
    birdDescr.innerHTML = "";
    quizWin.innerHTML = generateWinWindow(score, calculateMaxScore());

    document.querySelector(".game-over-btn").addEventListener('click', () => {
      handleResetGameBtn();
    });
  }

  function updateScore(isRefresh, selector, isCorreсtAnswer) {
    if (isRefresh) {
      score = 0;
      maxScoreOnPage = birdsData[0].length - 1;
      scoreSelector.innerText = score;
      return;
    }

    if (selector.classList.contains("error")) {
      return;
    }
    if (isCorreсtAnswer) {
      score += maxScoreOnPage;
      maxScoreOnPage = birdsData[quizPage].length - 1;
      scoreSelector.innerText = score;
      return;
    }
    --maxScoreOnPage;
  }

  function convertBirdNameToBirdObj(page, birdName) {
    for (let i = 0; i < birdsData[page].length; i++) {
      if (birdsData[page][i].name === birdName.trim()) {
        return birdsData[page][i];
      }
    }
    return;
  }

  function randomNumber(max) {
    return Math.floor(Math.random() * max);
  }

  function calculateMaxScore() {
    let result = 0;
    for (let i = 0; i < birdsData.length; i++) {
      for (let j = 0; j < birdsData[i].length - 1; j++) {
        ++result;
      }
    }
    return result;
  }

});