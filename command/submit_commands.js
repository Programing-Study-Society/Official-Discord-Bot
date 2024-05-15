// discord.js v14では、下記のようにRESTとRoutesはdiscord.jsパッケージから直接インポートできます
const { REST, Routes } = require('discord.js');


// 登録コマンドを呼び出してリスト形式で登録
const commands = [
    require('../modules/information-theory/efficiency').data.toJSON(), 
    require('../modules/information-theory/entropy').data.toJSON(), 
    require('../modules/information-theory/mean-sign-length').data.toJSON(), 
    require('../modules/information-theory/huffman-coding').data.toJSON(), 
    require('../modules/information-theory/shannon_fano-coding').data.toJSON(), 
    require('../modules/translation.js').data.toJSON(), 
    require('../modules/count.js').data.toJSON(), 
    require('./log-deletion.js').data.toJSON(), 
    require('./log-deletion-all.js').data.toJSON(),
    require('../modules/akinator/akinator-main.js').data.toJSON(), 
    require('../modules/random-choice.js').data.toJSON(), 
    require('../modules/random-team.js').data.toJSON(), 
    require('../modules/random-team-remainder.js').data.toJSON(), 
];


// 環境変数としてapplicationId, guildId, tokenの3つが必要です
const { prkn_token, prkn_applicationId, prkn_guildId } = require('../config.json');


// DiscordのAPIには現在最新のversion10を指定
const rest = new REST({ version: '10' }).setToken(prkn_token);

// Discordサーバーにコマンドを登録
(async () => {
    try {
        await rest.put(
			Routes.applicationGuildCommands(prkn_applicationId, prkn_guildId),
			{ body: commands },
		);
        console.log('サーバー固有のコマンドが登録されました！');
    } catch (error) {
        console.error('コマンドの登録中にエラーが発生しました:', error);
    }
})();