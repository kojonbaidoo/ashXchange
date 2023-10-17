const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

const serviceAccount = require('./path/to/serviceAccountKey.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();


const add_security = async (contractAddress, name, price, creatorID) => {
    const docRef = db.collection('SECURITIES');

    await docRef.set({
        contract_address: contractAddress,
        name: name,
        price: price,
        user_id: creatorID
    });
}

const add_user = async (email, name, password, walletAddress) => {
    const docRef = db.collection('SECURITIES');

    await docRef.set({
        email: email,
        name: name,
        password: password,
        wallet_address: walletAddress
    });
}

const add_transaction = async (amount, hash, price,receipient_id,security_id,sender_id) => {
    await docRef.set({
        amount: amount,
        hash: hash,
        receipient_id: receipient_id,
        security_id: security_id,
        sender_id: sender_id
    });
}