function getMovieSearch()
{
	movies = [];
	var request = require('request');
	var options = {
		'method': 'GET',
		'url': 'https://imdb-api.com/en/API/SearchMovie/k_iw6gkwfo/inception 2010',
		'headers': {
		}
	};
	request(options, function (error, response) { 
		if (error) throw new Error(error)

		searchMovieJSON(JSON.parse(response.body));
		
	});

	function searchMovieJSON(response)
	{
		parsedResponse = []
		parsedResponse = response;

		console.log(movies);
		for(var i = 0; i < parsedResponse.results.length; i ++)
		{
			movies[i] = response.results[i];
		}
	}
	console.log(movies);
	return movies;
}

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

module.exports = { mainGetMovieData };