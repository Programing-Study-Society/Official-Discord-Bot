// discord.js v14では、下記のようにRESTとRoutesはdiscord.jsパッケージから直接インポートできます
const { REST, Routes } = require('discord.js');


// 登録コマンドを呼び出してリスト形式で登録
const commands = [
    require('../modules/infomation-theory/efficiency').data.toJSON(), 
    require('../modules/infomation-theory/entropy').data.toJSON(), 
    require('../modules/infomation-theory/mean-sign-length').data.toJSON(), 
    require('../modules/translation.js').data.toJSON(), 
    require('../modules/count.js').data.toJSON(), 
    require('./log-deletion.js').data.toJSON(), 
    require('./log-deletion-all.js').data.toJSON()
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