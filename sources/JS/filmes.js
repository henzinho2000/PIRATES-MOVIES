const urlBase =
"https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=pt-br&sort_by=popularity.desc";
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
let currentPage = 1; // Página atual da API
let loading = false; // Evita chamadas duplicadas
let currentRow = null; // Linha atual de filmes
const movies = [];

async function fetchMovies(page = 1) {
	const url = `${urlBase}&page=${page}`;
	try {
		const response = await fetch(url, options);
		if (response.ok) {
			const data = await response.json();
			return data.results;
		} else {
			throw new Error("Request Failed");
		}
	} catch (e) {
		console.error("Erro ao buscar filmes:", e);
	}
}
function setString(string){
	let newString = "";
	for (let i in string){
		if(string[i] == "-"){
			newString += "/";
		}else{
			newString += string[i];
		}
	}
	return newString;
}

async function loadMovies() {
	if (loading) return;
	loading = true; // Impede múltiplas chamadas simultâneas
	const results = await fetchMovies(currentPage);
	console.log(results[0])
	if (results) {
		results.forEach((movie, index) => {
			const newObject = {
				title: movie.title,
				image: movie.poster_path,
				avarege: movie.vote_average.toFixed(2),
				overview: movie.overview,
				popularity: movie.popularity,
				date: setString(movie.release_date),
			};
			movies.push(newObject);
			drawMovie(newObject, index);
		});
		currentPage++; // Avança para a próxima página
	}
	loading = false; // Permite novas chamadas
}

function deleteAll(title, image, avarege, overview,date) {
	body.innerHTML = `
		<div class="solo">
			<div class="left">
				<a href="./filmes.html" about="minecraft"><img src="./sources/styles/seta.svg"></a>
				<img class="poster" src="${urlImage}${image}" alt="" />
				<p><img src="https://upload.wikimedia.org/wikipedia/commons/5/5b/Rotten_Tomatoes.svg" alt="">${avarege}    <span>${date}</span></p>
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

function drawMovie(movie, index) {
	// Cria uma nova linha de filmes se necessário
	if (!currentRow || currentRow.childElementCount >= 4) {
		currentRow = document.createElement("div");
		currentRow.className = "movies";
		body.appendChild(currentRow);
	}

	const divFilmes = document.createElement("div");
	divFilmes.className = "filmes";
	divFilmes.innerHTML = `
        <img src="${urlImage}${movie.image}" alt="">
        <div class="textFilmes">
            <h2>${movie.title}</h2>
            <p><img src="https://upload.wikimedia.org/wikipedia/commons/5/5b/Rotten_Tomatoes.svg" alt="">${movie.avarege}</p>
        </div>
    `;

	divFilmes.addEventListener("click", () => {
		deleteAll(
			movie.title,
			movie.image,
			movie.avarege,
			movie.overview,
			movie.date
		);
	});

	currentRow.appendChild(divFilmes);
}

// Detecta fim da página e carrega mais filmes
window.addEventListener("scroll", () => {
	if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !loading) {
		loadMovies();
	}
});

// Inicializa com a primeira página de filmes
loadMovies();
