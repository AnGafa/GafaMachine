const Discord = require('discord.js');
const { prefix, token } = require('./config.json');

const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

// Import node js fs module.
var fs = require('fs');
const httpsRequest = require("./httpsRequest");
const { channel } = require('diagnostics_channel');
var moviefile = "./movies.json"

const { MessageEmbed } = require('discord.js');

client.once('ready', () => {
	console.log('Ready!');
	client.user.setActivity("!movies commands");
});

client.on('messageCreate', async message => {

	if (!message.content.startsWith(prefix) || message.author.bot) return;
	const args = message.content.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();

	if (command === 'creator') {
		message.channel.send('Andrea Gafa');
	}

	if (command === 'movies') {
		if (args[0] === "horror") {
			var parselist = [];
			parselist = readjsonfile();

			let data = parselist.movies.categories.horror;
			var movielist = "";

			for (i = 0; i < data.length; i++) {
				movielist = movielist.concat(data[i].id, ".\t", data[i].name, "\n");
			}

			embedmsg("horror", movielist, message);
		} else if (args[0] === "comedy") {
			var parselist = [];
			parselist = readjsonfile();

			let data = parselist.movies.categories.comedy;
			var movielist = "";

			for (i = 0; i < data.length; i++) {
				movielist = movielist.concat(data[i].id, ".\t", data[i].name, "\n");
			}

			embedmsg("comedy", movielist, message);

		} else if (args[0] === "action") {
			var parselist = [];
			parselist = readjsonfile();

			let data = parselist.movies.categories.action;
			var movielist = "";

			for (i = 0; i < data.length; i++) {
				movielist = movielist.concat(data[i].id, ".\t", data[i].name, "\n");
			}

			embedmsg("action", movielist, message);

		} else if (args[0] === undefined) {
			var parselist = [];
			parselist = readjsonfile();

			var horrorMovielist = "";
			var comedyMovielist = "";
			var actionMovielist = "";

			for (i = 0; i < parselist.movies.categories.horror.length; i++) {
				horrorMovielist = horrorMovielist.concat(parselist.movies.categories.horror[i].id, ".\t", parselist.movies.categories.horror[i].name, "\n");
			}

			for (i = 0; i < parselist.movies.categories.comedy.length; i++) {
				comedyMovielist = comedyMovielist.concat(parselist.movies.categories.comedy[i].id, ".\t", parselist.movies.categories.comedy[i].name, "\n");
			}

			for (i = 0; i < parselist.movies.categories.action.length; i++) {
				actionMovielist = actionMovielist.concat(parselist.movies.categories.action[i].id, ".\t", parselist.movies.categories.action[i].name, "\n");
			}

			let embed = new MessageEmbed()
				.setColor('#D733FF')
				.setTitle('movie list')
				.addFields({
					name: 'HORROR/THRILLER',
					value: horrorMovielist,
					inline: true,
				},
				{
					name: 'COMEDY',
					value: comedyMovielist,
					inline: true,
				},
				{
					name: 'ACTION',
					value: actionMovielist,
					inline: true,
				})
				.setTimestamp(new Date())
				.setFooter(text = "By Andrea Gafa'")

			message.channel.send({embeds: [embed]})
				.then(msg => {
					setTimeout(() => msg.delete(), 300000)
				})
				.catch(/*Your Error handling if the Message isn't returned, sent, etc.*/);

		} else if (args[0] === "seen") {
			var parselist = [];
			parselist = readjsonfile();

			let data = parselist.seen;
			var movielist = "";

			for (i = 0; i < data.length; i++) {
				movielist = movielist.concat(data[i].name, "\n");
			}
			embedmsg("seen", movielist, message);

		} else if (args[0] === "add") {
			if (args[1] === "horror") {
				writejsonfile("horror", args.slice(2).join(' '));
				message.react('👍');
			} else if (args[1] === "comedy") {
				writejsonfile("comedy", args.slice(2).join(' '));
				message.react('👍');
			} else if (args[1] === 'action') {
				writejsonfile("action", args.slice(2).join(' '));
				message.react('👍');
			} else if (args[1] === 'seen') {
				movetoseen(args[2], message)
			}
		} else if ((args[0] === "commands") || (args[0] === "cmd")) {
			let embed = new MessageEmbed()
				.setColor('#D733FF')
				.setTitle("commands list", "----")
				.addField("!movies", "----")
				.addField("!movies [category]", "----")
				.addField("!movies seen", "----")
				.addField("!movies add [category] [movie name]", "----")
				.addField("!movies add seen [movie id]", "----")
				.addField("!movies check [movie title]", "----")
				.setTimestamp(new Date())
				.setFooter(text = "By Andrea Gafa'")

			message.channel.send({ embeds: [embed] })
				.then(msg => {
					setTimeout(() => msg.delete(), 300000)
				})
				.catch(/*Your Error handling if the Message isn't returned, sent, etc.*/);
		} else if (args[0] === "check") {
			let movies = await httpsRequest.mainGetMovieData(args.slice(1).join(' '));
			if (movies == "")
			{
				message.channel.send("No results found")
					.then(msg => {
						setTimeout(() => msg.delete(), 100000)
					})
				return;
			}else{
				let count = 0;
				if (movies.length % 4 !== 0) {
					i = movies.length + 1;
					b = { title: "N/A", description: "N/A" };
	
					while (movies.length % 4 !== 0) {
						movies.push(b)
						i++;
					}
				}
				movieChoiceEmbed(movies, message, count);
			
				client.on("messageReactionAdd", async (reaction, user) => { // When a reaction is added
					if (user.bot) return;
			
					if (reaction.emoji.name == "⏪") {
						await reaction.message.delete()
							.then()
							.catch(err => { console.error(err); });
						if (count >= 4) {
							count -= 4;
						}
						movieChoiceEmbed(movies, message, count);
					} else if (reaction.emoji.name == "⏩") {
						await reaction.message.delete()
							.then()
							.catch(err => { console.error(err); });
						if (count < (movies.length-4)) {
							count += 4;
						}
						movieChoiceEmbed(movies, message, count);
					}else if (reaction.emoji.name == "❌") {
						await reaction.message.delete()
							.then()
							.catch(err => { console.error(err); });
						return;
					}else if (reaction.emoji.name == "1️⃣") {
						await reaction.message.delete()
							.then()
							.catch(err => { console.error(err); });
						let selectedInfo = movies[count];
						selectedMovieEmbed(selectedInfo, message)
					}else if (reaction.emoji.name == "2️⃣") {
						await reaction.message.delete()
							.then()
							.catch(err => { console.error(err); });
						let selectedInfo = movies[count+1];
						selectedMovieEmbed(selectedInfo, message)
					}else if (reaction.emoji.name == "3️⃣") {
						await reaction.message.delete()
							.then()
							.catch(err => { console.error(err); });
						
						let selectedInfo = movies[count+2];
						selectedMovieEmbed(selectedInfo, message)
					}else if (reaction.emoji.name == "4️⃣") {
						await reaction.message.delete()
							.then()
							.catch(err => { console.error(err); });
						
						let selectedInfo = movies[count+3];
						selectedMovieEmbed(selectedInfo, message)
					}
					return;
				});
			}
		} 
	}else if (command === "amogus") {
		pasta1 = "⣿⣿⣿⠟⢹⣶⣶⣝⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿ ⣿⣿⡟⢰⡌⠿⢿⣿⡾⢹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿ ⣿⣿⣿⢸⣿⣤⣒⣶⣾⣳⡻⣿⣿⣿⣿⡿⢛⣯⣭⣭⣭⣽⣻⣿⣿⣿ ⣿⣿⣿⢸⣿⣿⣿⣿⢿⡇⣶⡽⣿⠟⣡⣶⣾⣯⣭⣽⣟⡻⣿⣷⡽⣿ ⣿⣿⣿⠸⣿⣿⣿⣿⢇⠃⣟⣷⠃⢸⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣽ ⣿⣿⣿⣇⢻⣿⣿⣯⣕⠧⢿⢿⣇⢯⣝⣒⣛⣯⣭⣛⣛⣣⣿⣿⣿⡇ ⣿⣿⣿⣿⣌⢿⣿⣿⣿⣿⡘⣞⣿⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇ ⣿⣿⣿⣿⣿⣦⠻⠿⣿⣿⣷⠈⢞⡇⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇ ⣿⣿⣿⣿⣿⣿⣗⠄⢿⣿⣿⡆⡈⣽⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢻ ⣿⣿⣿⣿⡿⣻⣽⣿⣆⠹⣿⡇⠁⣿⡼⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⣾ ⣿⠿⣛⣽⣾⣿⣿⠿⠋⠄⢻⣷⣾⣿⣧⠟⣡⣾⣿⣿⣿⣿⣿⣿⡇⣿ ⢼⡟⢿⣿⡿⠋⠁⣀⡀⠄⠘⠊⣨⣽⠁⠰⣿⣿⣿⣿⣿⣿⣿⡍⠗⣿ ⡼⣿⠄⠄⠄⠄⣼⣿⡗⢠⣶⣿⣿⡇⠄⠄⣿⣿⣿⣿⣿⣿⣿⣇⢠⣿ ⣷⣝⠄⠄⢀⠄⢻⡟⠄⣿⣿⣿⣿⠃⠄⠄⢹⣿⣿⣿⣿⣿⣿⣿⢹⣿ ⣿⣿⣿⣿⣿⣧⣄⣁⡀⠙⢿⡿⠋⠄⣸⡆⠄⠻⣿⡿⠟⢛⣩⣝⣚⣿ ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⣤⣤⣤⣾⣿⣿⣄⠄⠄⠄⣴⣿⣿⣿⣇⣿ ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⣄⡀⠛⠿⣿⣫⣾⣿"
		pasta2 = "⣿⣿⣿⣿⣿⣿⣿⣿⠿⠛⠋⠉⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠛⠿⣿⣿⣿\
		⣿⣿⣿⣿⣿⣿⠏⠀⢠⣦⡀⣤⣠⡄⢠⠦⡄⣠⠤⠀⣤⠀⡆⣤⣶⡀⠀⠈⠻⣿\
		⣿⣿⣿⣿⣿⣿⠀⠀⠟⠻⠃⠏⠉⠇⠸⠶⠋⠻⠾⠇⠙⠒⠃⠘⠾⠃⠀⠀⢀⣿\
		⣿⣿⣿⣿⣿⣿⣷⣤⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣠⣴⣿⣿\
		⣿⣿⣿⣿⣿⣿⣿⠿⠿⠿⠿⠷⣶⣶⣶⣶⣶⡆⢀⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿\
		⣿⣿⣿⣿⠟⠉⠀⠀⠒⠀⠀⠀⠀⠉⢻⣿⣿⣷⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿\
		⣿⣿⣿⣿⠀⠀⠀⠦⣀⣶⡶⠀⢤⣠⣤⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿\
		⣿⣿⣿⣿⣷⣤⣀⡲⠶⣶⣤⣔⣀⣤⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿\
		⣿⣿⣿⣿⣿⠿⠿⠃⠈⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿\
		⣿⣿⣿⠏⢀⠤⠄⠀⠀⢀⡈⢹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿\
		⣿⣿⡟⠀⠸⠦⣠⠘⠁⢨⠃⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿\
		⣿⣿⠃⠀⠑⠤⠤⠔⠚⢥⣤⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿\
		⣿⡿⠀⠀⠀⣀⣀⡀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿\
		⣿⡇⠀⠀⣰⣿⣿⣿⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿\
		⣿⣧⣀⡀⠉⣻⣿⣧⣤⣤⣤⣤⣽⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿"
		pasta3 = "⠀⠀⠀⠀⠀⢀⣴⡾⠿⠿⠿⠿⢶⣦⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\
		⠀⠀⠀⠀⢠⣿⠁⠀⠀⠀⣀⣀⣀⣈⣻⣷⡄⠀⠀⠀⠀⠀⠀⠀⠀\
		⠀⠀⠀⠀⣾⡇⠀⠀⣾⣟⠛⠋⠉⠉⠙⠛⢷⣄⠀⠀⠀⠀⠀⠀⠀\
		⢀⣤⣴⣶⣿⠀⠀⢸⣿⣿⣧⠀⠀⠀⠀⢀⣀⢹⡆⠀⠀⠀⠀⠀⠀\
		⢸⡏⠀⢸⣿⠀⠀⠀⢿⣿⣿⣷⣶⣶⣿⣿⣿⣿⠃⠀⠀⠀⠀⠀⠀\
		⣼⡇⠀⢸⣿⠀⠀⠀⠈⠻⠿⣿⣿⠿⠿⠛⢻⡇⠀⠀⠀⠀⠀⠀⠀\
		⣿⡇⠀⢸⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣤⣼⣷⣶⣶⣶⣤⡀⠀⠀\
		⣿⡇⠀⢸⣿⠀⠀⠀⠀⠀⠀⣀⣴⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡀\
		⢻⡇⠀⢸⣿⠀⠀⠀⠀⢀⣾⣿⣿⣿⣿⣿⣿⣿⡿⠿⣿⣿⣿⣿⡇\
		⠈⠻⠷⠾⣿⠀⠀⠀⠀⣾⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⢸⣿⣿⣿⣇\
		⠀⠀⠀⠀⣿⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⠃⠀⢸⣿⣿⣿⡿\
		⠀⠀⠀⠀⢿⣧⣀⣠⣴⡿⠙⠛⠿⠿⠿⠿⠉⠀⠀⢠⣿⣿⣿⣿⠇\
		⠀⠀⠀⠀⠀⢈⣩⣭⣥⣤⣤⣤⣤⣤⣤⣤⣤⣤⣶⣿⣿⣿⣿⠏⠀\
		⠀⠀⠀⠀⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠋⠀⠀\
		⠀⠀⠀⢸⣿⣿⣿⡟⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠋⠁⠀⠀⠀⠀\
		⠀⠀⠀⢸⣿⣿⣿⣷⣄⣀⣀⣀⣀⣀⣀⣀⣀⣀⡀⠀⠀⠀⠀⠀⠀\
		⠀⠀⠀⠀⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣦⡀⠀⠀⠀\
		⠀⠀⠀⠀⠀⠈⠛⠿⠿⣿⣿⣿⣿⣿⠿⠿⢿⣿⣿⣿⣿⣿⡄⠀⠀\
		⠀⠀⠀⠀⠀⠀⢀⣀⣀⣀⡀⠀⠀⠀⠀⠀⠀⢀⣹⣿⣿⣿⡇⠀⠀\
		⠀⠀⠀⠀⠀⢰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠁⠀⠀\
		⠀⠀⠀⠀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠛⠁⠀⠀⠀\
		⠀⠀⠀⠀⣿⣿⣿⣿⠁⠀⠀⠀⠀⠀⠉⠉⠁⢤⣤⣤⣤⣤⣤⣤⡀\
		⠀⠀⠀⠀⢿⣿⣿⣿⣷⣶⣶⣶⣶⣾⣿⣿⣿⣆⢻⣿⣿⣿⣿⣿⡇\
		⠀⠀⠀⠀⠈⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⠻⣿⣿⣿⡿⠁\
		⠀⠀⠀⠀⠀⠀⠈⠙⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠉⠀⠙⠛⠉⠀⠀"
		pasta4 = "⡯⡯⡾⠝⠘⠀ ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢊⠘⡮⣣⠪⠢⡑⡌ ㅤ\
		⠟⠝⠈⠀⠀⠀. ⠡⠀⠠⢈⠠⢐⢠⢂⢔⣐⢄⡂⢔⠀⡁⢉⠸⢨⢑⠕⡌ ㅤ ⠀\
		⠀ ⡀⠁⠀⠀⠀⡀⢂⠡⠈⡔⣕⢮⣳⢯⣿⣻⣟⣯⣯⢷⣫⣆⡂ ⢐⠑⡌\
		⢀⠠⠐⠈⠀⢀⢂⠢⡂⠕⡁⣝⢮⣳⢽⡽⣾⣻⣿⣯⡯⣟⣞⢾⢜⢆⠀⡀⠀⠪\
		⣬⠂⠀⠀⢀⢂⢪⠨⢂⠥⣺⡪⣗⢗⣽⢽⡯⣿⣽⣷⢿⡽⡾⡽⣝⢎⠀⠀⠀⢡\
		⣿⠀⠀⠀⢂⠢⢂⢥⢱⡹⣪⢞⡵⣻⡪⡯⡯⣟⡾⣿⣻⡽⣯⡻⣪⠧⠑⠀⠁⢐\
		⣿⠀⠀⠀⠢⢑⠠⠑⠕⡝⡎⡗⡝⡎⣞⢽⡹⣕⢯⢻⠹⡹⢚⠝⡷⡽⡨⠀⠀⢔\
		⣿⡯⠀⢈⠈⢄⠂⠂⠐⠀⠌⠠⢑⠱⡱⡱⡑⢔⠁⠀⡀⠐⠐⠐⡡⡹⣪⠀⠀⢘\
		⣿⣽⠀⡀⡊⠀⠐⠨⠈⡁⠂⢈⠠⡱⡽⣷⡑⠁⠠⠑⠀⢉⢇⣤⢘⣪⢽⠀⢌⢎\
		⣿⢾⠀⢌⠌⠀⡁⠢⠂⠐⡀⠀⢀⢳⢽⣽⡺⣨⢄⣑⢉⢃⢭⡲⣕⡭⣹⠠⢐⢗\
		⣿⡗⠀⠢⠡⡱⡸⣔⢵⢱⢸⠈⠀⡪⣳⣳⢹⢜⡵⣱⢱⡱⣳⡹⣵⣻⢔⢅⢬⡷\
		⣷⡇⡂⠡⡑⢕⢕⠕⡑⠡⢂⢊⢐⢕⡝⡮⡧⡳⣝⢴⡐⣁⠃⡫⡒⣕⢏⡮⣷⡟\
		⣷⣻⣅⠑⢌⠢⠁⢐⠠⠑⡐⠐⠌⡪⠮⡫⠪⡪⡪⣺⢸⠰⠡⠠⠐⢱⠨⡪⡪⡰\
		⣯⢷⣟⣇⡂⡂⡌⡀⠀⠁⡂⠅⠂⠀⡑⡄⢇⠇⢝⡨⡠⡁⢐⠠⢀⢪⡐⡜⡪⡊\
		⣿⢽⡾⢹⡄⠕⡅⢇⠂⠑⣴⡬⣬⣬⣆⢮⣦⣷⣵⣷⡗⢃⢮⠱⡸⢰⢱⢸⢨⢌\
		⣯⢯⣟⠸⣳⡅⠜⠔⡌⡐⠈⠻⠟⣿⢿⣿⣿⠿⡻⣃⠢⣱⡳⡱⡩⢢⠣⡃⠢⠁\
		⡯⣟⣞⡇⡿⣽⡪⡘⡰⠨⢐⢀⠢⢢⢄⢤⣰⠼⡾⢕⢕⡵⣝⠎⢌⢪⠪⡘⡌⠀\
		⡯⣳⠯⠚⢊⠡⡂⢂⠨⠊⠔⡑⠬⡸⣘⢬⢪⣪⡺⡼⣕⢯⢞⢕⢝⠎⢻⢼⣀⠀\
		⠁⡂⠔⡁⡢⠣⢀⠢⠀⠅⠱⡐⡱⡘⡔⡕⡕⣲⡹⣎⡮⡏⡑⢜⢼⡱⢩⣗⣯⣟\
		⢀⢂⢑⠀⡂⡃⠅⠊⢄⢑⠠⠑⢕⢕⢝⢮⢺⢕⢟⢮⢊⢢⢱⢄⠃⣇⣞⢞⣞⢾\
		⢀⠢⡑⡀⢂⢊⠠⠁⡂⡐⠀⠅⡈⠪⠪⠪⠣⠫⠑⡁⢔⠕⣜⣜⢦⡰⡎⡯⡾⡽"
		message.channel.send(pasta4);
	}
})

