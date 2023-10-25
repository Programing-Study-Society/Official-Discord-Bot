// ノードを表すクラス
class Node {
  constructor(char, freq) {
    this.char = char; // 文字
    this.freq = freq; // 出現確率
    this.left = null; // 左の子ノード
    this.right = null; // 右の子ノード
  }
}

// ハフマンツリーを構築する関数
function buildHuffmanTree(data) {
  // プライオリティキューを初期化し、文字と確率を持つノードを追加
  const priorityQueue = data.map(item => new Node(item.char, item.freq));

  // プライオリティキュー内のノードを出現確率の昇順でソートし、
  // ハフマンツリーを構築
  let i = 0;
  while (priorityQueue.length > 1) {
      i++;
      priorityQueue.sort((a, b) => {
          if (a.freq === b.freq) {
            // フリークエンシーが同じ場合、文字を比較
            return b.char.localeCompare(a.char);
          }
          // フリークエンシーが異なる場合、通常の比較
          return a.freq - b.freq;
        });
    console.log(priorityQueue);
    const left = priorityQueue.shift();
    const right = priorityQueue.shift();
    const parent = new Node("G" + i, left.freq + right.freq);
    parent.left = left;
    parent.right = right;
    priorityQueue.push(parent);
  }

  // ハフマンツリーのルートを返す
  return priorityQueue[0];
}

// ハフマン符号を生成する関数
function generateHuffmanCodes(root) {
  const huffmanCodes = new Map();

  // ハフマンツリーを再帰的にトラバースし、符号を生成
  function traverse(node, code) {
      console.log(node.char, code);
      if (node.char !== null) {
          huffmanCodes.set(node.char, code); // ハフマン符号をマップに保存
      }
      if (node.left) {
          console.log(node.char + "の左は" + node.left.char, code + "1");
          traverse(node.left, code + "1"); // 左の子ノードに '0' を追加
      }
      if (node.right) {
          console.log(node.char + "の右は" + node.right.char, code + "0");  
          traverse(node.right, code + "0"); // 右の子ノードに '1' を追加
      }
  }

  // ハフマンツリーのルートからトラバースを開始
  traverse(root, "");
  return huffmanCodes; // ハフマン符号を返す
}

// ハフマン符号化を行う関数
function huffmanCoding()
{
  // ハフマンツリーを構築し、ハフマン符号を生成
  const huffmanTree = buildHuffmanTree(data);
  const huffmanCodes = generateHuffmanCodes(huffmanTree);

  // data配列をループしてMapの値（charとfreq）をsortArr配列に追加
  const sortArr = [];
  data.forEach(item => {
    const char = item.char;
    if (huffmanCodes.has(char)) {
      sortArr.push({ char, code: huffmanCodes.get(char) });
    }
  });

  // ハフマン符号を返す
  return sortArr;
}



// テスト(実行部分)
// テストデータ - 文字と確率の配列
const data = [
  { char: 'A1', freq: 0.09 },
  { char: 'A2', freq: 0.14 },
  { char: 'A3', freq: 0.40 },
  { char: 'A4', freq: 0.15 },
  { char: 'A5', freq: 0.11 },
  { char: 'A6', freq: 0.11 },
];

const ans = huffmanCoding(data);
console.log("ハフマン符号:", ans);