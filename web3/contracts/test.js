const algosdk = require('algosdk');

// Set up the Algorand client
const algodToken = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
const algodServer = 'http://localhost';
const algodPort = '4001';
const client = new algosdk.Algodv2(algodToken, algodServer, algodPort);

// Convert the mnemonic to a secret key
const senderAccount = algosdk.mnemonicToSecretKey('story keen gorilla slide question skill derive knock become venture winner omit faint spell disorder puzzle very rifle worry still combine write fitness absent afraid');

console.log(senderAccount.addr);