async function movieChoiceEmbed(movies, message, count) {
	pagecount = count;

	let embed = new MessageEmbed()
		.setColor('#D733FF')
		.setTitle('Choose movie')
		.addFields({
			name: "1️⃣ "+movies[pagecount].title,
			value: movies[pagecount].description,
			inline: true,
		},
		{
			name: "2️⃣ "+movies[pagecount + 1].title,
			value: movies[pagecount + 1].description,
			inline: true,
		},
		{
			name: '\u200b',
			value: '\u200b',
			inline: false,
		},
		{
			name: "3️⃣ "+movies[pagecount + 2].title,
			value: movies[pagecount + 2].description,
			inline: true,
		},
		{
			name: "4️⃣ "+movies[pagecount + 3].title,
			value: movies[pagecount + 3].description,
			inline: true,
		})
		.setTimestamp(new Date())
		.setFooter(text = "By Andrea Gafa'")

	var mg = await message.channel.send({ embeds: [embed] })
		.then(sentEmbed => {
			sentEmbed.react("⏪");
			sentEmbed.react("❌");
			sentEmbed.react("⏩");
			sentEmbed.react("1️⃣");
			sentEmbed.react("2️⃣");
			sentEmbed.react("3️⃣");
			sentEmbed.react("4️⃣");
		})
		.catch();
}

