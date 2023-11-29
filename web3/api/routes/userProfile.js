const algosdk = require('algosdk');
require("dotenv").config();
const express = require("express");
const router = express.Router();

const algodToken = process.env.ALGOD_TOKEN;
const algodServer = process.env.ALGOD_SERVER;
const algodPort = process.env.ALGOD_PORT;
const client = new algosdk.Algodv2(algodToken, algodServer, algodPort);
const appId = parseInt(process.env.PROFILE_APP_ID, 10);
const PROFILE_APP_ID = parseInt(process.env.PROFILE_APP_ID);
const TIMESLOT_APP_ID = parseInt(process.env.TIMESLOT_APP_ID);
const GOD_SEED = process.env.GOD_SEED
async function retrieveProfileInformation(client, accountAddress, appId) {
  // Get the account information
  const accountInfo = await client.accountInformation(accountAddress).do();
  console.log('accountInfo', accountInfo);

  // Find the local state for the smart contract
  const appLocalState = accountInfo['apps-local-state'].find(app => app.id === appId);
  console.log('appLocalState', appLocalState);
  if (appLocalState && appLocalState['key-value']) {
    // Extract the key-value pairs from the local state
    const keyValuePairs = appLocalState['key-value'];
    const profile = {};

    keyValuePairs.forEach(pair => {
      const key = Buffer.from(pair.key, 'base64').toString();
      const value = pair.value.bytes ? Buffer.from(pair.value.bytes, 'base64').toString() : pair.value.uint;
      profile[key] = value;
    });

    return profile;
  }
  return null;
}

// create or update a profile in blockchain
router.patch("/", async (req, res) => {
  console.log(req.body);
  try {
    const { fullname, username, gender, bio, seed } =
      req.body;
    const senderAccount = algosdk.mnemonicToSecretKey(seed);
    const params = await client.getTransactionParams().do();
    params.flatFee = true;
    params.fee = 1000;
    console.log('in patch right now')
    // update or insert profile into the blockchain
    const args = [
      new Uint8Array(Buffer.from(fullname)),
      new Uint8Array(Buffer.from(username)),
      new Uint8Array(Buffer.from(gender)),
      new Uint8Array(Buffer.from(bio))
    ];
    console.log('uerere')
    const txn = algosdk.makeApplicationNoOpTxn(senderAccount.addr, params, appId, args);
    const signedTxn = txn.signTxn(senderAccount.sk);
    const txId = txn.txID().toString();
    await client.sendRawTransaction(signedTxn).do();
    const confirmedTxn = await algosdk.waitForConfirmation(client, txId, 4);
    console.log('Transaction ' + txId + ' confirmed in round ' + confirmedTxn['confirmed-round']);
    res
      .status(200)
      .json({ message: "Profile updated successfully", message: 'User Updated Successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch user profile route
router.get("/:address", async (req, res) => {
  console.log('here')
  try {
    const accountAddress = req.params.address;
    const profileInformation = await retrieveProfileInformation(client, accountAddress, appId);
    console.log(profileInformation);
    if (!profileInformation) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(profileInformation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/transferFromGodAccount', async (req, res) => {
  console.log('Transfer from God account');
  const seed = req.body.seed;
  const senderAccount = algosdk.mnemonicToSecretKey(seed);
  const senderSeedPhrase = GOD_SEED;
  const godAccount = algosdk.mnemonicToSecretKey(senderSeedPhrase);

  let params = await client.getTransactionParams().do();

  let send_amttxn = algosdk.makePaymentTxnWithSuggestedParams(
    godAccount.addr,
    senderAccount.addr,
    100000000,
    undefined,
    undefined,
    params
  );

  let sendamt_signedTxn = send_amttxn.signTxn(godAccount.sk);
  let sendamt_sendTx = await client.sendRawTransaction(sendamt_signedTxn).do();
  let sendamt_confirmedTxn = await algosdk.waitForConfirmation(client, sendamt_sendTx.txId, 4);

  console.log("Transaction " + sendamt_sendTx.txId + " confirmed in round " + sendamt_confirmedTxn["confirmed-round"]);
  res.status(200).json({ success: true, message: 'Transfer from God account successful!' });
});

router.post('/optIntoProfileContract', async (req, res) => {
  console.log('Opting into Profile Smart Contract');
  const seed = req.body.seed;
  const senderAccount = algosdk.mnemonicToSecretKey(seed);

  let params = await client.getTransactionParams().do();
  params.flatFee = true;
  params.fee = 1000;

  const ptxn = algosdk.makeApplicationOptInTxn(senderAccount.addr, params, PROFILE_APP_ID);
  const psignedTxn = ptxn.signTxn(senderAccount.sk);
  const ptxId = ptxn.txID().toString();

  await client.sendRawTransaction(psignedTxn).do();
  const pconfirmedTxn = await algosdk.waitForConfirmation(client, ptxId, 4);

  console.log('Opt-in transaction ' + ptxId + ' confirmed in round ' + pconfirmedTxn['confirmed-round']);
  res.status(200).json({ success: true, message: 'Opted into Profile Smart Contract successfully!' });
});

router.post('/optIntoTimeslotContract', async (req, res) => {
  console.log('Opting into Timeslot Smart Contract');
  const seed = req.body.seed;
  const senderAccount = algosdk.mnemonicToSecretKey(seed);

  let params = await client.getTransactionParams().do();
  params.flatFee = true;
  params.fee = 1000;

  const ttxn = algosdk.makeApplicationOptInTxn(senderAccount.addr, params, TIMESLOT_APP_ID);
  const tsignedTxn = ttxn.signTxn(senderAccount.sk);
  const ttxId = ttxn.txID().toString();

  await client.sendRawTransaction(tsignedTxn).do();
  const tconfirmedTxn = await algosdk.waitForConfirmation(client, ttxId, 20);

  console.log('Opt-in transaction ' + ttxId + ' confirmed in round ' + tconfirmedTxn['confirmed-round']);
  res.status(200).json({ success: true, message: 'Opted into Timeslot Smart Contract successfully!' });
});

router.post('/createProfileTransaction', async (req, res) => {
  console.log('Creating Profile Smart Contract Transaction');
  const seed = req.body.seed;
  const senderAccount = algosdk.mnemonicToSecretKey(seed);

  let params = await client.getTransactionParams().do();

  const args = [
    new Uint8Array(Buffer.from('Full Name')),
    new Uint8Array(Buffer.from('username')),
    new Uint8Array(Buffer.from('Gender')),
    new Uint8Array(Buffer.from('This is a default bio'))
  ];

  const txn = algosdk.makeApplicationNoOpTxn(senderAccount.addr, params, PROFILE_APP_ID, args);
  const signedTxn = txn.signTxn(senderAccount.sk);
  const txId = txn.txID().toString();

  await client.sendRawTransaction(signedTxn).do();
  const confirmedTxn = await algosdk.waitForConfirmation(client, txId, 4);

  console.log('Transaction ' + txId + ' confirmed in round ' + confirmedTxn['confirmed-round']);
  res.status(200).json({ success: true, message: 'Profile Smart Contract transaction created successfully!' });
});

router.post('/getBalance', async (req, res) => {
  console.log('Getting balance in backend');
  const seed = req.body.seed;
  
  try {
    const senderAccount = algosdk.mnemonicToSecretKey(seed);
    const accountInfo = await client.accountInformation(senderAccount.addr).do();
    const balance = accountInfo.amount / 1e6; // Convert microAlgos to Algos

    res.status(200).json({ balance: balance });
  } catch (error) {
    console.error('Error getting balance:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;