const { SlashCommandBuilder } = require('discord.js');

let users = [...Array(24)].map((_, i) => `user${i + 1}`);
let slashCommand = new SlashCommandBuilder()
    .setName('random-team')
    .setDescription('ランダムでチーム分けを行います(最大24人)')
    .addNumberOption(option =>
        option.setName('team-number')
        .setDescription('何チームに分けるのか選択してください')
        .setRequired(true));
users.forEach((user) => {slashCommand = slashCommand.addUserOption(option => option.setName(user)
    .setDescription('人を選択してください')	
    .setRequired(false))});

module.exports = {
    data: slashCommand,
    async execute(interaction) {
        const replyUsers = users.map((user) => interaction.options.getUser(user))
                        .filter((result) => result !== null);
        teamNumber = interaction.options.getNumber('team-number');
        text = createTeams(interaction, replyUsers, teamNumber);
        await interaction.reply(text);
    },
};

function createTeams(interaction, members, teamNumber) {
    const roleManagement = require('./role-management');
    members.sort(() => (Math.random() - 0.5));
    let teams = [];
    const length = members.length;
    const a = length % teamNumber;
    const b = Math.trunc(length / teamNumber);
    // チーム分けを行う
    for(let i = 0, start = 0, end = b + (i < a); i < teamNumber; i++, start = end, end += b + (i < a)){
        let teamMembers = members.slice(start, end);
        let teamName = "チーム" + String.fromCharCode(65 + i);
        let teamString = teamName + "\n> ";
        teamString += teamMembers.join("\n> ");
        teams.push(teamString);
        roleManagement.roleAdd(interaction, teamMembers, teamName);
    }
    return teams.join("\n");
}