async function selectedMovieEmbed(selectedInfo, message){
	let movie = await httpsRequest.getMovieRating(selectedInfo.id);	

	if(movie.fullTitle == "") 
		movie.fullTitle = "N/A";
	if(movie.imDb == "")
		movie.imDb = "N/A"
	if(movie.metacritic == "")
		movie.metacritic = "N/A"
	if(movie.theMovieDb == "")
		movie.theMovieDb = "N/A"
	if(movie.rottenTomatoes == "")
		movie.rottenTomatoes = "N/A"
	if(movie.filmAffinity == "")
		movie.filmAffinity = "N/A"
	if(selectedInfo.image == "")
		selectedInfo.image = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png"

	let embed = new MessageEmbed()
		.setColor('#D733FF')
		.setTitle(movie.fullTitle)
		.addField("IMDB: ", movie.imDb)
		.addField("Metacritic: ", movie.metacritic)
		.addField("theMovieDb: ", movie.theMovieDb)
		.addField("rottenTomatoes: ", movie.rottenTomatoes)
		.addField("filmAffinity: ", movie.filmAffinity)
		.setImage(selectedInfo.image)
		.setTimestamp(new Date())
		.setFooter(text = "By Andrea Gafa'")

	var mg = await message.channel.send({ embeds: [embed] })
	.then(msg => {
		setTimeout(() => msg.delete(), 300000)
	})
	.catch(/*Your Error handling if the Message isn't returned, sent, etc.*/);
}

