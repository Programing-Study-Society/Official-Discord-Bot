// axiosモジュールをインポート
const axios = require('axios');

// Deepl翻訳のAPIを使って第一引数の文章を第二引数の言語に翻訳して返す関数ただし、第3引数に設定されているタグ内は翻訳しない
exports.translateText = function(inputSentence, language,ignoreList)
{
  const sourceText = inputSentence; // 翻訳前の文章を受け取る
  const lang = language; // 翻訳先の言語を受け取る
  const ignores = ignoreList;// 翻訳の対象外となるタグを受け取る
  const { apiKey } = require('../../config.json');// 設定ファイルからAPIキー情報を呼び出し、変数に保存

  // 受け取った入力をコンソールに出力
  console.log("\n翻訳前の文章：" + sourceText);
  console.log("\n翻訳先の言語：" + language);

  // APIの使用
  return axios
    .post('https://api-free.deepl.com/v2/translate', null, {
      params: {
        auth_key: apiKey,// APIキー
        text: sourceText,// 翻訳前の文章
        target_lang: lang,// 翻訳先の言語コード
        tag_handling: 'xml',// XML構造にする
        ignore_tags: ignores,// 翻訳の対象外となるタグを指定
      },
    })
    .then(response => {
      const translation = response.data.translations[0].text;// 翻訳後の文章を保存
      console.log("\n翻訳後の文章：" + translation);// 翻訳結果をコンソールに出力
      return translation;// 翻訳後の文章を返す
    })
    .catch(error => {
      console.error(error);// エラー時、エラー文をコンソールに表示
    });
};
