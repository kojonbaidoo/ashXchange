

const testFunction = async (contractAddress, gas, senderPrivateKey) => {
    const contract = new web3.eth.Contract(ContractABI, contractAddress);
    const tx = {
        to: contractAddress,
        data: contract.methods.myFunction(arg1, arg2).encodeABI(),
        gas: gas,
      };
      
    const signedTx = await web3.eth.accounts.signTransaction(tx, senderPrivateKey);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    
}  