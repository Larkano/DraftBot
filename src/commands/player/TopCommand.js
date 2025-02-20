import {DraftBotEmbed} from "../../core/messages/DraftBotEmbed";
const Maps = require("../../core/Maps");

module.exports.commandInfo = {
	name: "top",
	aliases: ["t","rank"],
	disallowEffects: [EFFECT.BABY, EFFECT.DEAD]
};

/**
 * Allow to display the rankings of the players
 * @param {module:"discord.js".Message} message - Message from the discord server
 * @param {("fr"|"en")} language - Language to use in the response
 * @param {String[]} args=[] - Additional arguments sent with the command
 */
const TopCommand = async function(message, language, args) {

	const [entity] = await Entities.getOrRegister(message.author.id);

	let rankCurrentPlayer = 0;
	let scoreTooLow = 0;

	let page = parseInt(args[args.length - 1]);
	if (page < 1) {
		page = 1;
	}
	if (isNaN(page)) {
		page = 1;
	}
	if (entity.Player.score <= 100) {
		scoreTooLow = 1;
	}

	// top of the serv
	if (args[0] === "serv" || args[0] === "s") {
		// get all discordID on the server
		const listId = Array.from((await message.guild.members.fetch()).keys());

		const numberOfPlayer = await Entities.count({
			defaults: {
				Player: {
					Inventory: {}
				}
			},
			where: {
				discordUserId: listId
			},
			include: [{
				model: Players,
				as: "Player",
				where: {
					score: {
						[require("sequelize/lib/operators").gt]: 100
					}
				}
			}]
		});

		const allEntities = await Entities.findAll({
			defaults: {
				Player: {
					Inventory: {}
				}
			},
			where: {
				discordUserId: listId
			},
			include: [{
				model: Players,
				as: "Player",
				where: {
					score: {
						[require("sequelize/lib/operators").gt]: 100
					}
				}
			}],
			order: [
				[{model: Players, as: "Player"}, "score", "DESC"],
				[{model: Players, as: "Player"}, "level", "DESC"]
			],
			limit: 15,
			offset: (page - 1) * 15
		});

		if (scoreTooLow === 0) {
			rankCurrentPlayer = (await Entities.getServerRank(message.author.id, listId))[0].rank;
		}

		await displayTop(message, language, numberOfPlayer, allEntities, rankCurrentPlayer, JsonReader.commands.top.getTranslation(language).server, page, scoreTooLow);
	}

	// top general of the week
	else if (args[0] === "week" || args[0] === "w") {
		// rank of the user
		const rankCurrentPlayer = (await Players.getById(entity.Player.id))[0].weeklyRank;
		const numberOfPlayer = await Players.count({
			where: {
				weeklyScore: {
					[require("sequelize/lib/operators").gt]: 100
				}
			}
		});
		const allEntities = await Entities.findAll({
			defaults: {
				Player: {
					Inventory: {}
				}
			},
			include: [{
				model: Players,
				as: "Player",
				where: {
					weeklyScore: {
						[require("sequelize/lib/operators").gt]: 100
					}
				}
			}],
			order: [
				[{model: Players, as: "Player"}, "weeklyScore", "DESC"],
				[{model: Players, as: "Player"}, "level", "DESC"]
			],
			limit: 15,
			offset: (page - 1) * 15
		});

		await displayTop(message, language, numberOfPlayer, allEntities, rankCurrentPlayer, JsonReader.commands.top.getTranslation(language).generalWeek, page, scoreTooLow);
	}

	// top general by a page number
	else {
		// rank of the user
		const rankCurrentPlayer = (await Players.getById(entity.Player.id))[0].rank;

		const numberOfPlayer = await Players.count({
			where: {
				score: {
					[require("sequelize/lib/operators").gt]: 100
				}
			}
		});

		const allEntities = await Entities.findAll({
			defaults: {
				Player: {
					Inventory: {}
				}
			},
			include: [{
				model: Players,
				as: "Player",
				where: {
					score: {
						[require("sequelize/lib/operators").gt]: 100
					}
				}
			}],
			order: [
				[{model: Players, as: "Player"}, "score", "DESC"],
				[{model: Players, as: "Player"}, "level", "DESC"]
			],
			limit: 15,
			offset: (page - 1) * 15
		});

		await displayTop(message, language, numberOfPlayer, allEntities, rankCurrentPlayer, JsonReader.commands.top.getTranslation(language).general, page, scoreTooLow);
	}
};

/**
 * Sends a message with the top
 * @param {module:"discord.js".Message} message
 * @param {"fr"|"en"} language
 * @param {Number} numberOfPlayer
 * @param {*} allEntities
 * @param {string} actualPlayer
 * @param {Number} rankCurrentPlayer
 * @param {string} topTitle
 * @param {Number} page
 * @param {*} scoreTooLow
 * @return {Promise<Message>}
 */

