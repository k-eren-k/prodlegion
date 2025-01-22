import express from 'express';
import path from 'path';
import axios from 'axios';
import ejs from 'ejs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

const YOUTUBE_API_KEY = 'AIzaSyBztwKjSizMNusXNF2ZuoFk7-8qlELze7o';
const CHANNEL_ID = 'UCQeda7bFrgDob_fpEaJwMoA'; 

app.set("view engine", "ejs");  
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

let videoCache = {
  data: [],
  lastFetched: null,
  expiry: 10 * 60 * 1000 
};

async function fetchYouTubeVideos() {
  if (videoCache.lastFetched && (Date.now() - videoCache.lastFetched < videoCache.expiry)) {
    console.log('Using cached video data');
    return videoCache.data;
  }

  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=50&type=video` // maxResult=50 yapıldı
    );
    const videos = response.data.items.map(item => ({
      title: item.snippet.title,
      videoId: item.id.videoId,
      thumbnail: item.snippet.thumbnails.medium.url,
      description: item.snippet.description
    }));

    videoCache.data = videos;
    videoCache.lastFetched = Date.now();

    return videos;
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return [];
  }
}

// Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/music", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = 15;
  const videos = await fetchYouTubeVideos();
  const totalVideos = videos.length; 
  const totalPages = Math.ceil(totalVideos / perPage); 
  const paginatedVideos = videos.slice((page - 1) * perPage, page * perPage);

  res.render("music", {
    videos: paginatedVideos,
    currentPage: page,
    totalPages: totalPages,
    totalVideos: totalVideos 
  });
}); 

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});