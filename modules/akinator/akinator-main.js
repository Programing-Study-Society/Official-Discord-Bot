const { SlashCommandBuilder } = require('discord.js');
const { Aki } = require('aki-api');
// import fetch from 'node-fetch';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('akinator')
		.setDescription('アキネーターがプレイできます'),
	execute: async function(interaction){
        await interaction.reply('アキネーターを開始します');

        const aki = new Aki({ region : 'jp' }); // アキネーターのインスタンス化
        let question; // 質問を格納する変数
        // アキネーター開始
	    interaction.channel.sendTyping();
        question = await aki.start();
        await questionSend(aki, question, interaction);    // 質問を投稿する
	},
};

async function questionSend(aki, question, interaction)
{
    await interaction.channel.send(`現在の確信度 : ${aki.progress.toFixed(1)}%\n質問${aki.currentStep + 1}問目 : ${question.question}\n選択肢 : ${question.answers},戻る`);
    // 回答を受信してアキネータに送信する
    await answersSend(aki, question, interaction);
}

async function answersSend(aki, question, interaction)
{
     // 同チャンネルに入力されたチャットを取得する
    const FAILURE_ADMISSIBLE_NUM = 3;
	const filter = (response) => response.author.id === interaction.user.id;
	const collector = await interaction.channel.createMessageCollector({ filter, time: 60000 }); // タイムアウト 60秒
    let missType = 0;

    // メッセージが取得できたら
    collector.on('collect', async (response) => {
        // ここで取得したメッセージを利用して何かしらの処理を行う
        // console.log(`収集されました: ${response.content}`);
        let select = await checkContent(response.content, question.answers, question.answers.length);
        if(select != -404)
        {
            interaction.channel.sendTyping(); // 入力中…を表示
            if(select === -1)
            {
                question = await aki.back();
            }
            else
            {
                question = await aki.step(select);
            }

            // 確信度が75%を超える or 質問回数が20回以上で終了
            if(aki.progress <= 75 && aki.currentStep < 20)
            {
                await questionSend(aki, question, interaction);    // 質問を投稿する
            }
            else
            {
                const result = await aki.win();
                // console.log('win:', result.guesses);
                await interaction.channel.send(`あなたが想像しているのは「${result.guesses[0].name}」`);
                // 画像を送信
                interaction.channel.send({
                    embeds: [{
                        image: {
                        url: result.guesses[0].absolute_picture_path
                        }
                    }]
                })
            }

            // 一度メッセージが収集されたら、コレクターを手動で終了
            await collector.stop();
            missType = 0; // ミス回数を初期化
        }
        else
        {
            await interaction.channel.send(`不適なメッセージです\n失敗回数 : ${++missType} / ${FAILURE_ADMISSIBLE_NUM}回`);
            if(missType >= FAILURE_ADMISSIBLE_NUM)
            {
                missType--; // つじつま合わせ(本来なら成功分がcollected.sizeに含まれるため)
                await interaction.channel.send(`失敗回数が許容数を超えたため、アキネータを終了します`);
                await collector.stop();
            }
        }
    });
    // メッセージが取得できなかったら
    collector.on('end', async (collected) => {
        if ((collected.size - 1) != missType) {
            // タイムアウトなどの終了時の処理を行う
            await interaction.channel.send(`しばらくメッセージを受信できなかったため、アキネータを終了します`);
            await collector.stop();
        }
    });

}

async function checkContent(content, messages, length)
{
    for(let i = 0; i < length; i++)
    {
        if(content.includes(messages[i]))
        {
            return i;
        }
    }
    if(content === '戻る')
        return -1;
    return -404;
}