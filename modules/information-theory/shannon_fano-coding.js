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