const SHA256 = require('crypto-js/sha256');

class Block{

    constructor(timestamp, transactions, prevHash = ''){
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.prevHash = prevHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.index + this.prevHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    MineBlock(difficulty){ 

        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')){
            this.nonce++;
            this.hash = this.calculateHash();
            
        }

        console.log("Block mined:  " + this.hash);
    }
}

class Transaction{

    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

}

class BlockChain{

    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2; // difficulty set to the amount of zeroes at the beginning of our hashs
        this.pendingTransactions = [];
        this.miningReward = 100; //mining reward for succesfull mining an ExampleCoin

    }

    createGenesisBlock(){
        return new Block("05/24/2020", "Genesis Block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];  
    }

    /**
     * 
     * @param {Integer} miningRewardAddress //address of miner where the reward will be sent
     * @description add block to the chain and sends reward to the miner
     */
    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransactions);
        block.MineBlock(this.difficulty)

        console.log("Mining Sucessful");
        this.chain.push(block);
        
        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)]; //resets pending transactions and gives the miner this.reward

    }

    createTransaction(Transaction){
        this.pendingTransactions.push(Transaction);
    }

    /**
     * checks the blockchain and returns your balance
     * @param {Integer} address of the balance we want
     * @returns {Integer} balance
     */
    getBalanceOfAddress(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions){

                if(trans.fromAddress == address){
                    balance = balance - trans.amount;
                }

                if(trans.toAddress == address){
                    balance = balance + trans.amount;
                }
            }
        }

        return balance;
    }

    isChainValid(){
        for (let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.prevHash !== previousBlock.hash){
                return false;
            }
        }

        return true; 

    }
}

let ExampleCoin = new BlockChain();

//console.log('Mining Block 1...');
//ExampleCoin.addBlock(new Block(1, '05/24/2020', {amount: 5}));

//console.log('Mining Block 2...');
//ExampleCoin.addBlock(new Block(2, '05/26/2020', {amount: 10}));

ExampleCoin.createTransaction(new Transaction('address1', 'address2', 200));
ExampleCoin.createTransaction(new Transaction('address2', 'address1', 50));

console.log('starting mining...');
ExampleCoin.minePendingTransactions('example-miner-address');

console.log('\nBalance of example miner = ' + ExampleCoin.getBalanceOfAddress('example-miner-address'));

console.log('starting next mining...');
ExampleCoin.minePendingTransactions('example-miner-address');
console.log('\nBalance of example miner = ' + ExampleCoin.getBalanceOfAddress('example-miner-address'));

