// discord.js v14では、下記のようにRESTとRoutesはdiscord.jsパッケージから直接インポートできます
const { REST, Routes } = require('discord.js');

// module.exportsを呼び出します。
const nouritu = require('../modules/information_theory.js');
const trans = require('../modules/translation.js');
const count = require('../modules/count.js');

// 環境変数としてapplicationId, guildId, tokenの3つが必要です
const { test_applicationId, test_guildId, test_token } = require('../config.json');

// 登録コマンドを呼び出してリスト形式で登録
const commands = [nouritu.data.toJSON(), trans.data.toJSON(), count.data.toJSON()];

// DiscordのAPIには現在最新のversion10を指定
const rest = new REST({ version: '10' }).setToken(test_token);

// Discordサーバーにコマンドを登録
(async () => {
    try {
        await rest.put(
			Routes.applicationGuildCommands(test_applicationId, test_guildId),
			{ body: commands },
		);
        console.log('サーバー固有のコマンドが登録されました！');
    } catch (error) {
        console.error('コマンドの登録中にエラーが発生しました:', error);
    }
})();