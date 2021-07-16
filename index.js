const Discord = require('discord.js');
const {prefix, token} = require('./config.json');
const client = new Discord.Client();

// Import node js fs module.
var fs = require('fs');

var moviefile = "./movies.json"

const embed = new Discord.MessageEmbed()
	.setColor('#2ECC71')
	.setTitle('some title')
	.setDescription('some description')

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', async message => {
	
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	const args = message.content.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();

    if (command === 'creator') {
		message.channel.send('Andrea Gafa');
	}

	if (command === 'movies')
	{
		if(args[0] === "horror")
		{
			var movielist = [];
			movielist = readjsonfile();
			//console.log(movielist.movies.categories.horror);

			await message.channel.send({embed: {
				color: '#D733FF',
				title: 'Horror movie list',
				description: movielist.movies.categories.horror.join("\n")
			  }})
				.then(msg => {
					setTimeout(() => msg.delete(), 300000)
				})
				.catch(/*Your Error handling if the Message isn't returned, sent, etc.*/);

		}else if(args[0] === "comedy")
		{

			var movielist = [];
			movielist = readjsonfile();

			await message.channel.send({embed: {
				color: '#D733FF',
				title: 'Comedy movie list',
				description: movielist.movies.categories.comedy.join("\n")
			  }})
				.then(msg => {
					setTimeout(() => msg.delete(), 300000)
				})
				.catch(/*Your Error handling if the Message isn't returned, sent, etc.*/);

		}else if(args[0] === "action")
		{
			var movielist = [];
			movielist = readjsonfile();

			await message.channel.send({embed: {
				color: '#D733FF',
				title: 'Action movie list',
				description: movielist.movies.categories.action.join("\n")
			  }})
				.then(msg => {
					setTimeout(() => msg.delete(), 300000)
				})
				.catch(/*Your Error handling if the Message isn't returned, sent, etc.*/);

		}else if(args[0] === undefined)
		{		
			var movielist = [];
			movielist = readjsonfile();

			await message.channel.send({embed: {
				color: '#D733FF',
				title: 'Movie list',
				description: movielist.movies.categories.horror.join("\n") + "\n" + movielist.movies.categories.comedy.join("\n") + "\n" + movielist.movies.categories.action.join("\n")
			  }})
				.then(msg => {
					setTimeout(() => msg.delete(), 300000)
				})
				.catch(/*Your Error handling if the Message isn't returned, sent, etc.*/);

		}else if(args[0] === "seen")
		{
			var movielist = [];
			movielist = readjsonfile();

			await message.channel.send({embed: {
				color: '#D733FF',
				title: 'Seen movies list',
				description: movielist.seen.join("\n")
			  }})
				.then(msg => {
					setTimeout(() => msg.delete(), 300000)
				})
				.catch(/*Your Error handling if the Message isn't returned, sent, etc.*/);
		}


		// fs.readFile("movielist.txt", "utf8", async function(err, contents){
		// 	await message.channel.send({embed: {
		// 		color: '#D733FF',
		// 		title: 'movie list',
		// 		description: contents
		// 	  }})
		// 		.then(msg => {
		// 			setTimeout(() => msg.delete(), 300000)
		// 		})
		// 		.catch(/*Your Error handling if the Message isn't returned, sent, etc.*/);
		// });	

		//openFileAsync();
		//await message.channel.send(contents);
	}

	if(command === 'test'){
		
		var movies = [];
		movies = readjsonfile();

		console.log("3");
		console.log(movies);
	}
})

function readjsonfile()
{
	const fs = require('fs');
	const path = require('path');

	let rawdata = fs.readFileSync(path.resolve(__dirname, 'movies.json'));
	let movielist = JSON.parse(rawdata);
	return movielist;
}

// async function readjsonfile()
// {
// 	const fs = require('fs')
// 	console.log("1");
	
// 	var movies = [];

// 	movies = await(
// 	fs.readFile(moviefile, 'utf8', (err, jsonString) => {
// 		if (err) {
// 			console.log("File read failed:", err)
// 			return
// 		}
// 		try {
// 			console.log("2");
// 			var movies = JSON.parse(jsonString);
// 		}
// 		catch(err) {
// 				console.log('Error parsing JSON string:', err)
// 		}
// 		return movies;
// 	}))
// }

client.login(token);