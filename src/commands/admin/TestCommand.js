/* eslint-disable */

import {DraftBotValidateReactionMessage} from "../../core/messages/ValidateReactionMessage";
import {DraftBotEmbed} from "../../core/messages/DraftBotEmbed";
import {
	DraftBotShopMessage,
	DraftBotShopMessageBuilder, ShopItem,
	ShopItemCategory
} from "../../core/messages/DraftBotShopMessage";

const DraftBotReactionMessageBuilder = require("../../core/messages/DraftBotReactionMessage").DraftBotReactionMessageBuilder;
const DraftBotReaction = require("../../core/messages/DraftBotReaction").DraftBotReaction;

const Maps = require("../../core/Maps");
/**
 * Cheat command for testers
 * @param {("fr"|"en")} language - Language to use in the response
 * @param {module:"discord.js".Message} message - Message from the discord server
 * @param {String[]} args=[] - Additional arguments sent with the command
 */
const TestCommand = async (language, message, args) => {
	let authorized = false;

	if (JsonReader.app.TEST_MODE !== true) {
		return;
	} else {
		authorized = true;
	}

	if (!authorized) { // Additional security in case of error
		return;
	}

	if (args.length === 0) {
		await message.channel.send(":x: | Pas assez d'arguments");
		return;
	}

	let author;
	[author] = await Entities.getOrRegister(message.author.id);
	try {
		switch (args[0].toLowerCase()) {
		case "lvl":
		case "level":
			if (args.length === 2) {
				author.Player.level = parseInt(args[1]);
				author.Player.save();
			} else {
				await message.channel.send("Usage correct: test level <niveau>");
				return;
			}
			break;
		case "score":
			if (args.length === 2) {
				author.Player.score = parseInt(args[1]);
				author.Player.save();
			} else {
				await message.channel.send("Usage correct: test score <score>");
				return;
			}
			break;
		case "weeklyscore":
			if (args.length === 2) {
				author.Player.weeklyScore = parseInt(args[1]);
				author.Player.save();
			} else {
				await message.channel.send("Usage correct: test weeklyscore <score>");
				return;
			}
			break;
		case "xp":
		case "experience":
			if (args.length === 2) {
				author.Player.experience = parseInt(args[1]);
				author.Player.save();
			} else {
				await message.channel.send("Usage correct: test experience <experience>");
				return;
			}
			break;
		case "money":
			if (args.length === 2) {
				author.Player.money = parseInt(args[1]);
				author.Player.save();
			} else {
				await message.channel.send("Usage correct: test experience <experience>");
				return;
			}
			break;
		case "givebadge":
			if (args.length === 2) {
				author.Player.addBadge(args[1]);
				author.Player.save();
			} else {
				await message.channel.send("Usage correct: test givebadge <badge>");
				return;
			}
			break;
		case "clearbadges":
			if (args.length === 1) {
				author.Player.badges = null;
				author.Player.save();
			} else {
				await message.channel.send("Usage correct: test clearbadges");
				return;
			}
			break;
		case "maxhealth":
			if (args.length === 2) {
				author.maxHealth = parseInt(args[1]);
				author.save();
			} else {
				await message.channel.send("Usage correct: test maxhealth <max health>");
				return;
			}
			break;
		case "health":
			if (args.length === 2) {
				author.health = parseInt(args[1]);
				author.save();
			} else {
				await message.channel.send("Usage correct: test health <health>");
				return;
			}
			break;
		case "attack":
			if (args.length === 2) {
				author.attack = parseInt(args[1]);
				author.save();
			} else {
				await message.channel.send("Usage correct: test attack <attack>");
				return;
			}
			break;
		case "defense":
			if (args.length === 2) {
				author.defense = parseInt(args[1]);
				author.save();
			} else {
				await message.channel.send("Usage correct: test defense <defense>");
				return;
			}
			break;
		case "speed":
			if (args.length === 2) {
				author.speed = parseInt(args[1]);
				author.save();
			} else {
				await message.channel.send("Usage correct: test speed <speed>");
				return;
			}
			break;
		case "effect":
			if (args.length === 2) {
				let effectMalus = ":" + args[1] + ":";
				if (JsonReader.models.players.effectMalus[effectMalus]) {
					await Maps.applyEffect(author.Player, ":" + args[1] + ":");
					await author.Player.save();
				} else {
					await message.channel.send("Effet inconnu ! Il ne faut pas mettre les ::");
					return;
				}
			} else {
				await message.channel.send("Usage correct: test effect <effect>");
				return;
			}
			break;
		case "jail":
			if (message.mentions.users.first() === undefined) {
				await message.channel.send("Usage correct: test jail <mention>");
				return;
			}
			[entity] = await Entities.getOrRegister(message.mentions.users.first().id);
			await Maps.applyEffect(entity.Player, ":lock:");
			await entity.Player.save();
			break;
		case "weaponid":
			if (args.length === 2) {
				author.Player.Inventory.weaponId = parseInt(args[1]);
				author.Player.Inventory.save();
			} else {
				await message.channel.send("Usage correct: test weaponId <weaponId>");
				return;
			}
			break;
		case "armorid":
			if (args.length === 2) {
				author.Player.Inventory.armorId = parseInt(args[1]);
				author.Player.Inventory.save();
			} else {
				await message.channel.send("Usage correct: test armorId <armorId>");
				return;
			}
			break;
		case "potionid":
			if (args.length === 2) {
				author.Player.Inventory.potionId = parseInt(args[1]);
				author.Player.Inventory.save();
			} else {
				await message.channel.send("Usage correct: test potionId <potionId>");
				return;
			}
			break;
		case "objectid":
			if (args.length === 2) {
				author.Player.Inventory.objectId = parseInt(args[1]);
				author.Player.Inventory.save();
			} else {
				await message.channel.send("Usage correct: test objectId <objectId>");
				return;
			}
			break;
		case "backupid":
			if (args.length === 2) {
				author.Player.Inventory.backupId = parseInt(args[1]);
				author.Player.Inventory.save();
			} else {
				await message.channel.send("Usage correct: test backupId <backupId>");
				return;
			}
			break;
		case "init":
			author.Player.level = 1;
			author.Player.score = 2000;
			author.Player.weeklyScore = 0;
			author.Player.experience = 0;
			author.Player.money = 0;
			author.Player.badges = null;
			author.Player.effectEndDate = Date.now();
			author.Player.effectDuration = 0;
			await Maps.removeEffect(entity.Player);
			author.Player.startTravelDate = new Date();
			author.Player.save();

			author.maxHealth = 100;
			author.health = 100;
			author.attack = 50;
			author.defense = 20;
			author.speed = 10;
			author.save();

			author.Player.Inventory.weaponId = 0;
			author.Player.Inventory.armorId = 0;
			author.Player.Inventory.objectId = 0;
			author.Player.Inventory.backupId = 0;
			author.Player.Inventory.save();
			break;
		case "destroy":
			Inventories.destroy({
				where: {
					playerId: author.Player.id
				}
			});
			Players.destroy({
				where: {
					entityId: author.id
				}
			});
			Entities.destroy({
				where: {
					id: author.id
				}
			});
			break;
		case "forcereport":
		case "fr":
		case "forcer":
			if (args.length === 2) {
				await getCommand("r")(language, message, args, parseInt(args[1]));
			} else {
				await message.channel.send("Usage correct: test forcer <eventId>");
			}
			return;
		case "agd":
			if (args.length === 2) {
				let guild = await Guilds.findOne({where: {id: author.Player.guildId}});
				guild.lastDailyAt -= parseInt(args[1]) * 60000;
				guild.save();
			}
			break;
		case "adaily":
			if (args.length === 2) {
				author.Player.Inventory.lastDailyAt -= parseInt(args[1]) * 60000;
				author.Player.Inventory.save();
			}
			break;
		case "glvl":
			if (args.length === 2 && !isNaN(args[1])) {
				let guild = await Guilds.findOne({where: {id: author.Player.guildId}});
				guild.level = parseInt(args[1]);
				guild.save();
			}
			break;
		case "petlp":
			if (args.length === 2 && !isNaN(args[1])) {
				let pet = await author.Player.Pet;
				pet.lovePoints = parseInt(args[1]);
				pet.save();
			}
			break;
		case "gxp":
			if (args.length === 2 && !isNaN(args[1])) {
				let guild = await Guilds.findOne({where: {id: author.Player.guildId}});
				guild.experience = parseInt(args[1]);
				guild.save();
			}
			break;
		case "fakevote":
			await require("../../core/DBL").userDBLVote(message.author.id);
			break;
		case "topggatime":
			author.Player.topggVoteAt -= parseInt(args[1]) * 60000;
			author.Player.save();
			break;
		case "fightpointslost":
		case "fpl":
			if (args.length === 2) {
				author.fightPointsLost = parseInt(args[1]);
				author.save();
			}
			break;
		case "forcejoinguild":
		case "fjg":
			if (args.length >= 2) {
				let guild = await Guilds.findOne({where: {id: author.Player.guildId}});
				if (guild && guild.chiefId === author.Player.id) {
					// the chief is leaving : destroy the guild
					await Guilds.destroy({
						where: {
							id: guild.id,
						},
					});
				}
				guild = await Guilds.getByName(args.slice(1, args.length).join(" "));
				if (guild === null) {
					await message.channel.send("Guild not found");
					return;
				}
				author.Player.guildId = guild.id;

				await Promise.all([
					guild.save(),
					author.save(),
					author.Player.save(),
				]);
				await message.channel.send("Guild joined");
				return;
			}
			break;
		case "forceguildowner":
		case "fgo":
			let guild = await Guilds.findOne({where: {id: author.Player.guildId}});
			guild.chiefId = author.Player.id;
			await guild.save();
			break;
		case "pet":
			if (args.length === 3) {
				if (author.Player.Pet) {
					await author.Player.Pet.destroy();
				}
				if (args[1] === "0") {
					break;
				}
				const pet = PetEntities.createPet(parseInt(args[1]), args[2], null);
				await pet.save();
				author.Player.petId = pet.id;
				await author.Player.save();
				break;
			}
			await message.channel.send("Correct usage: test pet <id> <sex = m/f>");
			return;
		case "gp":
		case "guildpet":
			if (args.length === 3) {
				const guild = await Guilds.getById(author.Player.guildId);
				if (!guild) {
					await message.channel.send("Not in a guild!");
					return;
				}
				if (Guilds.isPetShelterFull(guild)) {
					await message.channel.send("Guild's pet shelter full!");
					return;
				}
				const pet = PetEntities.createPet(parseInt(args[1]), args[2], null);
				await pet.save();
				await (await GuildPets.addPet(guild.id, pet.id)).save();
				break;
			}
			await message.channel.send("Correct usage: test guildpet <id> <sex = m/f>");
			return;
		case "apfree":
			if (args.length === 2) {
				author.Player.lastPetFree -= parseInt(args[1]) * 60000;
				author.Player.save();
			}
			break;
		case "pf":
		case "petfree":
			author.Player.petId = null;
			break;
		case "greward":
			await getCommand("gd")(language, message, [], args[1]);
			break;
		case "block":
			let sec = parseInt(args[1]);
			const msg = await message.channel.send(":clock2: You're now blocked for " + sec + " seconds!");
			let collector = msg.createReactionCollector(() => {
				return true;
			}, {
				time: sec * 1000
			});
			collector.on("collect", () => {
			});
			collector.on("end", () => {
			});
			addBlockedPlayer(author.discordUserId, "test", collector);
			break;
		case "dailytimeout":
			require("../../core/DraftBot").dailyTimeout();
			break;
		case "mapinfo":
			const mapEmbed = new DraftBotEmbed();
			const currMap = await MapLocations.getById(author.Player.mapId);
			const prevMap = await MapLocations.getById(author.Player.previousMapId);
			const travelling = Maps.isTravelling(author.Player);
			mapEmbed.setTitle(":map: Map debugging");
			mapEmbed.addField(travelling ? "Next map" : "Current map", currMap.getDisplayName(language) + " (id: " + currMap.id + ")", true);
			mapEmbed.addField("Previous map", prevMap ? prevMap.getDisplayName(language) + " (id: " + prevMap.id + ")" : "None", true);
			mapEmbed.addField("Travelling", Maps.isTravelling(author.Player) ? ":clock1: For " + minutesToString(millisecondsToMinutes(Maps.getTravellingTime(author.Player))) : ":x: No", true);
			if (!travelling) {
				const availableMaps = await Maps.getNextPlayerAvailableMaps(author.Player);
				let field = "";
				for (let i = 0; i < availableMaps.length; ++i) {
					const map = await MapLocations.getById(availableMaps[i]);
					field += map.getDisplayName(language) + " (id: " + map.id + ")" + "\n";
				}
				mapEmbed.addField("Next available maps", field, true);
			} else {
				mapEmbed.addField("Players", ":speech_balloon: " + await currMap.playersCount() + " player(s) on this map", true);
			}
			return await message.channel.send(mapEmbed);
		case "travel":
			if (args.length === 2) {
				//const availableMaps = await Maps.getNextPlayerAvailableMaps(author.Player);
				const nextId = parseInt(args[1]);
				/*if (!availableMaps.includes(nextId)) {
						await message.channel.send("You cannot go to this map from there. Available ids: " + availableMaps);
						return;
					}*/
				await Maps.startTravel(author.Player, nextId, message.createdAt.getTime());
			} else {
				await message.channel.send("Correct usage: travel <map id>");
				return;
			}
			break;
		case "stoptravel":
		case "stravel":
			await Maps.stopTravel(author.Player);
			break;
		case "travelreport":
		case "tr":
			author.Player.startTravelDate = new Date(0);
			author.Player.effectEndDate = new Date(0);
			await author.Player.save();
			break;
		case "tp":
			if (args.length === 2) {
				const id = parseInt(args[1]);
				const map = await MapLocations.getById(id);
				if (!map) {
					await message.channel.send("This map doesn't exist");
					return;
				}
				author.Player.mapId = id;
				await author.Player.save();
				break;
			} else {
				await message.channel.send("Correct usage: tp <map id>");
				return;
			}
		case "atravel":
			if (args.length === 2) {
				Maps.advanceTime(author.Player, parseInt(args[1]));
				author.Player.save();
				break;
			} else {
				await message.channel.send("Correct usage: atravel <time in minutes>");
				return;
			}
		case "small_event":
			if (args.length === 2) {
				if (JsonReader.smallEvents[args[1]] === undefined) {
					await message.channel.send("Unknown small event type");
					return;
				}
				await getCommand("r")(language, message, args, -1, args[1]);
				return;
			} else {
				await message.channel.send("Correct usage: small_event <type>");
				return;
			}
		case "suicide":
			author.health = 0;
			await author.Player.killIfNeeded(author, message.channel, language);
			await Promise.all([author.save(), author.Player.save()]);
			break;
		case "forcetwe":
			await require("../../core/DraftBot").twe();
			break;
		case "myids":
			await message.channel.send("Entity id: " + author.id + ", player id: " + author.Player.id);
			return;
		case "rmeffect":
			await Maps.removeEffect(author.Player);
			await author.Player.save();
			break;
		case "dbreactionembed":
			if (args[1] === "basic") {
				const reactionCallback = (msg, reaction, user) => {
					msg.description = "Last clicked: " + reaction.emoji.name + "\nClicked by " + user.username;
					msg.sentMessage.edit(msg);
				};
				const stopCallback = (msg) => {
					msg.stop();
				};
				const endCallback = (msg) => {
					msg.description = "Embed ended :(";
					msg.sentMessage.edit(msg);
				};
				await new DraftBotReactionMessageBuilder()
					.addReaction(new DraftBotReaction("1⃣", reactionCallback))
					.addReaction(new DraftBotReaction("2⃣", reactionCallback))
					.addReaction(new DraftBotReaction("3⃣", reactionCallback))
					.addReaction(new DraftBotReaction("🛑", stopCallback))
					.allowUser(message.author)
					.endCallback(endCallback)
					.maxReactions(999)
					.build()
					.setTitle("Test embed")
					.setDescription("Try to click on a reaction !")
					.send(message.channel);
			}
			else if (args[1] === "validate") {
				const validateCallback = (msg, reaction, user) => {
					msg.description = "Validated by " + user.username;
					msg.sentMessage.edit(msg);
				}
				const refuseCallback = (msg, reaction, user) => {
					msg.description = "Refused by " + user.username;
					msg.sentMessage.edit(msg);
				}
				await new DraftBotValidateReactionMessage(validateCallback, refuseCallback, null)
					.setTitle("Validate embed test")
					.setDescription("Do you accept ?")
					.send(message.channel);
			}
			else if (args[1] === "shop") {
				const buyProduct = (message, shopItem) => {
					message.description = "Player bought " + shopItem;
					message.sentMessage.edit(message);
				}
				const shop = (
					await new DraftBotShopMessageBuilder(
						message.author,
						"Test shop",
						language,
						async (userId) => (await Entities.getOrRegister(userId))[0].Player.money,
						async (userId, amount) => {
							const player = (await Entities.getOrRegister(userId))[0].Player;
							player.money -= amount;
							await player.save();
						})
					.addCategory(new ShopItemCategory([
						new ShopItem("😀", "product 1", 123, "description product 1", (msg) => buyProduct(msg, "product 1")),
						new ShopItem("✨", "product 2", 897, "description product 2", (msg) => buyProduct(msg, "product 2"))
					], "Category 1"))
					.addCategory(new ShopItemCategory([
						new ShopItem("🕳️", "product 3", 999999, "description product 3", (msg) => buyProduct(msg, "product 3")),
						new ShopItem("🔥", "buy multiple", 42, "Description du produit", (msg, amount) => { buyProduct(msg, "buy multiple: x" + amount); return true; }, [1, 2, 4, 8, 10])
					], "Category 2"))
					.endCallback(
						(shopMessage, reason) => {
							shopMessage.setDescription("Shop ended\nReason: " + reason)
							shopMessage.sentMessage.edit(shopMessage);
						}
					)
					.build()
				)
					.send(message.channel);
			}
			break;
		default:
			await message.channel.send("Argument inconnu !");
			return;
		}
	} catch (error) {
		console.log(error);
		await message.channel.send(":x: | Une erreur est survenue pendant la commande !");
		return;
	}
	await message.channel.send(":man_mage: | Commande test reconnue et appliquée !");
};

module.exports = {
	commands: [
		{
			name: "test",
			func: TestCommand
		}
	]
};