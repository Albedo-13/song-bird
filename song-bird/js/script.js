import birdsData from "./birds";
import loadAudioPlayerControls from "./modules/audio-player";

document.addEventListener('DOMContentLoaded', () => {

  // Ну че, рефакторинг?
  // TODO: по возможности использовать id-шники
  // TODO: скрыть correntAnswerNumber и переработать гибкие числа

  // TODO: дизайн (общий стиль, цветокор, плееры, БЭМ, адаптив, переработать старт окно)
  // TODO: вебпак (генерация, подсчет очков, мб окна)
  // TODO: отдельный текст для победы в 30 баллов (для всех очков)

  const pagination = document.querySelector('.pagination');
  const startBtn = document.querySelector('.start-game-btn');
  const nextLevelBtn = document.querySelector('.next-level-btn');

  let quizPage = 0;
  let score = 0;
  // TODO: гибкое число
  let maxScoreOnPage = birdsData[0].length - 1;
  // TODO: скрыть correntAnswerNumber
  let correntAnswerNumber = randomNumber(birdsData[0].length);

  const scoreSelector = document.querySelector(".score-number");
  const modalStart = document.querySelector(".quiz-start");
  const quizWin = document.querySelector(".quiz-win");
  const birdsQuestion = document.querySelector(".bird-question-container");
  const birdsQuiz = document.querySelector(".birds-quiz-container");
  const birdDescr = document.querySelector(".bird-descr-container");

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

  nextLevelBtn.addEventListener('click', () => {
    for (let i = 0; i < birdsData.length; i++) {
      if (pagination.children[i].classList.contains("active")) {

        if (i + 1 >= birdsData.length) {
          pagination.children[i].classList.remove("active");
          generateWinMessage();
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
      birdsQuestion.querySelector(".audio-play-btn img").setAttribute("src", "./assets/icons/play.svg");

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
      birdDescr.querySelector(".audio-play-btn img").setAttribute("src", "./assets/icons/play.svg");
    });

    birdDescr.querySelector("audio").addEventListener('play', () => {
      birdsQuestion.querySelector("audio").pause();
      birdsQuestion.querySelector(".audio-play-btn img").setAttribute("src", "./assets/icons/play.svg");
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

  function generateWinMessage() {
    nextLevelBtn.classList.add("hide");
    birdsQuestion.classList.add("hide");

    birdsQuiz.innerHTML = "";
    birdDescr.innerHTML = "";

    // TODO: 30 - гибкое число
    quizWin.innerHTML = `
    <div class="jumbotron card game-over">
      <h1 class="display-3 text-center">Поздравляем!</h1>
      <p class="lead text-center">Вы прошли викторину и набрали ${score} из ${calculateMaxScore()} возможных баллов</p>
      <hr class="my-4">
      <button class="btn btn-success btn-next game-over-btn">Попробовать еще раз!</button>
    </div>
    `;

    document.querySelector(".game-over-btn").addEventListener('click', () => {
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
    });
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

  function changeQuizQuestion(selector, page, answerNumber) {
    selector.querySelector("h3").innerText = "******";
    selector.querySelector("img").setAttribute('src', './assets/img/anon-bird.jpg');
    selector.querySelector(".random-audio").innerHTML =
      generateAudioPlayer("audio-player-question", birdsData[page][answerNumber].audio);

    loadAudioPlayerControls("#audio-player-question");
  }

  function changeQuizQuestionAnswered(selector, page, answerNumber) {
    selector.querySelector("h3").innerText = birdsData[page][answerNumber].name;
    selector.querySelector("img").setAttribute('src', birdsData[page][answerNumber].image);
  }

  function generateQuizOptions(page) {
    let answersList = `
      <ul class="answers-list card">
    `;
    birdsData[page].forEach((bird) => {
      answersList += `<li class="answers-list-item"><span class="li-btn"></span>${bird.name}</li>`;
    });

    return answersList += `
      </ul>
    `;

    // return `
    // <ul class="answers-list list-group">
    //   <li class="list-group-item"><span class="li-btn"></span>${birdsData[page][0].name}</li>
    //   <li class="list-group-item"><span class="li-btn"></span>${birdsData[page][1].name}</li>
    //   <li class="list-group-item"><span class="li-btn"></span>${birdsData[page][2].name}</li>
    //   <li class="list-group-item"><span class="li-btn"></span>${birdsData[page][3].name}</li>
    //   <li class="list-group-item"><span class="li-btn"></span>${birdsData[page][4].name}</li>
    //   <li class="list-group-item"><span class="li-btn"></span>${birdsData[page][5].name}</li>
    // </ul>
    // `;
  }

  function generateInstruction() {
    return `
    <div class="bird-details card">
      <div class="card-body" style="display: flex;">
        <p class="instruction" style="display: block;">
          <span>Послушайте плеер.</span>
          <span>Выберите птицу из списка</span>
        </p>
      </div>
    </div>
    `;
  }

  function generateBirdCard(page, id) {
    return `
    <div class="bird-details card">
      <div class="card-body">

        <div class="bird-details-wrapper">
          <div class="bird-image">
            <img src="${birdsData[page][id].image}" alt="${birdsData[page][id].name}">
          </div>
          
          <ul class="bird-details-mod">
            <li class="list-group-item">
              <h4>${birdsData[page][id].name}</h4>
            </li>
            <li class="list-group-item"><span>${birdsData[page][id].species}</span></li>
            <li class="list-group-item">
              <div class="audio-player-1">
                ${generateAudioPlayer("audio-player-card", birdsData[page][id].audio)}
              </div>
            </li>
          </ul>
          
        </div>

        <span class="bird-description">
          <div class="list-group">
            <div>
              ${birdsData[page][id].description}
            </div>
          </div>
        </span>

      </div>
    </div>
    `;
  }

  function generateAudioPlayer(audioPlayerId, audioSource) {
    return `
    <div class="audio-player" id="${audioPlayerId}">
      <audio src="${audioSource}"
      controls></audio>
      <div class="audio-controls">
        <div class="audio-controls-top">
          <div class="audio-play-btn"><img src="./assets/icons/play.svg" alt="play"></div>
          <input type="range" class="audio-timebar" min="0" max="100" step="1" value="0">
      
          <div class="audio-volume">
            <div class="audio-volume-btn">
              <img src="./assets/icons/volume-medium.svg" alt="sound">
            </div>
            <div class="audio-volume-bar">
              <input type="range" min="0" max="100" step="1" value="75">
            </div>
          </div>
        </div>


        <div class="audio-time">
          <span>0:00</span>
          <span>0:00</span>
        </div>
      </div>
    </div>
    `;
  }
});