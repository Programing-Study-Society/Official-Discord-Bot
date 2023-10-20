const { 
    Client,
    GatewayIntentBits,
    Events,
    ActivityType,
} = require('discord.js');

const config = require('./config.json')

// modules
const info_theory = require('./modules/information_theory');
const translation = require('./modules/translation');

const modules = [info_theory,translation];

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers]
});

client.on('ready', () => {
    console.log('-------------------------------');
    console.log(`Logged in as ${client.user.tag}`);
    console.log(`${client.guilds.cache.size} Server joined`);
    console.log('-------------------------------');

    client.user.setActivity({
        name: `~起動中~`,
        type: ActivityType.Custom
      })
})

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    let flag = 0;
    // 各コマンドに対する処理
    modules.forEach( async (ele) => {
        if (interaction.commandName === ele.data.name) {
            flag++;
            try {
                await ele.execute(interaction);
            } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'コマンド実行時にエラーになりました。', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'コマンド実行時にエラーになりました。', ephemeral: true });
                }
            }
        }
    });
    if(flag == 0)
        console.error(`${interaction.commandName}というコマンドには対応していません。`);
});

client.login(config.prkn_token) 