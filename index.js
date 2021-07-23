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
				description: movielist.movies.categories.horror.join("\n"),
				timestamp: new Date(),
				footer: {
					icon_url: client.user.displayAvatarURL(),
					text: 'Andrea Gafa'
				}
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
				description: movielist.movies.categories.comedy.join("\n"),
				timestamp: new Date(),
				footer: {
					icon_url: client.user.displayAvatarURL(),
					text: 'Andrea Gafa'
				}
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
				description: movielist.movies.categories.action.join("\n"),
				timestamp: new Date(),
				footer: {
					icon_url: client.user.displayAvatarURL(),
					text: 'Andrea Gafa'
				}
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
				description: movielist.movies.categories.horror.join("\n") + "\n" + movielist.movies.categories.comedy.join("\n") + "\n" + movielist.movies.categories.action.join("\n"),
				timestamp: new Date(),
				footer: {
					icon_url: client.user.displayAvatarURL(),
					text: 'Andrea Gafa'
				}
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
				description: movielist.seen.join("\n"),
				timestamp: new Date(),
				footer: {
					icon_url: client.user.displayAvatarURL(),
					text: 'Andrea Gafa'
				}
			  }})
				.then(msg => {
					setTimeout(() => msg.delete(), 300000)
				})
				.catch(/*Your Error handling if the Message isn't returned, sent, etc.*/);
		}else if(args[0] === "add")
		{
			if(args[1] === "horror")
			{
				writejsonfile("horror", args.slice(2).join(' '));
				message.react('👍');
			}else if(args[1] === "comedy")
			{
				writejsonfile("comedy", args.slice(2).join(' '));
				message.react('👍');
			}else if(args[1] === 'action')
			{
				writejsonfile("action", args.slice(2).join(' '));
				message.react('👍');
			}
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
	}

	if(command === 'test'){
		
		const reason = args.slice(2).join(' ');
		console.log(reason);
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

function writejsonfile(category, movie)
{
	var fs = require('fs');
	var obj = {movies: {categories: {horror:[],comedy:[],action:[]}}};

	fs.readFile('movies.json', 'utf8', function readFileCallback(err, data){
		if (err){
			console.log(err);
		} else {
		obj = JSON.parse(data); //now its an object
		var id = obj.id;
		obj.movies.categories[category].push({id: id, name: movie.toUpperCase()}); //add some data
		obj.id = id+1;
		json = JSON.stringify(obj); //convert it back to json
		fs.writeFile('movies.json', json, (err) => {
			if (err) throw err;
			console.log('movie file overwritten');
		  });
	}});
}

client.login(token);