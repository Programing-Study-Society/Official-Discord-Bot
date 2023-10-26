const { 
  ActionRowBuilder,
  SlashCommandBuilder,
  TextInputStyle,
  ModalBuilder,
  TextInputBuilder,
  EmbedBuilder,
} = require('discord.js');

const {efficiency} = require('./efficiency');

// シャノン・ファノ符号化のためのノードオブジェクト
class Node {
    constructor(char, probability) {
      this.char = char; // シンボル
      this.probability = probability; // シンボルの出現確率
      this.code = ''; // シンボルに対応する符号
    }
  }
  
// シャノン・ファノ符号化のメイン関数
module.exports = {
  shannonFanoCodin: (signNames, freqs) => {

    // data配列を作成
    const data = [];
    for (let i = 0; i < signNames.length && i < freqs.length; i++) {
        const node = new Node(signNames[i], freqs[i]);
        data.push(node);
    }

    // シンボルの確率で降順にソート
    data.sort((a, b) => b.probability - a.probability);
  
    // 再帰的に符号化を実行する関数
    function encode(nodes) {
      if (nodes.length === 1) {
        return; // 1つのノードだけ残ったら再帰を終了
      }
  
      // 確率の差が最小になる分割点を見つける
      let minDifference = Number.MAX_VALUE;
      let splitIndex = -1;
      
      for (let i = 1; i < nodes.length; i++) {
        const leftSum = nodes.slice(0, i).reduce((sum, node) => sum + node.probability, 0);
        const rightSum = nodes.slice(i).reduce((sum, node) => sum + node.probability, 0);
        const difference = Math.abs(leftSum - rightSum);
        
        if (difference < minDifference) {
          minDifference = difference;
          splitIndex = i;
        }
      }
  
      // 符号を割り当て
      nodes.slice(0, splitIndex).forEach(node => (node.code += '0'));
      nodes.slice(splitIndex).forEach(node => (node.code += '1'));
  
      // 再帰的に左右の部分を処理
      encode(nodes.slice(0, splitIndex));
      encode(nodes.slice(splitIndex));
    }
  
    encode(data);
  
    // シンボル順に整列された配列を作成
    const sortedData = data.slice().sort((a, b) => a.char.localeCompare(b.char));
  
    // 結果を整列されたセットの配列にして返す
    return sortedData.map(node => ({ char: node.char, code: node.code }));
  },

  data: new SlashCommandBuilder()
  .setName('info shannon-fano-coding')
  .setDescription('シャノン・ファノ符号化'),

  execute: async (interaction) => {
    const modal = new ModalBuilder()
        .setCustomId('info-shannon_fano-coding')  
        .setTitle('シャノン・ファノ符号化を行います');

    const signNamesForm = new TextInputBuilder()
        .setCustomId('signNames')
        .setLabel("各符号名 ( 半角数字 ,区切り ) 例：A1,A2,A3")
        .setStyle(TextInputStyle.Short);

    const probabilitiesForm = new TextInputBuilder()
        .setCustomId('probabilities')
        .setLabel("各事象の確率 ( 半角数字 ,区切り )")
        .setStyle(TextInputStyle.Short);
    
    modal.addComponents(
        new ActionRowBuilder().addComponents(signNamesForm),
        new ActionRowBuilder().addComponents(probabilitiesForm),
    )
    
    await interaction.showModal(modal);
    const filter = (mInteraction) => mInteraction.customId === 'info-shannon_fano-coding';
    interaction.awaitModalSubmit({ filter, time: 600000 })
        .then(async (mInteraction) => {
            const inputSignNames = mInteraction.fields.getTextInputValue('signNames');
            const inputProbabilities = mInteraction.fields.getTextInputValue('probabilities');
    
            let signNames = inputSignNames.split(/,\s{0,}/);
            let probabilities = inputProbabilities.split(/,\s{0,}/);

            if(signNames.length != probabilities.length){
                return mInteraction.reply({
                    content: 'フォームに入力された値に不備があります。',
                    ephemeral: true 
                });
            }

            probabilities = probabilities.map((ele) => {
                if(ele.match(/^[0-9]{1,}\/[0-9]{1,}$/)){
                    return Number(ele.split(/\//)[0]) / Number(ele.split(/\//)[1]);
                } else if (ele.match(/^[0-9]{1,}.[0-9]{1,}$/)) {
                    return Number(ele);
                } else {
                    return NaN;
                }
            });

            const shannonFanoCodesValue = module.exports.shannonFanoCodin(signNames, probabilities); // シャノン・ファノ符号語を求める
            const shannonFanoCodesArray = shannonFanoCodesValue.map(item => `${item.char}: ${item.code}`); // シャノン・ファノ符号語をstr型に変換
            const shannonFanoString = shannonFanoCodesArray.join('\n'); // ,を\nに変換
            const codesLength = shannonFanoCodesValue.map((ele) => { // 符号長を計算
                return ele.code.length;
            })
            const efficiencyValue = efficiency(codesLength ,probabilities); // 能率を求める
            
            if(
                efficiencyValue === 0 || efficiencyValue === NaN){
                return mInteraction.reply({ 
                    content: 'フォームに入力された値に不備があります。', 
                    ephemeral: true 
                });
            }else{
                return mInteraction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`ハフマン符号語：\n${shannonFanoString}`)
                            .setColor(7506394),
                        new EmbedBuilder()
                            .setTitle(`能率e：${efficiencyValue}`)
                            .setColor(7506394)
                    ]
                });
            }
        })
        .catch(console.error);
  }
}

// ↓わざわざ関数化する必要が無いと判断したためコメントアウト
  // function efficiencyForShannonFanoCoding(shannonFanoman, freqs)
  // {
  //   const codesLength = shannonFanoman.map((ele) => {
  //     return ele.code.length;
  //   })

  //   const {efficiency} = require('../information-theory/efficiency');
  //   const eff = efficiency(codesLength, freqs);
  //   return eff;
  // }

  // function test()
  // {

  //   const signNames = [
  //     'A1',
  //     'A2',
  //     'A3',
  //     'A4',
  //     'A5',
  //     'A6',
  //     'A7',
  //     'A8',
  //   ]
  
  //   const freqs = [
  //     0.16,
  //     0.01,
  //     0.13,
  //     0.09,
  //     0.41,
  //     0.02,
  //     0.14,
  //     0.04,
  //   ]
    
  //   const ans = shannonFano(signNames, freqs);
  //   console.log("シャノン・ファノ符号",ans);
  //   const eff = efficiencyForShannonFanoCoding(ans,freqs);
  //   console.log("能率:", eff);
  // }

  // test();