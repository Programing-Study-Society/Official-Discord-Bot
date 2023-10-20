const { SlashCommandBuilder } = require('discord.js');

// スクリプト実行用のオブジェクトを作成
const chatGPTAPIScript = require('../modules/chatgpt/chatgpt-api-script');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('log-elimination')
		.setDescription('ChatGPTに送信される今までの会話記録(最大2往復分)を削除します'),
	execute: async function(interaction) {
		await chatGPTAPIScript.logElimination();
		await interaction.reply('ChatGPTとの会話ログを削除しました');
	},
};