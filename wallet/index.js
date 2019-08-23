const { STARTING_BALANCE } = require('../config');
const { ec } = require('../util');
const cryptohash = require('../util/crypto-hash');

class Wallet {
    constructor() {
        this.balance = STARTING_BALANCE;

        const keyPair = ec.genKeyPair();

        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    sign() {
        return this.keyPair.sign(data)
    }
};

module.exports = Wallet; 