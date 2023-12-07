const algosdk = require('algosdk');

async function retrieveProfileInformation(client, accountAddress, appId) {
  console.log('and then hereee')
  // Get the account information
  const accountInfo = await client.accountInformation(accountAddress).do();
  // Find the local state for the smart contract
  const appLocalState = accountInfo['apps-local-state'].find(app => app.id === appId);
  console.log('and here hahahahaha')
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

(async () => {
    const algodToken = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
    const algodServer = 'http://localhost';
    const algodPort = '4001';
  const client = new algosdk.Algodv2(algodToken, algodServer, algodPort);
  console.log(client);
  // Replace with your account address and application ID
  // const accountAddress = 'TJ5Y4W2WQTJUFYV3E7WC6Y4FSAJMSIXLNVMUSU3DTXAICP3W73UXR35X4U';
  const accountAddress = "QM55E4M675NQ5KGMZNLGUHMOYBESM4BYMSFCW4HNSEGPFXHYDVOXZECGTI";
  const appId = 1003; // Replace with your actual app ID
  console.log('here');
  try {
    console.log('now here');
    const profileInformation = await retrieveProfileInformation(client, accountAddress, appId);
    console.log(profileInformation);
  } catch (error) {
    console.error('Failed to retrieve profile information:', error);
  }
})();
// glance sphere tip scissors arrive napkin tomato atom real credit inmate worth acoustic success drive display tray attend when vault pear century fire able casino
// ./sandbox goal clerk send -a 4000000000000 -f S4GHBDKUH4GWDQBGPZU7V25R6VLZTNUZGJWP6QTPTNUZWPQVMJCEWWZ7CE -t TJ5Y4W2WQTJUFYV3E7WC6Y4FSAJMSIXLNVMUSU3DTXAICP3W73UXR35X4U
// const algosdk = require('algosdk');

// function decodeBase64(base64Str) {
//   return Buffer.from(base64Str, 'base64');
// }
// function decodeGlobalState(globalState) {
//   return globalState.map(entry => {
//       const keyBuffer = decodeBase64(entry.key);
//       const key = keyBuffer.toString('utf8');
//       let value;
//       if (entry.value.type === 1) { // Byte slice
//           const valueBuffer = decodeBase64(entry.value.bytes);
//           // List of keys that store textual data
//           const textKeys = ['day_of_week', 'category', 'title', 'description', 'is_auction'];
//           // Convert addresses to Algorand address format
//           if (key === 'creator_address' || key === 'owner_address') {
//               value = algosdk.encodeAddress(valueBuffer);
//           }
//           // Decode textual data
//           else if (textKeys.includes(key)) {
//               value = valueBuffer.toString('utf8');
//           }
//           // Decode other byte slices as hexadecimal
//           else {
//               value = valueBuffer.toString('hex');
//           }
//       } else { // Integer
//           const buffer = decodeBase64(entry.value.bytes);
//           value = buffer.readBigUInt64BE().toString(); // Convert to bigint for large integers
//       }
//       return { key, value };
//   });
// }
// async function retrieveGlobalState(client, appId) {
//   const appInfo = await client.getApplicationByID(appId).do();
//   const globalState = appInfo.params['global-state'];
//   const decodedState = decodeGlobalState(globalState);
//   return decodedState;
// }
// (async () => {
//   const algodToken = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
//   const algodServer = 'http://localhost';
//   const algodPort = '4001';
//   const client = new algosdk.Algodv2(algodToken, algodServer, algodPort);
//   const appId = 1319; // Replace with your actual app ID
//   try {
//     const globalStateInformation = await retrieveGlobalState(client, appId);
//     console.log(globalStateInformation);
//   } catch (error) {
//     console.error('Failed to retrieve global state information:', error);
//   }
// })();