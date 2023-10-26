const { SlashCommandBuilder } = require('discord.js');

// スクリプト実行用のオブジェクトを作成
const chatGPTAPIScript = require('../modules/chatgpt/chatgpt-api-script');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gpt-deletelog-thischannel')
		.setDescription('このチャンネルに保存されているChatGPTとの今までの会話記録を削除します'),
	execute: async function(interaction) {
		await chatGPTAPIScript.logDeletionThisChannel(interaction.channel.id);
		await interaction.reply('このチャンネルのChatGPTとの会話ログを削除しました');
	},
};