// discord.js v14では、下記のようにRESTとRoutesはdiscord.jsパッケージから直接インポートできます
const { REST, Routes } = require('discord.js');

// hey.jsのmodule.exportsを呼び出します。
const nouritu = require('../modules/information_theory.js');
const trans = require('../modules/translation.js');
const logDeletion = require('./log-deletion.js');
const logDeletionAll = require('./log-deletion-all.js');


// 環境変数としてapplicationId, guildId, tokenの3つが必要です
const { prkn_token, prkn_applicationId, prkn_guildId } = require('../config.json');

// 登録コマンドを呼び出してリスト形式で登録
const commands = [nouritu.data.toJSON(), trans.data.toJSON(), logDeletion.data.toJSON(), logDeletionAll.data.toJSON()];

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