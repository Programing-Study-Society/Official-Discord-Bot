const { 
    Client,
    GatewayIntentBits,
    Events,
    ActivityType,
} = require('discord.js');

const config = require('./config.json')

// modules
const info_theory = require('./modules/information_theory');
const translation = require('./modules/translation');

const modules = [info_theory,translation];

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers]
});

client.on('ready', () => {
    console.log('-------------------------------');
    console.log(`Logged in as ${client.user.tag}`);
    console.log(`${client.guilds.cache.size} Server joined`);
    console.log('-------------------------------');

    client.user.setActivity({
        name: `~起動中~`,
        type: ActivityType.Custom
      })
})

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    let flag = 0;
    // 各コマンドに対する処理
    modules.forEach( async (ele) => {
        if (interaction.commandName === ele.data.name) {
            flag++;
            try {
                await ele.execute(interaction);
            } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'コマンド実行時にエラーになりました。', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'コマンド実行時にエラーになりました。', ephemeral: true });
                }
            }
        }
    });
    if(flag == 0)
        console.error(`${interaction.commandName}というコマンドには対応していません。`);
});



// ここからChatGPT用

// 送信されたメッセージがChatGPT宛ならその処理へ送る関数
client.on(Events.MessageCreate, (message) => {
	console.log("\nメッセージの送信を検知。");
	// 送信された文章の送信者がBotでなければ
    if (!message.author.bot)
	{
		const chName = message.channel.name;//送信されたメッセージのチャンネル名を格納
        const content = message.content;// 送信された文章を格納
		const checkContent = content.toUpperCase();// 送信された文章を大文字に変換して格納
		let sendMessage;//chatGPTに渡すメッセージを格納する変数

		console.log("\nBot以外の送信者からの文章を検知。チャンネル名:" + chName);		
		console.log("メッセージ内容:" + message.content);

		if(checkContent.startsWith("GPT")) sendMessage = content.slice(3);// 送信された文章の先頭がGPTなら
		else if(checkContent.startsWith("CHATGPT")) sendMessage = content.slice(7);// 送信された文章の先頭がCHATGPTなら
		else if(checkContent.startsWith("CHAT GPT")) sendMessage = content.slice(8);// 送信された文章の先頭がCHAT GPTなら
		else
		{
			if(chName == "chat-gpt") sendMessage = content;//送信チャンネルが特定チャンネルなら
			else if(message.channel.parent.name == "chat-gpt") sendMessage = "##Contents\n" + chName + "\n\n##Details\n" + content;//フォーラムの送信チャンネルが特定チャンネルなら
			else return;//以上全てに一致しない(GPT宛てではないメッセージ)場合処理を終了
		}
		console.log("\nキーワード一 or チャンネル一致");
		//文字列が残っていればChatGPTのAPIに送る
		if(sendMessage.length > 0)
		{
			console.log("\n条件に満たした構成のため、ChatGPTのAPIに送信");
			sentenceSendAndReceive(sendMessage, message)// 文章からキーワードを抜いたものと送信先のチャンネル情報を送る
		}
    }
});

// メンションされたとき、その文章をChatGPTの処理へ送る関数
client.on('messageCreate', message => {
	// メンションされた&送信者がbotでなければ
	if (message.mentions.users.has(client.user.id) && !message.author.bot)
	{
		// メッセージに含まれているメンション部分を削除
		content = message.content.replace(`<@${client.user.id}>`, '');

		// もしメッセージが空でなければChatGPTのAPIに送る
		if(content != "")
			sentenceSendAndReceive(content, message)
	}
})

// 入力された文章をChatGPTのAPIに送信して、返答をDiscordに送信する関数
async function sentenceSendAndReceive(inputSentence, message)
{
	const sendSentence = inputSentence;// 入力された文章を受け取る
	const msg = message;// 送信先のチャンネルを受け取る

	// スクリプト実行用のオブジェクトを作成
	const gptBridgingScript = require('./modules/chatgpt/gptBridging');

	// 入力中...を表示させる
	msg.channel.sendTyping();

	// 入力された文章をChatGPTのAPIに送信して、返答を受け取る
	replySentence = await gptBridgingScript.gptBridging(sendSentence);
	console.log("\n投稿先のチャンネル:" + msg.channel.name);

	// ChatGPTからの返答をDiscordに送信
	msg.reply(replySentence);
}

// スラッシュコマンド
client.on(Events.InteractionCreate, async interaction => {

    // スラッシュ以外のコマンドは終了
    // コマンドにスラッシュが使われているかどうかisChatInputCommand()で判断
    if (!interaction.isChatInputCommand()) return;

    // logEliminationコマンドに対する処理
    if (interaction.commandName === logEliminationFile.data.name) {
        try {
            await logEliminationFile.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'コマンド実行時にエラーになりました。', ephemeral: true });
            } else {
                await interaction.reply({ content: 'コマンド実行時にエラーになりました。', ephemeral: true });
            }
        }
    }
	else console.error(`${interaction.commandName}というコマンドには対応していません。`);
});


client.login(config.prkn_token) 