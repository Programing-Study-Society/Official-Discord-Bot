module.exports = {
    isPerfectEventSystem: (probabilities) => {
        let sum = 0.0;
        probabilities.forEach(probability => {
            sum += probability;
        });

        if (1.00000000005 < sum || sum < 0.99999999995) return false;
        else return true;
    },

    filterBy0and1: (probabilities) => {
        return [probabilities.filter((ele) => ele === 0), probabilities.filter((ele) => ele === 1)];
    },
}