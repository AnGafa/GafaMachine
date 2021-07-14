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

	if (command === 'movies'){
		
		fs.readFile("movielist.txt", "utf8", async function(err, contents){
			await message.channel.send({embed: {
				color: '#D733FF',
				title: 'movie list',
				description: contents
			  }})
				.then(msg => {
					setTimeout(() => msg.delete(), 300000)
				})
				.catch(/*Your Error handling if the Message isn't returned, sent, etc.*/);
		});	

		//openFileAsync();
		//await message.channel.send(contents);
	}

	if(command === 'test'){
		readjsonfile(movieArrays);
		
		for(var i = 0; i < horrorArray.length; i++)
		{
			console.log(horrorArray[i]);
		}
	}
})

async function readjsonfile(horrorArray, comedyArray, actionArray)
{
	const fs = require('fs')
	var horrorArray = [];
	var comedyArray = [];
	var actionArray = [];

	fs.readFile(moviefile, 'utf8', (err, jsonString) => {
		if (err) {
			console.log("File read failed:", err)
			return
		}
		try {
			const movies = JSON.parse(jsonString)

			for ( var i = 0; i < movies.movies.categories.horror.length; i++ ) {
				if ( typeof movies.movies.categories.horror[i] == "string" ) {
					horrorArray.push(movies.movies.categories.horror[i]);
				}
			}

			for ( var i = 0; i < movies.movies.categories.comedy.length; i++ ) {
				if ( typeof movies.movies.categories.comedy[i] == "string" ) {
					comedyArray.push(movies.movies.categories.comedy[i]);
				}
			}

			for ( var i = 0; i < movies.movies.categories.action.length; i++ ) {
				if ( typeof movies.movies.categories.action[i] == "string" ) {
					actionArray.push(movies.movies.categories.action[i]);
				}
			}
		}
		catch(err) {
				console.log('Error parsing JSON string:', err)
		}
	})
	return horrorArray, comedyArray, actionArray;
}

client.login(token);