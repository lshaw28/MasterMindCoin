const PubNub = require('pubnub');

const credentials = {
    publishKey: 'pub-c-5549df62-f068-44d4-acf9-b334d75417e2',
    subscribeKey: 'sub-c-55d792a8-9931-11e9-bd9d-d2f33584f169',
    secretKey: 'sec-c-YzBkOWI1NzUtZDc2OC00ZmIzLThjM2MtMWY2OTZmNDZiN2I0'
};

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN'
};

class PubSub {
    constructor({ blockchain }) {
        this.blockchain = blockchain;

        this.pubnub = new PubNub(credentials);

        this.pubnub.subscribe({ channels: [Object.values(CHANNELS)] });

        this.pubnub.addListener(this.listener());
    }

    listener() {
        return {
            message: messageObject => {
                const { channel, message } = messageObject;

                console.log(`Message recieved. Channel: ${channel}. Message: ${message}.`);

                const parsedMessage = JSON.parse(message);

                if (channel === CHANNELS.BLOCKCHAIN) {
                    this.blockchain.replaceChain(parsedMessage);
                }
            }
        };
    }

    publish({ channel, message }) {
        this.pubnub.publish({ message, channel });
    }

    broadcastChain() {
        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain)
        });
    }
}

module.exports = PubSub;