const algosdk = require('algosdk');

async function optInToSmartContract() {
  // Set up the Algorand client (replace these values with your actual Algorand node configuration)
  const algodToken = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
  const algodServer = 'http://localhost';
  const algodPort = '4001';
  const client = new algosdk.Algodv2(algodToken, algodServer, algodPort);

  // Sender account (replace this mnemonic with the mnemonic of your account)
  const senderAccount = algosdk.mnemonicToSecretKey('story keen gorilla slide question skill derive knock become venture winner omit faint spell disorder puzzle very rifle worry still combine write fitness absent afraid');
  
  // Smart Contract ID (replace this with your actual application ID)
  const appId = 1002;

  // Get suggested transaction parameters
  const params = await client.getTransactionParams().do();
  params.flatFee = true;
  params.fee = 1000; // You can adjust the fee value according to the current network conditions

  // Create the application opt-in transaction
  const txn = algosdk.makeApplicationOptInTxn(senderAccount.addr, params, appId);
  const signedTxn = txn.signTxn(senderAccount.sk);
  const txId = txn.txID().toString();

  // Submit the transaction
  await client.sendRawTransaction(signedTxn).do();

  // Wait for confirmation
  const confirmedTxn = await algosdk.waitForConfirmation(client, txId, 20);

  // Log the result of the opt-in transaction
  console.log('Opt-in transaction ' + txId + ' confirmed in round ' + confirmedTxn['confirmed-round']);

  
}

optInToSmartContract().catch(e => {
  console.log(e);
});