function readjsonfile() {
	const fs = require('fs');
	const path = require('path');

	let rawdata = fs.readFileSync(path.resolve(__dirname, 'movies.json'));
	let movielist = JSON.parse(rawdata);
	return movielist;
}

function writejsonfile(category, movie) {
	var fs = require('fs');
	var obj = { movies: { categories: { horror: [], comedy: [], action: [] } } };

	fs.readFile('movies.json', 'utf8', function readFileCallback(err, data) {
		if (err) {
			console.log(err);
		} else {
			obj = JSON.parse(data); //now its an object
			var id = obj.id;
			obj.movies.categories[category].push({ id: id, name: movie.toUpperCase() }); //add some data
			obj.id = id + 1;
			json = JSON.stringify(obj); //convert it back to json
			fs.writeFile('movies.json', json, (err) => {
				if (err) throw err;
				console.log('movie file overwritten');
			});
		}
	});
}

async function embedmsg(category, movielist, message) {

	let embed = new MessageEmbed()
		.setColor('#D733FF')
		.setTitle(category + ' movie list')
		.setDescription(movielist)
		.setTimestamp(new Date())
		.setFooter(text = "By Andrea Gafa'")

		var mg = await message.channel.send({ embeds: [embed] })
		.then(msg => {
			setTimeout(() => msg.delete(), 300000)
		})
		.catch(/*Your Error handling if the Message isn't returned, sent, etc.*/);
}

