import birdsData from "./birds";

document.addEventListener('DOMContentLoaded', () => {
  // 1) подтягивать с помощью json-server'а информацию о птицах
  // https://www.udemy.com/course/javascript_full/learn/lecture/19573976#overview
  // 2) и сделать квиз табами?
  // https://getbootstrap.com/docs/5.2/components/navs-tabs/#tabs
  // 3) нужно сделать кастомный плеер (rss temp папка)


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
        birdDescr.innerHTML = generateBirdCard(quizPage, 2);
        
        // console.log(birdsData[quizPage][2].name);
        return;
      }
    }
  });

  let quizPage = 0;
  const birdDescr = document.querySelector(".bird-descr-container");

  birdDescr.innerHTML = generateBirdCard(quizPage, 2);

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
    return Math.floor(Math.random() * max) + 1;
  }

  // console.log(randomNumber(6));
  // console.log(randomNumber(6));
  // console.log(randomNumber(6));
  // console.log(randomNumber(6));

});