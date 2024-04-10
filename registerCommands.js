// Configuration Environment Variables
const dotenv = require('dotenv');
dotenv.config();

// Discordjs
const { ContextMenuCommandBuilder, ApplicationCommandType, REST, Routes } = require('discord.js');

const commandsData = [
	new ContextMenuCommandBuilder().setName('Headpat').setType(ApplicationCommandType.User),
	new ContextMenuCommandBuilder().setName('Headbap').setType(ApplicationCommandType.User),
	new ContextMenuCommandBuilder().setName('Get Avatar').setType(ApplicationCommandType.User),
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
