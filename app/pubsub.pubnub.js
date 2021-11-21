const PubNub = require('pubnub');

const credentials = {
    publishKey: 'pub-c-5549df62-f068-44d4-acf9-b334d75417e2',
    subscribeKey: 'sub-c-55d792a8-9931-11e9-bd9d-d2f33584f169',
    secretKey: 'sec-c-YzBkOWI1NzUtZDc2OC00ZmIzLThjM2MtMWY2OTZmNDZiN2I0'
};

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN',
    TRANSACTION: 'TRANSACTION'
  };

  class PubSub {
    constructor({ blockchain, transactionPool, wallet }) {
      this.blockchain = blockchain;
      this.transactionPool = transactionPool;
      this.wallet = wallet;
  
      this.pubnub = new PubNub(credentials);
  
      this.pubnub.subscribe({ channels: Object.values(CHANNELS) });
  
      this.pubnub.addListener(this.listener());
    }
  
    broadcastChain() {
      this.publish({
        channel: CHANNELS.BLOCKCHAIN,
        message: JSON.stringify(this.blockchain.chain)
      });
    }
  
    broadcastTransaction(transaction) {
      this.publish({
        channel: CHANNELS.TRANSACTION,
        message: JSON.stringify(transaction)
      });
    }
  
    subscribeToChannels() {
      this.pubnub.subscribe({
        channels: [Object.values(CHANNELS)]
      });
    }
  
    listener() {
      return {
        message: messageObject => {
          const { channel, message } = messageObject;
  
          console.log(`Message received. Channel: ${channel}. Message: ${message}`);
          const parsedMessage = JSON.parse(message);
  
          switch(channel) {
            case CHANNELS.BLOCKCHAIN:
              this.blockchain.replaceChain(parsedMessage, true, () => {
                this.transactionPool.clearBlockchainTransactions(
                  { chain: parsedMessage.chain }
                );
              });
              break;
            case CHANNELS.TRANSACTION:
              if (!this.transactionPool.existingTransaction({
                inputAddress: this.wallet.publicKey
              })) {
                this.transactionPool.setTransaction(parsedMessage);
              }
              break;
            default:
              return;
          }
        }
      }
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
  
    broadcastTransaction(transaction) {
      this.publish({
        channel: CHANNELS.TRANSACTION,
        message: JSON.stringify(transaction)
      });
    }
  }
  
  module.exports = PubSub;