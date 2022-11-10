import birdsData from "./birds";

document.addEventListener('DOMContentLoaded', () => {
  //! TODO: после правильного ответа снимать обр. событий
  //! TODO: Блокировать кнопку Next Level до правильного ответа

  // TODO: переработать имена, вложенности и зависимости
  // TODO: нужно сделать кастомный плеер (rss temp папка)
  // TODO: вебпак

  const pagination = document.querySelector('.pagination');
  const nextLevelBtn = document.querySelector('.next-level');

  nextLevelBtn.addEventListener('click', () => {
    for (let i = 0; i < pagination.children.length; i++) {
      if (pagination.children[i].classList.contains("active")) {
        console.log(pagination.children[i]);

        if (i + 1 >= pagination.children.length) {
          console.log("ПОБЕДА!");
          pagination.children[i].classList.remove("active");

          return;
        }
        pagination.children[i].classList.remove("active");
        pagination.children[i + 1].classList.add("active");

        ++quizPage;
        correntAnswerNumber = randomNumber(6);
        birdDescr.innerHTML = generateBirdCard(quizPage, randomNumber(6));
        birdsQuiz.innerHTML = generateQuizOptions(quizPage);
        generateQuizQuestion(quizPage);
        answersClickEvent();
        // console.log(birdsData[quizPage][2].name);
        return;
      }
    }
  });

  let quizPage = 0;
  // TODO: скрыть correntAnswerNumber
  let correntAnswerNumber = randomNumber(6);
  const birdDescr = document.querySelector(".bird-descr-container");
  const birdsQuiz = document.querySelector(".birds-quiz");
  const birdsQuestion = document.querySelector(".random-bird audio");

  // birdDescr.innerHTML = generateBirdCard(quizPage, randomNumber(6));
  birdsQuiz.innerHTML = generateQuizOptions(quizPage);
  generateQuizQuestion(quizPage);
  answersClickEvent();

  function answersClickEvent() {
    let answers = document.querySelector(".answers-list");
    answers.addEventListener('click', (e) => {
      console.log(e.target.innerText);
      if (e.target.innerText.trim() === birdsData[quizPage][correntAnswerNumber].name) {
        e.target.classList.add("success");
        // TODO: снять обработчики после удачного клика
        // removeEventListener
      } else {
        e.target.classList.add("error");
      }

      birdDescr.innerHTML = generateBirdCard(quizPage, getNameReturnBird(quizPage, e.target.innerText).id - 1);
    });
  }

  function getNameReturnBird(page, birdName) {
    for (let i = 0; i < birdsData[page].length; i++) {
      if (birdsData[page][i].name === birdName.trim()) {
        return birdsData[page][i];
      }
    }
    return;
  }

  function generateQuizQuestion(page) {
    birdsQuestion.setAttribute('src', `${birdsData[page][correntAnswerNumber].audio}`);
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
        ${birdsData[page][id].description}
      </span>
    </div>
  </div>
    `;
  }

  function randomNumber(max) {
    return Math.floor(Math.random() * max);
  }

  // console.log(randomNumber(6));
  // console.log(randomNumber(6));
  // console.log(randomNumber(6));
  // console.log(randomNumber(6));

});