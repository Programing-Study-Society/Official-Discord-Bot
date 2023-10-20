// 設定ファイルからOPENAI_API_KEY情報を呼び出し、変数に保存
const { OPENAI_API_KEY } = require('../../config.json');

// openaiライブラリをインポート
const { Configuration, OpenAIApi } = require("openai");

// 設定オブジェクトを作成
const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});

// OpenAI APIへの接続を作成
const openai = new OpenAIApi(configuration);

// ChatGPTとのやり取りを格納しておく配列
let messages = [];

// messagesの要素全てを削除する関数
exports.logElimination = function()
{
  // 配列の要素を全削除する (インデックス0以降のすべての要素を削除)
  messages.splice(0);
  console.log("\nChatGPTとのやり取りを全て削除");
}

// ChatGPTのAPIに文章を送信・受信して、返答を返す関数
exports.sendToChatGPTAPI = async function(inputSentence)
{

  // 入力を配列に格納
  if(messages.length <= 2) // 記録されているやり取りが2つ(1往復)以内ならそのまま挿入
  {
    messages.push({role: "user", content: inputSentence})// 一番後ろに送信する文章を追加
  }
  else// 記録されているやり取りが既に3つ(2往復)以上入っていたら古い2つ(1往復)を削除してから挿入
  {
    messages.shift()// 先頭から1番目を削除
    messages.shift()// 先頭から2番目を削除
    messages.push({role: "user", content: inputSentence})// 一番後ろに送信する文章を追加
  }

  // ChatGPTからの返信前の配列の様子をコンソールに出力
  console.log("\n返信前");
  for (const mes of messages){
    console.log({mes});
  }

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: messages,
  });

  // ChatGPTからの返答を格納
  const outputSentence = completion.data.choices[0].message.content;

  // ChatGPTからの返答を配列に格納
  messages.push({role: "assistant", content: outputSentence})

  // ChatGPTからの返信後の配列の様子をコンソールに出力
  console.log("\n返信後");
  for (const mes of messages) {
    console.log({mes});
  }

  // ChatGPTからの返答を返す
  return outputSentence;
}