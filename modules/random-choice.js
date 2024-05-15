const { SlashCommandBuilder } = require('discord.js');

let users = [...Array(25)].map((_, i) => `user${i + 1}`);
let slashCommand = new SlashCommandBuilder()
    .setName('random-choice')
    .setDescription('ランダムで1人を抽出します(最大25人)');
users.forEach((user) => {slashCommand = slashCommand.addUserOption(option => option.setName(user)
    .setDescription('人を選択してください')	
    .setRequired(false))});

module.exports = {
    data: slashCommand,
    async execute(interaction) {
        const replyUsers = users.map((user) => interaction.options.getUser(user))
                        .filter((result) => result !== null);
        const randomIndex = Math.floor(Math.random() * replyUsers.length);
        await interaction.reply(`${replyUsers}\nの中から選ばれたのは\n${replyUsers[randomIndex]}`);
    },
};