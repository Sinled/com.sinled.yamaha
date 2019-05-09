const isNumber = (value) => !isNaN(parseInt(value, 10));

const middleValueFromTriplet = (...args) => {
    if (args.filter(isNumber).length !== 3) {
        throw Error(`You should provide three values to middleValueFromTriplet, you provided ${args}`);
    }

    const [, middle] = args.sort((a, b) => a - b);
    return middle;
};

module.exports = { middleValueFromTriplet };
