const APILINK = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=b4ffaa5f47612a25d7745977eba32e41&page=1';
const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?&api_key=b4ffaa5f47612a25d7745977eba32e41&query=";

const main = document.getElementById("section");
const form = document.getElementById("form");
const search = document.getElementById("query");

function displayMovies(movies) {
  main.innerHTML = ''; // Clear existing content
  movies.forEach(element => {
    const divCard = document.createElement('div');
    divCard.className = 'card';

    const divRow = document.createElement('div');
    divRow.className = 'row';

    const divColumn = document.createElement('div');
    divColumn.className = 'column';

    const image = document.createElement('img');
    image.className = 'thumbnail';
    image.src = IMG_PATH + element.poster_path;

    const title = document.createElement('h3');
    title.className = 'movie-title';
    title.innerHTML = `
      ${element.title}<br>
      <a href="movie.html?id=${element.id}&title=${element.title}" style="color: lightblue; font-size: 15px; padding: 8px;">reviews</a>
    `;

    const center = document.createElement('center');
    center.appendChild(image);

    divCard.appendChild(center);
    divCard.appendChild(title);
    divColumn.appendChild(divCard);
    divRow.appendChild(divColumn);
    main.appendChild(divRow);
  });
}

function fetchMovies(url) {
  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    })
    .then(data => displayMovies(data.results))
    .catch(error => {
      console.error('Fetch error:', error);
      main.innerHTML = '<p>Failed to load movies. Please try again later.</p>';
    });
}

// Initial load
fetchMovies(APILINK);

// Form submission event handler
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchItem = search.value.trim();
  if (searchItem) {
    fetchMovies(SEARCHAPI + encodeURIComponent(searchItem));
    search.value = "";
  }
});
