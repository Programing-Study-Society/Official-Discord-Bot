module.exports = {
    optimizeProbabilities: (probabilities) => probabilities.map((ele) => Math.round(ele * 100000000)/100000000),

    isPerfectEventSystem: (arg_probabilities) => {

        let probabilities = module.exports.optimizeProbabilities(arg_probabilities);

        const filterBy1 = probabilities.filter(ele => ele === 1);
        const filterBy0 = probabilities.filter(ele => ele === 0);
        
        // 確率が0を含む場合
        if (filterBy0.length > 0) {
            if (filterBy1.length === 1 && filterBy0.length === 1) {
                return true;
            } else {
                return false;
            }
        }

        let sum = 0.0;
        probabilities.forEach(probability => {
            sum += probability;
        });

        sum = Math.round(sum * 100000000) / 100000000;

        console.log('sum : ' + sum);

        if (sum !== 1.0) return false;
        else return true;
    },
}