const songList = document.querySelector(".song-list");
const footerName = document.querySelector(".footer-name");
const footerSinger = document.querySelector(".footer-singer");
const themeSinger = document.querySelector(".theme-singer");
const themeName = document.querySelector(".theme-name");
const songAudio = document.querySelector(".song-audio");
const playBtn = document.querySelector(".play-btn");
const contentImg = document.querySelector(".song-theme img");
const forwardBtn = document.querySelector(".forward-btn");
const backwarkBtn = document.querySelector(".back-btn");
const shuffleBtn = document.querySelector(".shuffle-btn");
const progressBarSong = document.querySelector(".progressbar-song");
const timeStart = document.querySelector(".time-start");
const timeEnd = document.querySelector(".time-end");
const repeatBtn = document.querySelector(".repeat-btn");
const volume = document.querySelector(".volume-range input");
const volumeIcon = document.querySelector(".volume-icon");
const profileBtn = document.querySelector(".profile-btn");
const favoriteBtn = document.querySelector(".favorite-btn");
const main = document.querySelector(".main");
const favorite = document.querySelector(".favorite");
const favoriteList = document.querySelector(".favorite-item-list");
const favoriteImg = document.querySelector(".favorite-img img");

const themeImg = document.querySelectorAll(".theme-img img");
const navigation = document.querySelectorAll(".navigation a");
SONG_INDEX = 0;
IS_PLAYING = true;
IS_SHUFFLE = false;
IS_TRACKING = true;
IS_REPEAT = false;
IS_MUTE = true;
IS_FAVORITE = false;
// todo load song theme
function handleLoadSong() {
  themeImg.forEach((item) => {
    item.setAttribute("src", dataSong[SONG_INDEX].image);
  });
  themeName.textContent = `now playing: ${dataSong[SONG_INDEX].name}`;
  themeSinger.textContent = dataSong[SONG_INDEX].singer;
  footerName.textContent = dataSong[SONG_INDEX].name;
  footerSinger.textContent = dataSong[SONG_INDEX].singer;

  songAudio.setAttribute("src", `./music/${dataSong[SONG_INDEX].path}`);
}
handleLoadSong();

//todo render bai hat
function rendersong() {
  if (!dataSong) return;
  dataSong.forEach((item, index) => {
    const content = `
        <div  onClick="handleClickSong(${index})" class="song">
        <div class="song-left">
          <div class="img">
            <img src="${item.image}" alt="" />
          </div>
          <div class="info">
            <h1>${item.name}</h1>
            <h3>${item.singer}</h3>
          </div>
        </div>
        <div class="duration">
        <span  onClick="handleAddSong(${index}, this)"  class="duration-heart" ><i class="fa-regular fa-heart"></i></span>

          <span class="duration-time" >${item.duration}</span>
        </div>
      </div>`;
    songList.insertAdjacentHTML("beforeend", content);
  });
}
rendersong();

// todo click vo list bai hat
function handleClickSong(index) {
  const songIndex = index;
  SONG_INDEX = songIndex;
  handleActiveSong();
  IS_PLAYING = true;
  handleLoadSong();
  handlePlayAndPause();
}

//todo active background song list
function handleActiveSong() {
  const songItem = document.querySelectorAll(".song");
  songItem.forEach((item) => item.classList.remove("active"));
  songItem[SONG_INDEX].classList.add("active");
}

// todo play btn
playBtn.addEventListener("click", handlePlayAndPause);
function handlePlayAndPause() {
  if (IS_PLAYING) {
    songAudio.play();
    IS_PLAYING = false;
    handleActiveSong();
    playBtn.innerHTML = `<span>
    <i style="padding-right:2px;" class="fa-solid fa-pause"></i>
    </span>`;
    contentImg.classList.add("active");
  } else {
    songAudio.pause();
    IS_PLAYING = true;
    playBtn.innerHTML = `<span>
    <i  class="fa-solid fa-play"></i>
    </span>`;
    contentImg.classList.remove("active");
  }
}

// todo next btn
forwardBtn.addEventListener("click", handleForwarkBtn);
function handleForwarkBtn() {
  if (IS_SHUFFLE) {
    handleShuffleSong();
  } else {
    SONG_INDEX++;
    if (SONG_INDEX > dataSong.length - 1) {
      SONG_INDEX = 0;
    }
  }
  handleLoadSong();
  handleActiveSong();
  IS_PLAYING = true;
  handlePlayAndPause();
}
//todo pre btn
backwarkBtn.addEventListener("click", handleBackwarkBtn);
function handleBackwarkBtn() {
  if (IS_SHUFFLE) {
    handleShuffleSong();
  } else {
    SONG_INDEX--;
    if (SONG_INDEX < 0) {
      SONG_INDEX = dataSong.length - 1;
    }
  }
  handleLoadSong();
  handleActiveSong();
  IS_PLAYING = true;
  handlePlayAndPause();
}

//todo click shuffle btn
shuffleBtn.addEventListener("click", handleShuffleBtn);
function handleShuffleBtn() {
  if (IS_TRACKING) {
    shuffleBtn.classList.add("active");
    IS_SHUFFLE = true;
    IS_TRACKING = false;
  } else {
    shuffleBtn.classList.remove("active");
    IS_SHUFFLE = false;
    IS_TRACKING = true;
  }
}

