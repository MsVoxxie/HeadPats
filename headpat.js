// Configuration Environment Variables
const dotenv = require('dotenv');
dotenv.config();

// Command Requirements
const GIFEncoder = require('gifencoder');
const Canvas = require('canvas');
const path = require('path');

// Discord JS
const { Client, IntentsBitField, EmbedBuilder } = require('discord.js');
const TOKEN = process.env.DISCORD_TOKEN;

const client = new Client({
	intents: [IntentsBitField.Flags.Guilds],
	allowedMentions: {
		parse: ['users', 'roles'],
	},
});

// Mongoose
client.mongoose = require('./core/mongoLoader');
client.mongoose.init();

const { patData } = require('./models/index');
const userData = require('./models/schemas/userData');

client.on('ready', () => console.log(`${client.user.username} is online`));
client.on('error', (e) => console.error(e));

client.on('interactionCreate', async (interaction) => {
	// !! Headpats
	if (interaction.commandName === 'Headpat') {
		// Options and Predefinitions
		const targetMember = interaction.targetUser;
		const fetchedMember = await interaction?.guild?.members.fetch(targetMember.id);
		const avatarURL = fetchedMember?.displayAvatarURL({ extension: 'png' }) || targetMember.displayAvatarURL({ extension: 'png' });

		// Generate Headpats
		const headPats = await generatePetPet(avatarURL, { resolution: 128, delay: 25, backgroundColor: null });

		// Send it
		await interaction.reply({
			files: [{ name: 'headpat.gif', attachment: headPats }],
		});

		// Update DB
		if (interaction?.guild?.id) {
			await patData.findOneAndUpdate({ userId: targetMember.id }, { $inc: { patsReceived: 1 }, $addToSet: { userGuilds: interaction.guild.id } }, { upsert: true, new: true });
			await patData.findOneAndUpdate(
				{ userId: interaction.user.id },
				{ $inc: { patsGiven: 1 }, $addToSet: { userGuilds: interaction.guild.id } },
				{ upsert: true, new: true }
			);
		} else {
			await patData.findOneAndUpdate({ userId: targetMember.id }, { $inc: { patsReceived: 1 } }, { upsert: true, new: true });
			await patData.findOneAndUpdate({ userId: interaction.user.id }, { $inc: { patsGiven: 1 } }, { upsert: true, new: true });
		}

		//Generate PetPet Function
		async function generatePetPet(avatarURL, options = {}) {
			//Definitions
			const FRAMES = 10;

			const petGifCache = [];

			// Create GIF encoder
			const encoder = new GIFEncoder(options.resolution, options.resolution);

			encoder.start();
			encoder.setRepeat(0);
			encoder.setDelay(options.delay);
			encoder.setTransparent();

			// Create canvas and its context
			const canvas = Canvas.createCanvas(options.resolution, options.resolution);
			const ctx = canvas.getContext('2d');

			const avatar = await Canvas.loadImage(avatarURL);

			// Loop and create each frame
			for (let i = 0; i < FRAMES; i++) {
				ctx.clearRect(0, 0, canvas.width, canvas.height);

				if (options.backgroundColor) {
					ctx.fillStyle = options.backgroundColor;
					ctx.fillRect(0, 0, canvas.width, canvas.height);
				}

				const j = i < FRAMES / 2 ? i : FRAMES - i;

				const width = 0.8 + j * 0.02;
				const height = 0.8 - j * 0.05;
				const offsetX = (1 - width) * 0.5 + 0.1;
				const offsetY = 1 - height - 0.08;

				if (i == petGifCache.length) petGifCache.push(await Canvas.loadImage(path.resolve(__dirname, `./imgs/pats/pet${i}.gif`)));

				ctx.drawImage(avatar, options.resolution * offsetX, options.resolution * offsetY, options.resolution * width, options.resolution * height);
				ctx.drawImage(petGifCache[i], 0, 0, options.resolution, options.resolution);

				encoder.addFrame(ctx);
			}

			encoder.finish();
			return encoder.out.getData();
		}
	}

	// !! HeadBap
	if (interaction.commandName === 'Headbap') {
		// Options and Predefinitions
		const targetMember = interaction.targetUser;
		const fetchedMember = await interaction?.guild?.members.fetch(targetMember.id);
		const avatarURL = fetchedMember?.displayAvatarURL({ extension: 'png' }) || targetMember.displayAvatarURL({ extension: 'png' });

		// Generate Headpats
		const headPats = await generateBapBap(avatarURL, { resolution: 128, delay: 25, backgroundColor: null });

		// Send it
		await interaction.reply({
			files: [{ name: 'headbaps.gif', attachment: headPats }],
		});

		// Update DB
		if (interaction?.guild?.id) {
			await patData.findOneAndUpdate({ userId: targetMember.id }, { $inc: { bapsReceived: 1 }, $addToSet: { userGuilds: interaction.guild.id } }, { upsert: true, new: true });
			await patData.findOneAndUpdate(
				{ userId: interaction.user.id },
				{ $inc: { bapsGiven: 1 }, $addToSet: { userGuilds: interaction.guild.id } },
				{ upsert: true, new: true }
			);
		} else {
			await patData.findOneAndUpdate({ userId: targetMember.id }, { $inc: { bapsReceived: 1 } }, { upsert: true, new: true });
			await patData.findOneAndUpdate({ userId: interaction.user.id }, { $inc: { bapsGiven: 1 } }, { upsert: true, new: true });
		}

		//Generate BapBap Function
		async function generateBapBap(avatarURL, options = {}) {
			//Definitions
			const FRAMES = 4;

			const petGifCache = [];

			// Create GIF encoder
			const encoder = new GIFEncoder(options.resolution, options.resolution);

			encoder.start();
			encoder.setRepeat(0);
			encoder.setDelay(options.delay);
			encoder.setTransparent();

			// Create canvas and its context
			const canvas = Canvas.createCanvas(options.resolution, options.resolution);
			const ctx = canvas.getContext('2d');

			const avatar = await Canvas.loadImage(avatarURL);

			// Loop and create each frame
			for (let i = 0; i < FRAMES; i++) {
				ctx.clearRect(0, 0, canvas.width, canvas.height);

				if (options.backgroundColor) {
					ctx.fillStyle = options.backgroundColor;
					ctx.fillRect(0, 0, canvas.width, canvas.height);
				}

				const j = i < FRAMES / 2 ? i : FRAMES - i;

				const width = 0.8 - j * 0.02;
				const height = 0.7 - j * 0.05;
				const offsetX = (1 - width) * -0.5 + 0.1;
				const offsetY = 1 - height - 0.08;

				if (i == petGifCache.length) petGifCache.push(await Canvas.loadImage(path.resolve(__dirname, `./imgs/baps/bap${i}.gif`)));

				ctx.drawImage(avatar, options.resolution * offsetX, options.resolution * offsetY, options.resolution * width, options.resolution * height);
				ctx.drawImage(petGifCache[i], 0, 0, options.resolution, options.resolution);

				encoder.addFrame(ctx);
			}

			encoder.finish();
			return encoder.out.getData();
		}
	}

	// !! Noted
	if (interaction.commandName === 'Noted') {
		// Options and Predefinitions
		const targetMember = interaction.targetUser;
		const fetchedMember = await interaction?.guild?.members.fetch(targetMember.id);
		const avatarURL = fetchedMember?.displayAvatarURL({ extension: 'png' }) || targetMember.displayAvatarURL({ extension: 'png' });

		// Generate Headpats
		const headPats = await generateNoted(avatarURL, { resolution: 288, delay: 25, backgroundColor: null });

		// Send it
		await interaction.reply({
			files: [{ name: 'noted.gif', attachment: headPats }],
		});

		//Generate Noted Function
		async function generateNoted(avatarURL, options = {}) {
			//Definitions
			const FRAMES = 16;

			const petGifCache = [];

			// Create GIF encoder
			const encoder = new GIFEncoder(options.resolution, options.resolution);

			encoder.start();
			encoder.setRepeat(0);
			encoder.setDelay(options.delay);
			encoder.setTransparent();

			// Create canvas and its context
			const canvas = Canvas.createCanvas(options.resolution, options.resolution);
			const ctx = canvas.getContext('2d');

			const avatar = await Canvas.loadImage(avatarURL);

			// Loop and create each frame
			for (let i = 0; i < FRAMES; i++) {
				ctx.clearRect(0, 0, canvas.width, canvas.height);

				if (options.backgroundColor) {
					ctx.fillStyle = options.backgroundColor;
					ctx.fillRect(0, 0, canvas.width, canvas.height);
				}

				const width = 0.9;
				const height = 0.9;
				const offsetX = (1 - width) * -0.5 + 0.1;
				const offsetY = 1 - height - 0.08;

				if (i == petGifCache.length) petGifCache.push(await Canvas.loadImage(path.resolve(__dirname, `./imgs/noted/noted${i}.gif`)));

				ctx.drawImage(avatar, options.resolution * offsetX, options.resolution * offsetY, options.resolution * width, options.resolution * height);
				ctx.drawImage(petGifCache[i], 0, 0, options.resolution, options.resolution);

				encoder.addFrame(ctx);
			}

			encoder.finish();
			return encoder.out.getData();
		}
	}

	// !! Avatar
	if (interaction.commandName === 'Get Avatar') {
		// Options and Predefinitions
		const targetMember = interaction.targetUser;
		const fetchedMember = await interaction?.guild?.members.fetch(targetMember.id);
		const avatarURL = fetchedMember?.displayAvatarURL({ extension: 'png' }) || targetMember.displayAvatarURL({ extension: 'png' });

		interaction.reply(avatarURL);
	}

	// !! Statistics
	if (interaction.commandName === 'User Statistics') {
		// Options and Predefinitions
		const targetMember = await interaction.targetUser.fetch({ force: true });
		const avatarURL = targetMember.displayAvatarURL({ extension: 'png' });

		// Get Data
		const userStats = await patData.findOne({ userId: targetMember.id });

		// Build Embed
		const embed = new EmbedBuilder()
			.setTitle(`${targetMember.displayName}'s Pat Stats`)
			.setThumbnail(avatarURL)
			.setTimestamp()
			.setColor(`#9c825e`)
			.addFields(
				{ name: 'Received Pats', value: userStats?.patsReceived.toString() || '0', inline: true },
				{ name: 'Received Baps', value: userStats?.bapsReceived.toString() || '0', inline: true },
				{ name: '_ _', value: '_ _', inline: false },
				{ name: 'Given Pats', value: userStats?.patsGiven.toString() || '0', inline: true },
				{ name: 'Given Baps', value: userStats?.bapsGiven.toString() || '0', inline: true }
			);

		interaction.reply({ embeds: [embed] });
	}

	// !! Leaderboard
	if (interaction.commandName === 'leaderboard') {
		// Return if not in a guild.
		if (!interaction.inGuild()) return interaction.reply({ content: 'This command is only intended for guilds.', ephemeral: true });
		if (!interaction?.guild?.id) return interaction.reply({ content: 'Unable to retrieve guild info...', ephemeral: true });
		// Fetch db data
		const patsReceived = await userData.find({ userGuilds: interaction.guild.id }).sort({ patsReceived: -1 }).limit(5);
		const patsGiven = await userData.find({ userGuilds: interaction.guild.id }).sort({ patsGiven: -1 }).limit(5);
		const bapsReceived = await userData.find({ userGuilds: interaction.guild.id }).sort({ bapsReceived: -1 }).limit(5);
		const bapsGiven = await userData.find({ userGuilds: interaction.guild.id }).sort({ bapsGiven: -1 }).limit(5);

		// Build Embed
		const embed = new EmbedBuilder()
			.setTitle(`${interaction.guild.name}'s Pat Leaderboard`)
			.setThumbnail(interaction.guild.iconURL())
			.setTimestamp()
			.setColor(`#9c825e`)
			.addFields(
				{ name: 'Received Pats', value: patsReceived.map((m) => `<@${m.userId}> | ${m.patsReceived.toString() || '0'}`).join('\n'), inline: true },
				{ name: 'Given Pats', value: patsGiven.map((m) => `<@${m.userId}> | ${m.patsGiven.toString() || '0'}`).join('\n'), inline: true },
				{ name: '_ _', value: '_ _', inline: false },
				{ name: 'Received Baps', value: bapsReceived.map((m) => `<@${m.userId}> | ${m.bapsReceived.toString() || '0'}`).join('\n'), inline: true },
				{ name: 'Given Baps', value: bapsGiven.map((m) => `<@${m.userId}> | ${m.bapsGiven.toString() || '0'}`).join('\n'), inline: true }
			);

		interaction.reply({ embeds: [embed] });
	}
});

client.login(TOKEN);
