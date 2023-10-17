const path = require('path');
const fs = require('fs');
const solc = require('solc');
const Web3 = require('web3');

// const web3 = new Web3('http://localhost:8545');  // Use your Ethereum node's address
const web3 = new Web3('http://127.0.0.1:8545');  // Use your Ethereum node's address
const source = fs.readFileSync('Token.sol', 'utf8');

const input = {
    language: 'Solidity',
    sources: {
        'Token.sol': {
            content: source
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*']
            }
        }
    }
};

const findImports = function (importPath) {
    console.log('Importing', importPath);
    importPath = path.join('./node_modules', importPath);
    if (fs.existsSync(importPath)) {
        return { contents: fs.readFileSync(importPath, 'utf8') };
    } else {
        return { error: 'File not found' };
    }
};

const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));
const bytecode = output.contracts['Token.sol']['Token'].evm.bytecode.object;
const abi = output.contracts['Token.sol']['Token'].abi;

module.exports.deploy = async (name, symbol, initialSupply, deployerAccountPrivateKey) => {
    const gasPrice = '20000000000';  // Get this from the Ethereum network
    const gas = 5000000;  // Get this from the Ethereum network

    const deployerAccount = web3.eth.accounts.privateKeyToAccount(deployerAccountPrivateKey);
    web3.eth.accounts.wallet.add(deployerAccount);
    
    const contract = new web3.eth.Contract(abi);

    return contract.deploy({
        data: bytecode,
        arguments: [name, symbol, initialSupply]
    }).send({
        from: deployerAccount.address,
        gas: gas,
        gasPrice: gasPrice
    });
};

module.exports.transfer = async (contractAddress, fromAddress, toAddress, amount, privateKey) => {
    const contract = new web3.eth.Contract(abi, contractAddress);  // abi should be the ABI of your contract

    const data = contract.methods.transfer(toAddress, amount).encodeABI();

    const gasPrice = await web3.eth.getGasPrice();
    const gasLimit = 100000;  // You may want to adjust this value
    const chainId = await web3.eth.getChainId();
    
    const rawTransaction = {
        'from': fromAddress,
        'gasPrice': web3.utils.toHex(gasPrice),
        'gasLimit': web3.utils.toHex(gasLimit),
        'to': contractAddress,
        'data': data,
        'chainId':chainId
    };

    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.accounts.wallet.add(account);

    const signedTx = await web3.eth.accounts.signTransaction(rawTransaction, privateKey);
    return web3.eth.sendSignedTransaction(signedTx.rawTransaction);    
};

module.exports.balance = async (contractAddress, walletAddress) => {
    const contract = new web3.eth.Contract(abi, contractAddress);
    const balance = await contract.methods.balanceOf(walletAddress).call();
    return balance;
}  



