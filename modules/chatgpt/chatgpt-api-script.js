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
const messages = {};

// 辞書内のキーと値のペアを追加または更新する関数
function addToDictionary(key, role, value) {
  if (!messages[key]) {
    // キーが存在しない場合は、新しい配列を作成して値を追加
    messages[key] = [{role: role, content: value}];
  } else {
    // キーがすでに存在する場合は、値を既存の配列にプッシュ
    messages[key].push({role: role, content: value});
  }

  if(messages[key].length > 3) // 往復分 + 今の会話を超えたら
  {
    messages[key].shift()// 先頭から1番目を削除
  }
}

// チャンネル毎のmessagesの要素を削除する関数
exports.logDeletionThisChannel = function(key)
{
  // 配列の要素を全削除する
  delete messages[key];
  console.log("\nこのチャンネルのChatGPTとの会話ログを削除しました");
}

// 全てのチャンネルのmessagesの要素を削除する関数
exports.logDeletionAll = function()
{
  for (let key in messages) {
    delete messages[key];
  }
}

// ChatGPTのAPIに文章を送信・受信して、返答を返す関数
exports.sendToChatGPTAPI = async function(channellid, inputSentence)
{
  const key = channellid;// チャンネルIDを受け取る
  const sentence = inputSentence;// 送信されたメッセージを受け取る

  // 入力を配列に格納
  addToDictionary(channellid, "user", sentence);

  // ChatGPTからの返信前の配列の様子をコンソールに出力
  console.log("\n返信前");
  for (const mes of messages[channellid]){
    console.log({mes});
  }

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: messages[channellid],
  });

  // ChatGPTからの返答を格納
  const outputSentence = completion.data.choices[0].message.content;

  // ChatGPTからの返答を配列に格納
  addToDictionary(channellid, "assistant", outputSentence);

  // ChatGPTからの返信後の配列の様子をコンソールに出力
  console.log("\n返信後");
  for (const mes of messages[key]) {
    console.log({mes});
  }

  // ChatGPTからの返答を返す
  return outputSentence;
}