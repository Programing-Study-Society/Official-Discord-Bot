module.exports = {
    optimizeProbabilities: (probabilities) => probabilities.map((ele) => Math.round(ele * 100000000)/100000000),

    isPerfectEventSystem: (arg_probabilities) => {

        let probabilities = module.exports.optimizeProbabilities(arg_probabilities);

        let sum = 0.0;
        probabilities.forEach(probability => {
            sum += probability;
        });

        sum = Math.round(sum * 100000000) / 100000000;

        console.log('sum : ' + sum);

        if (sum !== 1.0) return false;
        else return true;
    },

    filterBy0and1: (probabilities) => {
        return [probabilities.filter((ele) => ele === 0), probabilities.filter((ele) => ele === 1)];
    },
}