async function displayTop(message, language, numberOfPlayer, allEntities, rankCurrentPlayer, topTitle, page, scoreTooLow) { // eslint-disable-line max-params
	const embedError = new DraftBotEmbed();
	const embed = new DraftBotEmbed();
	const actualPlayer = message.author.username;
	let pageMax = Math.ceil(numberOfPlayer / 15);
	if (pageMax < 1) {
		pageMax = 1;
	}
	if (isNaN(page)) {
		page = 1;
	}
	if (page > pageMax || page < 1) {
		embedError
			.setTitle(format(JsonReader.commands.top.getTranslation(language).maxPageTitle, {
				pseudo: actualPlayer,
				pageMax: pageMax
			}))
			.setDescription(format(JsonReader.commands.top.getTranslation(language).maxPageDesc, {pageMax: pageMax}));
		return await message.channel.send({ embeds: [embedError] });
	}
	const fin = page * 15;
	const debut = fin - 14;
	let messages = "";
	let badge;
	// Indicate which top we are going to display
	embed
		.setTitle(format(topTitle, {debut: debut, fin: fin}));
	// Fetch all server members
	await message.guild.members.fetch();
	// Build a string with 15 players informations
	for (let k = 0; k < allEntities.length; k++) {

		// pseudo of the current player being add to the string
		const pseudo = await allEntities[k].Player.getPseudo(language);
		let badgeState = ":smiley:";

		// badge depending on the rank
		if (page === 1) {
			if (k === 0) {
				badge = JsonReader.commands.top.first;
			}
			else if (k === 1) {
				badge = JsonReader.commands.top.second;
			}
			else if (k === 2) {
				badge = JsonReader.commands.top.third;
			}
			else if (k > 2 && k <= 4) {
				badge = JsonReader.commands.top.military;
			}
		}
		if (page !== 1 || k > 4) {
			if (message.guild.members.cache.find(val => val.id === allEntities[k].discordUserId)) {
				badge = JsonReader.commands.top.blue;
			}
			else {
				badge = JsonReader.commands.top.black;
			}
		}
		if (message.author.id === allEntities[k].discordUserId) {
			badge = JsonReader.commands.top.white;
		}

		// badgeState depending on last report
		// const nowMoment = new moment(new Date());
		// const lastReport = new moment(allEntities[k-1].Player.lastReportAt);
		// const diffMinutes = lastReport.diff(nowMoment, 'millisecondes');
		if (Date.now() < Date.parse(allEntities[k].Player.effectEndDate)) {
			badgeState = allEntities[k].Player.effect;
		}
		else if (allEntities[k].Player.isInactive()) {
			badgeState = ":ghost:";
		}
		else if (await Maps.isArrived(allEntities[k].Player)) {
			badgeState = (await allEntities[k].Player.getDestination()).getEmote(language);
		}
		else {
			badgeState = ":smiley:";
		}
		messages += format(JsonReader.commands.top.getTranslation(language).playerRankLine, {
			badge: badge,
			rank: debut + k,
			pseudo: pseudo,
			badgeState: badgeState !== ":smiley:" ? badgeState + " | " : "",
			score: topTitle === JsonReader.commands.top.getTranslation(language).generalWeek ? allEntities[k].Player.weeklyScore : allEntities[k].Player.score,
			level: allEntities[k].Player.level
		});
	}
	if (topTitle === JsonReader.commands.top.getTranslation(language).generalWeek) {
		embed.setFooter(
			format(
				JsonReader.commands.top.getTranslation(language).nextReset, {time: parseTimeDifference(new Date(), getNextSundayMidnight(), language)}
			), "https://i.imgur.com/OpL9WpR.png"
		);
	}
	embed.setDescription(messages);

	// Define badge for the user
	if (rankCurrentPlayer === 1) {
		badge = ":first_place:";
	}
	else if (rankCurrentPlayer === 2) {
		badge = ":second_place:";
	}
	else if (rankCurrentPlayer === 3) {
		badge = ":third_place:";
	}
	else if (rankCurrentPlayer > 3 && rankCurrentPlayer <= 5) {
		badge = ":military_medal:";
	}
	else {
		badge = ":black_circle:";
	}
	// test if the user has 100 points
	if (scoreTooLow === 1) {
		embed.addField(JsonReader.commands.top.getTranslation(language).yourRanking, format(JsonReader.commands.top.getTranslation(language).lowScore, {
			badge: badge,
			pseudo: actualPlayer,
			totalPlayer: numberOfPlayer,
			pageMax: pageMax
		}));
	}
	// test if user is in the current page displayed to indicate(or not) the page where he can find himself
	else if ((rankCurrentPlayer > fin || rankCurrentPlayer < debut) && rankCurrentPlayer !== 1) {
		embed.addField(JsonReader.commands.top.getTranslation(language).yourRanking, format(JsonReader.commands.top.getTranslation(language).end1, {
			badge: badge,
			pseudo: actualPlayer,
			rank: rankCurrentPlayer,
			totalPlayer: numberOfPlayer,
			page: Math.ceil(rankCurrentPlayer / 15),
			pageMax: pageMax
		}));
	}
	else if ((rankCurrentPlayer > fin || rankCurrentPlayer < debut) && rankCurrentPlayer === 1) {
		embed.addField(JsonReader.commands.top.getTranslation(language).yourRanking, format(JsonReader.commands.top.getTranslation(language).end1Top, {
			pseudo: actualPlayer,
			rank: rankCurrentPlayer,
			totalPlayer: numberOfPlayer,
			page: Math.ceil(rankCurrentPlayer / 15),
			pageMax: pageMax
		}));
	}
	else if ((rankCurrentPlayer <= fin || rankCurrentPlayer >= debut) && rankCurrentPlayer !== 1) {
		embed.addField(JsonReader.commands.top.getTranslation(language).yourRanking, format(JsonReader.commands.top.getTranslation(language).end2, {
			badge: badge,
			pseudo: actualPlayer,
			rank: rankCurrentPlayer,
			totalPlayer: numberOfPlayer
		}));
	}
	else if ((rankCurrentPlayer <= fin || rankCurrentPlayer >= debut) && rankCurrentPlayer === 1) {
		embed.addField(JsonReader.commands.top.getTranslation(language).yourRanking, format(JsonReader.commands.top.getTranslation(language).end2Top, {
			pseudo: actualPlayer,
			rank: rankCurrentPlayer,
			totalPlayer: numberOfPlayer
		}));
	}

	return await message.channel.send({ embeds: [embed] });
}

module.exports.execute = TopCommand;