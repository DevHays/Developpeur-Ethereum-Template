async function main(){
    
    var  Web3  =  require('web3');  
    require('dotenv').config();
    const HDWalletProvider = require('@truffle/hdwallet-provider');
    provider = new HDWalletProvider(`${process.env.MNEMONIC}`,`https://ropsten.infura.io/v3/a3ae104c933f41f2b88771bdc4cc4743`)
    web3  =  new  Web3(provider);

    console.log('Calling Contract.....');

    var  abi  =  [
        {
            "inputs": [],
            "name": "retrieve",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "num",
                    "type": "uint256"
                }
            ],
            "name": "store",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ];
    var  addr  =  "0x003b0eE8a4C603017A6B7dD6e209b3eEd5f803EE";

    var  Contract  =  new  web3.eth.Contract(abi, addr);
    console.log(Contract);

    // 0xaFc364Bc3E44Bd45FD450580A5C35a7954148da9
    // FUNCTION must the name of the function you want to call. 
    Contract.methods.retrieve().call().then(console.log);
    try{
    await Contract.methods.store(999).send({ from : `0x6697370de5140A5A7d7bB85071Bf481E581F4cE8`});
    }catch(error){
        console.log("ERROR : ", error);
    }
    Contract.methods.retrieve().call().then(console.log);
}

main();