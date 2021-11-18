import {Constants} from "../../core/Constants";
import {Message} from "discord.js";
import {Entities} from "../../core/models/Entity";
import {DraftBotMissionsMessage} from "../../core/messages/DraftBotMissionsMessage";
import {DailyMissions} from "../../core/models/DailyMission";
import {Campaign} from "../../core/missions/Campaign";

export const commandInfo = {
	name: "missions",
	aliases: ["mission"],
	disallowEffects: [Constants.EFFECT.BABY, Constants.EFFECT.DEAD]
};

const MissionsCommand = async (message: Message, language: string, args: string[]) => {
	let [entity] = await Entities.getByArgs(args, message);
	if (!entity) {
		[entity] = await Entities.getOrRegister(message.author.id);
	}

	const dailyMission = await DailyMissions.getOrGenerate();
	await Campaign.updatePlayerCampaign(entity.Player);
	[entity] = await Entities.getOrRegister(entity.discordUserId);
	message.channel.send({ embeds: [
		await new DraftBotMissionsMessage(
			entity.Player,
			dailyMission,
			await entity.Player.getPseudo(language),
			language
		)
	]});
};

export const execute = MissionsCommand;