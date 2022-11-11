import birdsData from "./birds";

document.addEventListener('DOMContentLoaded', () => {
  //! TODO: кнопка перезапуска теста на финальном окне
  // (только если не макс 30 баллов)

  // TODO: починить пути к изображениям (open server)
  // С пеликаном не работает изображение
  // TODO: добавить плеер в карточку
  // TODO: переработать имена, вложенности и зависимости
  // TODO: нужно сделать кастомный плеер (rss temp папка)
  // TODO: вебпак
  // TODO: звуковое сопровождение

  // Информация о птице включает: аудиоплеер с записью голоса


  const pagination = document.querySelector('.pagination');
  const startBtn = document.querySelector('.start-game-btn');
  const nextLevelBtn = document.querySelector('.next-level-btn');

  let quizPage = 0;
  // TODO: скрыть correntAnswerNumber
  let correntAnswerNumber = randomNumber(6);
  let score = 0;
  // гибкое число
  let maxScoreOnPage = 5;

  const scoreSelector = document.querySelector(".score__num");
  const modalStart = document.querySelector(".myModal");
  const birdsQuestion = document.querySelector(".random-bird");
  const birdsQuiz = document.querySelector(".birds-quiz");
  const birdDescr = document.querySelector(".bird-descr-container");
  const quizWin = document.querySelector(".quiz-win");

  // Entrance
  birdsQuiz.innerHTML = generateQuizOptions(quizPage);
  generateQuizQuestion(quizPage);
  addAnswersClickEvent();
  disableNextLevelBtn();

  startBtn.addEventListener('click', () => {
    modalStart.classList.add("hide");
  });

  nextLevelBtn.addEventListener('click', () => {
    for (let i = 0; i < pagination.children.length; i++) {
      if (pagination.children[i].classList.contains("active")) {
        console.log(pagination.children[i]);

        if (i + 1 >= pagination.children.length) {
          console.log("ПОБЕДА!");
          pagination.children[i].classList.remove("active");
          generateWinMessage();
          return;
        }

        pagination.children[i].classList.remove("active");
        pagination.children[i + 1].classList.add("active");

        ++quizPage;
        correntAnswerNumber = randomNumber(6);
        birdDescr.innerHTML = generateInstruction();
        birdsQuiz.innerHTML = generateQuizOptions(quizPage);
        generateQuizQuestion(quizPage);
        addAnswersClickEvent();

        disableNextLevelBtn();
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
    answers.addEventListener('click', handleAnswersClickEvent);
    answers.addEventListener('click', handleDescriptionClickEvent);
  }

  function removeAnswersClickEvent() {
    let answers = document.querySelector(".answers-list");
    answers.removeEventListener('click', handleAnswersClickEvent);
  }

  function handleAnswersClickEvent(e) {
    console.log(e.target.innerText);
    if (e.target.innerText.trim() === birdsData[quizPage][correntAnswerNumber].name) {
      e.target.classList.add("success");
      generateQuizQuestionAnswered(quizPage);
      removeAnswersClickEvent();
      enableNextLevelBtn();
      updateScore(true, false);
    } else {
      e.target.classList.add("error");
      updateScore(false, false);
    }
    handleDescriptionClickEvent(e);
  }

  function handleDescriptionClickEvent(e) {
    birdDescr.innerHTML = generateBirdCard(quizPage, getBirdNameReturnBirdObj(quizPage, e.target.innerText).id - 1);
  }

  function updateScore(isCorrentAnswer, isRefresh) {
    if (isRefresh) {
      score = 0;
      maxScoreOnPage = 5;
      scoreSelector.innerText = score;
      return;
    }
    if (isCorrentAnswer) {
      score += maxScoreOnPage;
      maxScoreOnPage = 5;
      scoreSelector.innerText = score;
      return;
    }
    --maxScoreOnPage;
  }

  function getBirdNameReturnBirdObj(page, birdName) {
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

    birdDescr.innerHTML = "";
    birdsQuiz.innerHTML = "";

    // 30 - гибкое число
    quizWin.innerHTML = `
    <div class="jumbotron card game-over">
      <h1 class="display-3 text-center">Поздравляем!</h1>
      <p class="lead text-center">Вы прошли викторину и набрали ${score} из 30 возможных баллов</p>
      <hr class="my-4">
      <button class="btn btn-success btn-next btn-game-over">Попробовать еще раз!</button>
    </div>
    `;

    document.querySelector(".btn-game-over").addEventListener('click', () => {
      quizPage = 0;
      quizWin.innerHTML = "";
      correntAnswerNumber = randomNumber(6);
      birdDescr.innerHTML = generateInstruction();
      birdsQuiz.innerHTML = generateQuizOptions(quizPage);
      generateQuizQuestion(quizPage);
      addAnswersClickEvent();
      updateScore(false, true);

      disableNextLevelBtn();

      nextLevelBtn.classList.remove("hide");
      birdsQuestion.classList.remove("hide");

      // TODO: сброс счета до 0
      pagination.children[0].classList.add("active");
    });
  }

  function generateQuizQuestion(page) {
    birdsQuestion.querySelector("h3").innerText = "******";
    birdsQuestion.querySelector("img").setAttribute('src', '/assets/img/anon-bird.jpg');
    birdsQuestion.querySelector("audio").setAttribute('src', `${birdsData[page][correntAnswerNumber].audio}`);
  }

  function generateQuizQuestionAnswered(page) {
    birdsQuestion.querySelector("h3").innerText = birdsData[page][correntAnswerNumber].name;
    birdsQuestion.querySelector("img").setAttribute('src', birdsData[page][correntAnswerNumber].image);
  }

  function generateQuizOptions(page) {
    // TODO: заменить на цикл
    return `
    <ul class="answers-list list-group">
      <li class="list-group-item"><span class="li-btn"></span>${birdsData[page][0].name}</li>
      <li class="list-group-item"><span class="li-btn"></span>${birdsData[page][1].name}</li>
      <li class="list-group-item"><span class="li-btn"></span>${birdsData[page][2].name}</li>
      <li class="list-group-item"><span class="li-btn"></span>${birdsData[page][3].name}</li>
      <li class="list-group-item"><span class="li-btn"></span>${birdsData[page][4].name}</li>
      <li class="list-group-item"><span class="li-btn"></span>${birdsData[page][5].name}</li>
    </ul>
    `;
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
    <div class="card-body" style="display: flex;">
      <img class="bird-image" src="${birdsData[page][id].image}" alt="${birdsData[page][id].name}">
      <ul class="list-group list-group-flush">
        <li class="list-group-item">
          <h4>${birdsData[page][id].name}</h4>
        </li>
        <li class="list-group-item"><span>${birdsData[page][id].species}</span></li>
        <li class="list-group-item">
        </li>
      </ul>
      <span class="bird-description" style="display: flex;">
        <div class="list-group">
          <div>
            <audio src="${birdsData[page][id].audio}"
              controls></audio>
          </div>
          <div>
            ${birdsData[page][id].description}
          </div>
        </div>
      </span>

    </div>
  </div>
    `;
  }

  // console.log(randomNumber(6));
  // console.log(randomNumber(6));
  // console.log(randomNumber(6));
  // console.log(randomNumber(6));

});