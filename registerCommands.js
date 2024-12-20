// Configuration Environment Variables
const dotenv = require('dotenv');
dotenv.config();

// Discordjs
const { ContextMenuCommandBuilder, ApplicationCommandType, REST, Routes, SlashCommandBuilder } = require('discord.js');

const commandsData = [
	new ContextMenuCommandBuilder().setName('Headpat').setType(ApplicationCommandType.User),
	new ContextMenuCommandBuilder().setName('Headbap').setType(ApplicationCommandType.User),
	new ContextMenuCommandBuilder().setName('Noted').setType(ApplicationCommandType.User),
	new ContextMenuCommandBuilder().setName('Get Avatar').setType(ApplicationCommandType.User),
	new ContextMenuCommandBuilder().setName('User Statistics').setType(ApplicationCommandType.User),
	new SlashCommandBuilder().setName('leaderboard').setDescription('Who is the pattiest?').setDMPermission(false),
];

const rest = new REST().setToken(process.env.DISCORD_TOKEN);
(async () => {
	try {
		console.log('Refreshing Commands');
		commandsData.map((c) => {
			c.integration_types = [0, 1];
			c.contexts = [0, 1, 2];
		});
		await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commandsData });
		console.log('Successfully registered commands');
	} catch (error) {
		console.error(error);
	}
})();
