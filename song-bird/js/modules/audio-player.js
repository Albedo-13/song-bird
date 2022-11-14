function loadAudioPlayerControls(selector) {
  const audioPlayer = document.querySelector(selector);
  const audioSrc = audioPlayer.querySelector("audio");

  const playBtn = audioPlayer.querySelector(".audio-play-btn");
  const playBtnImage = playBtn.querySelector("img");

  const audioTimebar = audioPlayer.querySelector(".audio-timebar");
  const audioInfo = audioPlayer.querySelector(".audio-time");

  const audioVolumeBtn = audioPlayer.querySelector(".audio-volume-btn");
  const audioVolumeImg = audioVolumeBtn.querySelector("img");
  const audioVolumeBar = document.querySelector(".audio-volume-bar input");


  audioSrc.addEventListener('loadeddata', () => {
    audioInfo.querySelectorAll("span")[0].innerHTML = "0:00";
    audioInfo.querySelectorAll("span")[1].innerHTML = convertDurationToTime(audioSrc.duration);
  });

  playBtn.addEventListener('click', () => {
    if (audioSrc.paused) {
      audioSrc.play();
      playBtnImage.src = './assets/icons/pause.svg';
    } else if (audioSrc.played) {
      audioSrc.pause();
      playBtnImage.src = './assets/icons/play.svg';
    }
  });

  audioTimebar.addEventListener('input', () => {
    audioSrc.pause();
    playBtnImage.src = './assets/icons/play.svg';

    audioSrc.currentTime = ((audioTimebar.value / 100) * audioSrc.duration);
  });

  audioVolumeBtn.addEventListener('click', () => {
    if (audioSrc.muted) {
      audioVolumeImg.src = './assets/icons/volume-medium.svg';
    } else {
      audioVolumeImg.src = './assets/icons/volume-mute.svg';
    }

    audioSrc.muted = !audioSrc.muted;
  });

  audioVolumeBar.addEventListener('input', () => {
    audioSrc.volume = parseFloat(audioVolumeBar.value / 100);
  });

  setInterval(() => {
    audioTimebar.value = audioSrc.currentTime / audioSrc.duration * 100;

    audioInfo.querySelectorAll("span")[0].innerHTML = convertDurationToTime(audioSrc.currentTime);
  }, 500);

  // 132.5 = 2:12
  function convertDurationToTime(time) {
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    if (seconds < 10) {
      seconds = "0" + seconds;
    }

    return `${minutes}:${seconds}`;
  }
}

export default loadAudioPlayerControls;