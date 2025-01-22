let player;
let currentVideoId = "";
let isPlaying = false;
let currentPlayButton = null;
let currentTimer = null;
let allVideoIds = [];

async function fetchAllVideoIds() {
  let page = 1;
  let totalPages;
  let accumulatedVideoIds = [];

  do {
    const response = await fetch(`/music?page=${page}`);
    const html = await response.text();
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    const pageVideoIds = Array.from(
      tempDiv.querySelectorAll(".music-item")
    ).map((item) => item.dataset.videoId);
    accumulatedVideoIds = accumulatedVideoIds.concat(pageVideoIds);

    totalPages = parseInt(
      tempDiv.querySelector(".pagination a:last-child").previousElementSibling
        .textContent
    );
    page++;
  } while (page <= totalPages);

  return accumulatedVideoIds;
}

fetchAllVideoIds().then((ids) => {
  allVideoIds = ids;
  console.log("Tüm video ID'leri:", allVideoIds);
});

function onYouTubeIframeAPIReady() {
  console.log("YouTube Iframe API is ready");
  player = new YT.Player("player", {
    height: "360",
    width: "640",
    videoId: "",
    playerVars: {
      playsinline: 1,
      modestbranding: 1,
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  });
}

function onPlayerReady(event) {
  console.log("Player hazır");
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED) {
    const currentIndex = allVideoIds.indexOf(currentVideoId);
    playNext(currentIndex);
  } else if (event.data === YT.PlayerState.PLAYING) {
    isPlaying = true;
    if (currentPlayButton) {
      currentPlayButton.innerHTML = '<i class="fa-regular fa-stop"></i>';
    }
    startTimer();
  } else if (event.data === YT.PlayerState.PAUSED) {
    isPlaying = false;
    if (currentPlayButton) {
      currentPlayButton.innerHTML = '<i class="fa-regular fa-play"></i>';
    }
    clearInterval(currentTimer);
    currentTimer = null;
  }
}

function togglePlay(videoId, button) {
  if (currentPlayButton && currentPlayButton !== button) {
    currentPlayButton.innerHTML = '<i class="fa-regular fa-play"></i>';
  }
  currentPlayButton = button;

  if (currentVideoId !== videoId) {
    currentVideoId = videoId;
    player.loadVideoById(videoId);
    isPlaying = true;
    button.innerHTML = '<i class="fa-regular fa-stop"></i>';
  } else {
    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  }
}

function playNext(currentIndex) {
  const nextIndex = (currentIndex + 1) % allVideoIds.length;
  const nextVideoId = allVideoIds[nextIndex];
  const nextButton = document.querySelector(
    `.music-item[data-video-id="${nextVideoId}"] .play-button`
  );

  if (nextButton) {
    togglePlay(nextVideoId, nextButton);
  } else {
    const pageOfNextVideo = Math.floor(nextIndex / 15) + 1;
    window.location.href = `/music?page=${pageOfNextVideo}#${nextVideoId}`;
  }
}

function playPrevious(currentIndex) {
  const prevIndex =
    (currentIndex - 1 + allVideoIds.length) % allVideoIds.length;
  const prevVideoId = allVideoIds[prevIndex];
  const prevButton = document.querySelector(
    `.music-item[data-video-id="${prevVideoId}"] .play-button`
  );

  if (prevButton) {
    togglePlay(prevVideoId, prevButton);
  } else {
    const pageOfPrevVideo = Math.floor(prevIndex / 15) + 1;
    window.location.href = `/music?page=${pageOfPrevVideo}#${prevVideoId}`;
  }
}

function startTimer() {
  clearInterval(currentTimer);
  currentTimer = null;

  currentTimer = setInterval(() => {
    const currentTime = player.getCurrentTime();
    if (currentTime >= 30) {
      player.pauseVideo();
      clearInterval(currentTimer);
      currentTimer = null;
    }
  }, 1000);
}
