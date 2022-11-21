import birdsData from "./../birds";
import loadAudioPlayerControls from "./audio-player";

function changeQuizQuestion(selector, page, answerNumber) {
  selector.querySelector(".bird-name-anon").innerText = "******";
  selector.querySelector("img").setAttribute('src', './assets/img/anon-bird.jpg');
  selector.querySelector(".random-audio").innerHTML =
    generateAudioPlayer("audio-player-question", birdsData[page][answerNumber].audio);

  loadAudioPlayerControls("#audio-player-question");
}

function changeQuizQuestionAnswered(selector, page, answerNumber) {
  selector.querySelector(".bird-name-anon").innerText = birdsData[page][answerNumber].name;
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
              <h4 class="bird-name">${birdsData[page][id].name}</h4>
            </li>
            <li class="list-group-item">
              <p class="bird-details-latin">${birdsData[page][id].species}</p>
            </li>
            <li class="list-group-item">
              ${generateAudioPlayer("audio-player-card", birdsData[page][id].audio)}
            </li>
          </ul>
          
        </div>

        <span class="bird-description">
          <p>
            ${birdsData[page][id].description}
          </p>
        </span>

      </div>
    </div>
    `;
}

function generateWinWindow(score, maxScore) {
  return `
  <div class="jumbotron card game-over">
    <h1 class="display-3 text-center">Поздравляем!</h1>
    <p class="lead text-center">Вы прошли викторину и набрали ${score} из ${maxScore} возможных баллов</p>
    <hr class="my-4">
    <button class="game-over-btn">Попробовать еще раз!</button>
  </div>
  `;
}

// not exports
function generateAudioPlayer(audioPlayerId, audioSource) {
  return `
  <div class="audio-player" id="${audioPlayerId}">
    <audio src="${audioSource}"
    controls></audio>
    <div class="audio-controls">
      <div class="audio-controls-top">
        <div class="audio-play-btn"><img src="./assets/icons/play.png" alt="play"></div>
        <input type="range" class="audio-timebar" min="0" max="100" step="1" value="0">
        <div class="audio-volume">
          <div class="audio-volume-btn">
            <img src="./assets/icons/volume-medium.png" alt="sound">
          </div>
          <div class="audio-volume-bar-container">
            <input class="audio-volume-bar" type="range" min="0" max="100" step="1" value="75">
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

export {
  changeQuizQuestion,
  changeQuizQuestionAnswered,
  generateQuizOptions,
  generateInstruction,
  generateBirdCard,
  generateWinWindow
};