// todo active shuffle song
let songListShuffle = [];
function handleShuffleSong() {
  if (songListShuffle.length === dataSong.length - 1) {
    songListShuffle = [];
  }
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * dataSong.length);
  } while (songListShuffle.includes(randomIndex));
  {
    songListShuffle.push(randomIndex);
    SONG_INDEX = randomIndex;
  }
  handleLoadSong();
  handleActiveSong();
}

// todo progressbar
progressBarSong.addEventListener("change", (e) => {
  songAudio.currentTime = e.target.value;
});

setInterval(handleSetProgressBar, 500);
function handleSetProgressBar() {
  const currentTime = songAudio.currentTime;
  const duration = songAudio.duration;

  progressBarSong.max = duration;
  progressBarSong.value = currentTime;

  timeStart.textContent = handleFormatTime(currentTime);
  if (!duration) {
    timeEnd.textContent = "00:00";
  } else {
    timeEnd.textContent = handleFormatTime(duration);
  }
}
handleSetProgressBar();

function handleFormatTime(number) {
  let minutes = Math.floor(number / 60);
  let seconds = Math.floor(number % 60);
  return `${minutes < 10 ? "0" + minutes : minutes}:${
    seconds < 10 ? "0" + seconds : seconds
  }`;
}

// todo click repeat song
repeatBtn.addEventListener("click", handleRepeatSong);
function handleRepeatSong() {
  repeatBtn.classList.toggle("active");
  IS_REPEAT = true;
}

songAudio.addEventListener("ended", handleNextSong);
function handleNextSong() {
  if (IS_SHUFFLE) {
    handleShuffleSong();
  } else if (IS_REPEAT) {
    IS_PLAYING = true;
    handlePlayAndPause();
  } else {
    SONG_INDEX++;
    if (SONG_INDEX > dataSong.length - 1) {
      SONG_INDEX = 0;
    }
  }
  handleLoadSong();
  handleActiveSong();
  IS_PLAYING = true;
  handlePlayAndPause();
}

// todo handle vo
volumeIcon.addEventListener("click", handleVolume);
function handleVolume() {
  if (IS_MUTE) {
    volumeIcon.innerHTML = `<i class="fa-solid fa-volume-xmark"></i>`;
    volume.value = 0;
    songAudio.volume = 0;
    IS_MUTE = false;
  } else {
    volumeIcon.innerHTML = `<i class="fa-solid fa-volume-hight"></i>`;
    volume.value = 100;
    songAudio.volume = 1;
    IS_MUTE = true;
  }
}

volume.addEventListener("change", function (e) {
  const volumeValue = e.target.value / 100;
  songAudio.volume = volumeValue;
  if (songAudio.volume === 0) {
    volumeIcon.innerHTML = `<i class="fa-solid fa-volume-xmark"></i>`;
  } else {
    volumeIcon.innerHTML = `<i class="fa-solid fa-volume-high"></i>`;
  }
});

// todo add favorite song
let favoriteSongList = JSON.parse(localStorage.getItem("favoriteSongs")) || [];

function handleAddSong(index, element) {
  if (IS_FAVORITE) {
    element.classList.remove("active");
  } else {
    element.classList.add("active");
    const favoriteSong = dataSong[index];
    const isSongInList = favoriteSongList.some(
      (song) => song.name === favoriteSong.name
    );

    if (isSongInList) {
      favoriteSongList = favoriteSongList.filter(
        (song) => song.name !== favoriteSong.name
      );
    } else {
      favoriteSongList.push(favoriteSong);
    }
    localStorage.setItem("favoriteSongs", JSON.stringify(favoriteSongList));
    IS_FAVORITE = false;
    renderFavoriteSong();
  }
}

function renderFavoriteSong() {
  favoriteList.innerHTML = "";
  favoriteSongList.forEach((item, index) => {
    const songName = item.name;
    const template = `            
    <div onClick="handleActiveFavoriteSong(${index})" class="favorite-item-song">
      <span>${index + 1}</span>
      <li>${songName}</li>
      <li>${item.singer}</li>
      <li>${item.duration}</li>
    </div>`;
    favoriteList.insertAdjacentHTML("beforeend", template);
  });
}

function handleActiveFavoriteSong(index) {
  const favoriteSong = favoriteSongList[index];
  localStorage.setItem("currentSong", JSON.stringify(favoriteSong));
  favoriteImg.setAttribute("src", favoriteSong.image);
  SONG_INDEX = index;
  IS_PLAYING = true;
  handleLoadSong();
  handlePlayAndPause();
}

// Load favorite songs from localStorage on page load
renderFavoriteSong();

// todo slidebar btn

navigation.forEach((item) => {
  item.addEventListener("click", () => {
    navigation.forEach((item) => item.classList.remove("active"));
    item.classList.add("active");
  });
});
profileBtn.addEventListener("click", () => {
  main.classList.add("active");
  favorite.classList.remove("active");
});
favoriteBtn.addEventListener("click", () => {
  main.classList.remove("active");
  favorite.classList.add("active");
});
