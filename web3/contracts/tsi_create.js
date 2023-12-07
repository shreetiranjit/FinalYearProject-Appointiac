// const algosdk = require('algosdk');

async function retrieveTimeslotInformation(client, accountAddress, appId) {
    // Get the account information
    const accountInfo = await client.accountInformation(accountAddress).do();
  
    // Find the local state for the smart contract
    const appLocalState = accountInfo['apps-local-state'].find(app => app.id === appId);
  
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

const algosdk = require('algosdk');

async function updateTimeslot(senderMnemonic, appId, newStringId) {
    // Set up the Algorand client
    const algodToken = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
    const algodServer = 'http://localhost';
    const algodPort = '4001';
    const client = new algosdk.Algodv2(algodToken, algodServer, algodPort);

    // Convert the mnemonic to a secret key
    const senderAccount = algosdk.mnemonicToSecretKey(senderMnemonic);

    // Retrieve the current state of the smart contract
    const existingTimeslot = await retrieveTimeslotInformation(client, senderAccount.addr, appId);
    if (!existingTimeslot) {
        throw new Error("Failed to retrieve timeslot information or no timeslots found.");
    }

    // Find an empty timeslot
    let emptySlotIndex = -1;
    for (let i = 1; i <= 14; i++) {
        let key = "ts" + i;
        if (!existingTimeslot[key] || existingTimeslot[key] === "") {
            emptySlotIndex = i;
            break;
        }
    }

    if (emptySlotIndex === -1) {
        return {sussess: false, message : `Transaciton failed. The timeslot capacity is reached`};

    }

    // Populate the application arguments
    let appArgs = [];
    for (let i = 1; i <= 14; i++) {
        if (i === emptySlotIndex) {
            appArgs.push(new Uint8Array(Buffer.from(newStringId)));
        } else {
            let key = "ts" + i;
            if (existingTimeslot[key]) {
                appArgs.push(new Uint8Array(Buffer.from(existingTimeslot[key])));
            } else {
                appArgs.push(new Uint8Array(Buffer.from('')));
            }
        }
    }

    // Get transaction parameters
    const params = await client.getTransactionParams().do();

    // Create and send the transaction
    const txn = algosdk.makeApplicationNoOpTxn(senderAccount.addr, params, appId, appArgs);
    const signedTxn = txn.signTxn(senderAccount.sk);
    const txId = txn.txID().toString();
    await client.sendRawTransaction(signedTxn).do();
    const confirmedTxn = await algosdk.waitForConfirmation(client, txId, 4);

    return {success: true, message:`Transaction confirmed in round ${confirmedTxn['confirmed-round']}`};
}



// Usage Example
updateTimeslot('story keen gorilla slide question skill derive knock become venture winner omit faint spell disorder puzzle very rifle worry still combine write fitness absent afraid', 1481, 'KJ231J2JK123BNAODS')
    .then(result => console.log(result))
    .catch(error => console.error(error));
