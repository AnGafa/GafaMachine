const fetch = require("node-fetch");

const getData = async url => {
  try {
    const response = await fetch(url);
    const json = await response.json();
	return json;
  } catch (error) {
    console.log(error);
  }
};

async function mainGetMovieData(movieInput)
{
	const url = "https://imdb-api.com/en/API/SearchMovie/k_iw6gkwfo/"+movieInput;

	let json = await getData(url);

	movies = [];
	for(var i = 0; i < json.results.length; i ++)
	{
		movies[i] = json.results[i];
	}
	return movies
}

async function getMovieRating(movieInput)
{
	const url = "https://imdb-api.com/en/API/Ratings/k_iw6gkwfo/"+movieInput;

	let json = await getData(url);

	let movie = [];
	movie = json;
	return movie
}

module.exports = { mainGetMovieData , getMovieRating};