function movetoseen(id, message) {
	var parsedJSON = [];
	parsedJSON = readjsonfile();

	horrorfilter = parsedJSON.movies.categories.horror;
	comedyfilter = parsedJSON.movies.categories.comedy;
	actionfilter = parsedJSON.movies.categories.action;
	var seenEntry;

	for (var i = 0; i < horrorfilter.length; i++) {
		if (horrorfilter[i].id == id) {
			seenEntry = horrorfilter[i];
			horrorfilter.splice(i, 1);
			break;
		}
	}
	if (seenEntry == null) {
		for (var i = 0; i < comedyfilter.length; i++) {
			if (comedyfilter[i].id == id) {
				seenEntry = comedyfilter[i];
				comedyfilter.splice(i, 1);
				break;
			}
		}
	}
	if (seenEntry == null) {
		for (var i = 0; i < actionfilter.length; i++) {
			if (actionfilter[i].id == id) {
				seenEntry = actionfilter[i];
				actionfilter.splice(i, 1);
				break;
			}
		}
	}
	if (seenEntry == null) {
		message.react('👎');
	} else {
		parsedJSON.seen.push(seenEntry);
		json = JSON.stringify(parsedJSON); //convert it back to json
		fs.writeFile('movies.json', json, (err) => {
			if (err) throw err;
			console.log('movie file overwritten');
		});

		message.react('👍');
	}
}

client.login(token);