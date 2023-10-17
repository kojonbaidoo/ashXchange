const express = require('express');
const app = express();
const { deploy, transfer, balance } = require('./contract_deploy');

app.use(express.json());

app.get('/balance', async (req, res) => {
    const {contractAddress, walletAddress} = req.body

    try{
        const walletBalance = await balance(contractAddress, walletAddress);
        res.send({wallet_balance : walletBalance})
    } catch(err){
        console.log(err);
        res.status(500).send({error: "Failed to retrieve balance"})
    }

});

app.post('/transfer', async (req, res) => {
    const {contractAddress, fromAddress, toAddress, amount, privateKey} = req.body;

    try{
        const receipt = await transfer(contractAddress, fromAddress, toAddress, amount, privateKey);
        res.send(receipt);
    } catch(err){
        console.log(err);
        res.status(500).send({error: "Transfer failed"})
    }

});

app.post('/deploy', async (req, res) => {
    const { name, symbol, initialSupply, deployerAccountPrivateKey} = req.body;

    try {
        const contract = await deploy(name, symbol, initialSupply, deployerAccountPrivateKey);
        res.send({ contractAddress: contract.options.address });
    } catch (err) {
        console.log(err)
        res.status(500).send({ error: 'Failed to deploy contract' });
    }
});

app.listen(3000, () => console.log('Listening on port 3000'));
