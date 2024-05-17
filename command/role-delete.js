const { SlashCommandBuilder } = require('discord.js');

// スクリプト実行用のオブジェクトを作成
const roleManagement = require('../modules/role-management');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('role-delete')
		.setDescription('チーム振り分け用に追加されたロールを削除します'),
	execute: async function(interaction) {
		roleManagement.roleDelete(interaction);
		await interaction.reply('ロールの削除が完了しました');
	},
};