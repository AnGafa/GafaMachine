const Discord = require('discord.js');
const {prefix, token} = require('./config.json');
const client = new Discord.Client();

// Import node js fs module.
var fs = require('fs');

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
		//#66ff33
		// fs.readFile("movielist.txt", "utf8", async function(err, contents){
		// 	await message.channel.send(contents)
		// 		.then(msg => {
		// 			setTimeout(() => msg.delete(), 300000)
		// 		})
		// 		.catch(/*Your Error handling if the Message isn't returned, sent, etc.*/);
		// });	

		//openFileAsync();
		//await message.channel.send(contents);
	}

	if(command === 'test'){
		message.channel.send({embed: {
			title: 'movie list',
			description: 'movie1 movie 2'
		  }})
	}
})

async function openFileAsync(contents)
{
	var contents;
	fs.readFile("movielist.txt", "utf8", function(err, contents){
		return contents
	});	
	return contents
}

client.login(token);