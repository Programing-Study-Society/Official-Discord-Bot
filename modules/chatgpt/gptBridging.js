// 翻訳先の言語を選択するための疑似列挙型
const Language = Object.freeze({
  English: 'EN',
  Japanese: 'JA',
});

// 翻訳対象外の文字をタグで囲う関数
function addTag(inputSentence) {

  // "```【文字列】```"を"<```ignore>【文字列】</```ignore>"に置換する
  const replaced1 = inputSentence.replace(/```([\s\S]+?)```/g, '<```ignore>$1</```ignore>');

  // ###【文字列】###"を"<###ignore>【文字列】</###ignore>"に置換する
  const replaced2 = replaced1.replace(/###([\s\S]+?)###/g, '<###ignore>$1</###ignore>');

  console.log("\nタグで置換後:" + replaced2);

  return replaced2;
}

// タグで囲われた文字を元に戻す関数
function removeTag(outputSentence) {

  // "<```ignore>【文字列】</```ignore>"を"```【文字列】```"に置換する
  const replaced1 = outputSentence.replace(/<```ignore>([\s\S]+?)<\/```ignore>/g, '```$1```');

  // "<###ignore>【文字列】</###ignore>"を"【文字列】"に置換する
  const replaced2 = replaced1.replace(/<###ignore>([\s\S]+?)<\/###ignore>/g, '$1');

  console.log("\nタグを削除後:" + replaced2);

  return replaced2;
}

// gptBridging関数を非同期関数として宣言
exports.gptBridging = async function(inputSentence) {

  // 翻訳の対象外となるタグを格納する変数
  const ignoreList = '```ignore,###ignore';

  // 入力ワードを受け取る
  const inputSentence_JP = inputSentence;

  // スクリプト実行用のオブジェクトを作成
  const deeplScript = require('./deepl-script.js');
  const chatGPTAPIScript = require('./chatgpt-api-script.js');

  // 翻訳対象外の文字をタグで囲う
  const inputSentence_JP_addTag = await addTag(inputSentence_JP);

  // 入力ワード(日本語)を英語に翻訳
  const inputSentence_EN_addTag = await deeplScript.translateText(inputSentence_JP_addTag, Language.English, ignoreList);

  // タグで囲われた文字を元に戻す
  const inputSentence_EN_removeTag = await removeTag(inputSentence_EN_addTag);

  // ChatGPT_APIに入力ワード(英語)を送ってChatGPT_APIからの出力ワードを受け取る
  const outputSentence_EN = await chatGPTAPIScript.sendToChatGPTAPI(inputSentence_EN_removeTag);

  // 翻訳対象外の文字をタグで囲う
  const outputSentence_EN_addTag = await addTag(outputSentence_EN);

  // 出力ワード(英語)を日本語に翻訳
  const outputSentence_JP_addTag = await deeplScript.translateText(outputSentence_EN_addTag, Language.Japanese, ignoreList);

  // タグで囲われた文字を元に戻す
  const outputSentence_JP_removeTag = await removeTag(outputSentence_JP_addTag);

  // 出力ワード(日本語)をコンソール・ディスコードに出力
  return outputSentence_JP_removeTag;
}