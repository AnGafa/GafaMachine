const Discord = require('discord.js');
const {prefix, token} = require('./config.json');
const client = new Discord.Client();

// Import node js fs module.
var fs = require('fs');

var moviefile = "./movies.json"

const embed = new Discord.MessageEmbed()

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
			var parselist = [];
			parselist = readjsonfile();
			
			let data = parselist.movies.categories.horror;
			var movielist ="";

			for(i=0; i<data.length; i++)
			{
				movielist = movielist.concat(data[i].id,".\t", data[i].name, "\n");
			}

			embedmsg("horror", movielist, message);
		}else if(args[0] === "comedy")
		{
			var parselist = [];
			parselist = readjsonfile();
			
			let data = parselist.movies.categories.comedy;
			var movielist ="";

			for(i=0; i<data.length; i++)
			{
				movielist = movielist.concat(data[i].id,".\t", data[i].name, "\n");
			}

			embedmsg("comedy", movielist, message);

		}else if(args[0] === "action")
		{
			var parselist = [];
			parselist = readjsonfile();
			
			let data = parselist.movies.categories.action;
			var movielist ="";

			for(i=0; i<data.length; i++)
			{
				movielist = movielist.concat(data[i].id,".\t", data[i].name, "\n");
			}

			embedmsg("action", movielist, message);

		}else if(args[0] === undefined)
		{		
			var parselist = [];
			parselist = readjsonfile();
			
			var movielist ="";
			
			movielist = movielist.concat("--HORROR/THRILLER-- \n");
			for(i=0; i<parselist.movies.categories.horror.length; i++)
			{
				movielist = movielist.concat(parselist.movies.categories.horror[i].id,".\t", parselist.movies.categories.horror[i].name, "\n");
			}
			
			movielist = movielist.concat("\n--COMEDY-- \n");
			for(i=0; i<parselist.movies.categories.comedy.length; i++)
			{
				movielist = movielist.concat(parselist.movies.categories.comedy[i].id,".\t", parselist.movies.categories.comedy[i].name, "\n");
			}
			
			movielist = movielist.concat("\n--ACTION-- \n");
			for(i=0; i<parselist.movies.categories.action.length; i++)
			{
				movielist = movielist.concat(parselist.movies.categories.action[i].id,".\t", parselist.movies.categories.action[i].name, "\n");
			}

			embedmsg("", movielist, message);

		}else if(args[0] === "seen")
		{
			var parselist = [];
			parselist = readjsonfile();
			
			let data = parselist.seen;
			var movielist ="";

			for(i=0; i<data.length; i++)
			{
				movielist = movielist.concat(data[i].id,".\t", data[i].name, "\n");
			}

			embedmsg("seen", movielist, message);
			
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

function embedmsg(category, movielist, message)
{
	message.channel.send({embed: {
		color: '#D733FF',
		title: category+' movie list',
		description: movielist,
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
}

client.login(token);