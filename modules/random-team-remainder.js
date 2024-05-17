const { SlashCommandBuilder } = require('discord.js');

let users = [...Array(24)].map((_, i) => `user${i + 1}`);
let slashCommand = new SlashCommandBuilder()
    .setName('random-team-remainder')
    .setDescription('ランダムでチーム分けを行います(余りあり)(最大24人)')
    .addNumberOption(option =>
        option.setName('team-number')
        .setDescription('何チームに分けるのか選択してください(余り分を含まないチーム数)')
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
    // 余りチームが発生する場合、チーム数を+1する
    remainderTeam = length % teamNumber != 0;
    teamNumber += remainderTeam;
    // 1チーム辺りの人数を求める
    const num = Math.ceil(length / teamNumber);
    // チーム分けを行う
    for (let i = 0; i < length; i += num) {
        let teamMembers = members.slice(i, i + num);
        let teamName = "チーム" + (((i + num) >= length && remainderTeam) ? "余り" : String.fromCharCode(65 + (i / num)));
        let teamString = teamName + "\n> ";
        teamString += teamMembers.join("\n> ");
        teams.push(teamString);
        roleManagement.roleAdd(interaction, teamMembers, teamName);
    }
    return teams.join("\n");
}