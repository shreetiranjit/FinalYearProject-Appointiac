const algosdk = require('algosdk');

async function interactWithSmartContract() {
  // Algorand Testnet PureStake API Information
  const algodToken = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
  const algodServer = 'http://localhost';
  const algodPort = '4001';
  const client = new algosdk.Algodv2(algodToken, algodServer, algodPort);

  // Sender account (replace the placeholder with the mnemonic of your account)
  const senderAccount = algosdk.mnemonicToSecretKey('story keen gorilla slide question skill derive knock become venture winner omit faint spell disorder puzzle very rifle worry still combine write fitness absent afraid');

  // Smart Contract ID (replace the placeholder with your actual app id)
  const appId = 1003;

  // Define arguments to be sent to the smart contract
  const args = [
    new Uint8Array(Buffer.from('John Doe')),
    new Uint8Array(Buffer.from('johndoe')),
    new Uint8Array(Buffer.from('Male')),
    new Uint8Array(Buffer.from('This is a bio'))
  ];

  // Get suggested parameters
  const params = await client.getTransactionParams().do();
  params.flatFee = true;
  params.fee = 1000; // You can adjust this value according to network conditions

  // Create the transaction
  const txn = algosdk.makeApplicationNoOpTxn(senderAccount.addr, params, appId, args);
  const signedTxn = txn.signTxn(senderAccount.sk);
  const txId = txn.txID().toString();

  // Submit the transaction
  await client.sendRawTransaction(signedTxn).do();

  // Wait for confirmation
  const confirmedTxn = await algosdk.waitForConfirmation(client, txId, 20);

  // Log the result
  console.log('Transaction ' + txId + ' confirmed in round ' + confirmedTxn['confirmed-round']);
}

interactWithSmartContract().catch(e => {
  console.log(e);
});