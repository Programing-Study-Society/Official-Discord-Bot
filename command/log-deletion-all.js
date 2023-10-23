const { SlashCommandBuilder } = require('discord.js');

// スクリプト実行用のオブジェクトを作成
const chatGPTAPIScript = require('../modules/chatgpt/chatgpt-api-script');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gpt-deletelog-all')
		.setDescription('全てのチャンネルに保存されているChatGPTとの会話記録を削除します'),
	execute: async function(interaction) {
		await chatGPTAPIScript.logDeletionAll();
		await interaction.reply('全てのChatGPTとの会話ログを削除しました');
	},
};