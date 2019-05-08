const middleValueFromTriplet = (...args) => {
    if (args.filter((_) => _).length !== 3) {
        throw Error(`You should provide three values to middleValueFromTriplet, you provided ${args}`);
    }

    const [, middle] = args.sort((a, b) => a - b);
    return middle;
};

module.exports = middleValueFromTriplet;
