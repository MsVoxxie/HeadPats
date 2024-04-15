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

client.on('ready', () => console.log(`${client.user.username} is online`));
client.on('error', (e) => console.error(e));

client.on('interactionCreate', async (interaction) => {
	// !! Headpats
	if (interaction.commandName === 'Headpat') {
		// Options and Predefinitions
		const targetMember = interaction.targetUser;
		const avatarURL = targetMember.displayAvatarURL({ extension: 'png' });

		// Generate Headpats
		const headPats = await generatePetPet(avatarURL, { resolution: 128, delay: 25, backgroundColor: null });

		// Send it
		await interaction.reply({
			files: [{ name: 'headpat.gif', attachment: headPats }],
		});

		// Update DB
		await patData.findOneAndUpdate({ userId: targetMember.id }, { $inc: { patCounter: 1 } }, { upsert: true, new: true });

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
		const avatarURL = targetMember.displayAvatarURL({ extension: 'png' });

		// Generate Headpats
		const headPats = await generateBapBap(avatarURL, { resolution: 128, delay: 25, backgroundColor: null });

		// Send it
		await interaction.reply({
			files: [{ name: 'headbaps.gif', attachment: headPats }],
		});

		// Update DB
		await patData.findOneAndUpdate({ userId: targetMember.id }, { $inc: { bapCounter: 1 } }, { upsert: true, new: true });

		//Generate PetPet Function
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

	// !! Avatar
	if (interaction.commandName === 'Get Avatar') {
		// Options and Predefinitions
		const targetMember = interaction.targetUser;
		const avatarURL = targetMember.displayAvatarURL();

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
			.setColor(`#9c825e`)
			.addFields(
				{ name: 'Pats', value: userStats?.patCounter.toString() || '0', inline: true },
				{ name: 'Baps', value: userStats?.bapCounter.toString() || '0', inline: true }
			);

		interaction.reply({ embeds: [embed] });
	}
});

client.login(TOKEN);