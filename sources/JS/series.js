const url =
	"https://api.themoviedb.org/3/discover/tv?include_adult=false&include_null_first_air_dates=false&language=pt-br&page=1&sort_by=popularity.desc";
const urlImage = "https://image.tmdb.org/t/p/w500";
const options = {
	method: "GET",
	headers: {
		accept: "application/json",
		Authorization:
			"Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4NjVjZGJlZjc5ZGM1YTk1NjgwMDUwOTViZmFmNjg4YyIsIm5iZiI6MTczMjA0NjA4My45MDU3NDgxLCJzdWIiOiI2NzFjZGEzZDVkMGRlODkwNDJkOTM2OWIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.m_4XwzqEzzCaNysOx93cO9dhtYSC2jDMKBaij866uJk",
	},
};
const body = document.querySelector("body");

async function takeTheInformationOfAPI() {
	try {
		const response = await fetch(url, options);
		if (response.ok) {
			const responseJson = await response.json();
			return responseJson;
		} else {
			throw new Error("Request Failed");
		}
	} catch (e) {
		console.log("Network: ", e);
	}
}

const movies = [];

function convertString(string){
	let strings = "";
	for(let i in string){
		if(string[i] == "-"){
			strings += "/"
		}else{
			strings += string[i];
		}
	}
	return strings;
}

async function filterTheInformation() {
	const response = await takeTheInformationOfAPI();
	const results = response.results;
	console.log(results[0])
	const maxResults = Math.min(results.length, 20);
	for (let i = 0; i < maxResults; i++) {
		const title = results[i].name;
		const overview = results[i].overview;
		const avarege = results[i].vote_average;
		const image = results[i].poster_path;
		const popularity = results[i].popularity;
		const date = results[i].first_air_date;

		const newObject = {
			title: title,
			image: image,
			avarege: avarege.toFixed(2),
			overview: overview,
			popularity: popularity,
			date: date
		};
		movies.push(newObject);
	}
	return movies;
}

function deleteAll(title, image, avarege, overview,date) {
	body.innerHTML = `
		<div class="solo">
			<div class="left">
				<a href="./series.html" about="minecraft"><img src="./sources/styles/seta.svg"></a>
				<img class="poster" src="${urlImage}${image}" alt="" />
				<p><img src="https://upload.wikimedia.org/wikipedia/commons/5/5b/Rotten_Tomatoes.svg" alt="">${avarege} <span>${date}</span></p>
			</div>
			<div class="right">
				<h1>${title}</h1>
				<p>
					${overview}
				</p>
			</div>
		</div>
	`;
}

async function drawMovies() {
	const moviesData = await filterTheInformation();
	let contador = 0;
	const cols	= Math.floor(moviesData.length / 4);
	
	for (let j = 0; j < cols; j++) {
		const divMovies = document.createElement("div");
		divMovies.className = "movies";
		let i = 0;
		while (i < 4 && contador < moviesData.length) {
			const divFilmes = document.createElement("div");
			const movie = moviesData[contador];

			divFilmes.innerHTML = `
            	<div class="filmes">
                  <img src="${urlImage}${movie.image}" alt="">
                  <div class="textFilmes">
                        <h2>${movie.title}</h2>
                        <p><img src="https://upload.wikimedia.org/wikipedia/commons/5/5b/Rotten_Tomatoes.svg" alt="">${movie.avarege}</p>
                  </div>
            	</div>
			`;

			divFilmes.addEventListener("click", () => {
				deleteAll(
					movie.title,
					movie.image,
					movie.avarege,
					movie.overview,
					convertString(movie.date)
				);
			});

			divMovies.appendChild(divFilmes);
			i++;
			contador++;
		}
		body.appendChild(divMovies);
	}
}

drawMovies();
