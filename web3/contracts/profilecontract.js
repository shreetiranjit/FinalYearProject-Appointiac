const algosdk = require('algosdk');
const fs = require('fs');

// Algorand Testnet PureStake API Information
const algodToken = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
const algodServer = 'http://localhost';
const algodPort = '4001';

// Your account mnemonics
const senderMnemonic = 'story keen gorilla slide question skill derive knock become venture winner omit faint spell disorder puzzle very rifle worry still combine write fitness absent afraid';

// Instantiate the algod wrapper
let algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

// Function to compile program source
async function compileProgram(client, programSource) {
  let compileResponse = await client.compile(programSource).do();
  let compiledBytes = new Uint8Array(Buffer.from(compileResponse.result, "base64"));
  return compiledBytes;
}

async function deployContract(client, sender, approvalProgram, clearStateProgram) {
  // Get network params
  const params = await client.getTransactionParams().do();

  const numGlobalByteSlices = 0;
  const numGlobalInts = 1;
  const numLocalByteSlices = 4; // For fullname, username, gender, bio
  const numLocalInts = 0;
  

  // Create an application creation transaction
  const txn = algosdk.makeApplicationCreateTxn(
    sender.addr,
    params,
    algosdk.OnApplicationComplete.NoOpOC,
    approvalProgram,
    clearStateProgram,
    numLocalInts,
    numLocalByteSlices,
    numGlobalInts,
    numGlobalByteSlices,
    [],
    []
  );

  // Sign the transaction
  const signedTxn = txn.signTxn(sender.sk);

  // Send the transaction
  const sendResponse = await client.sendRawTransaction(signedTxn).do();

  // Wait for confirmation
  const confirmedTxn = await algosdk.waitForConfirmation(client, sendResponse.txId, 4);

  // Get the application ID
  const appId = confirmedTxn["application-index"];
  return appId;
  
}


async function main() {
  // Read and compile TEAL programs
  const approvalProgramSource = fs.readFileSync('approval_program.teal', 'utf8');
  const compiledApprovalProgram = await compileProgram(algodClient, approvalProgramSource);
  const clearStateProgramSource = fs.readFileSync('clear_state_program.teal', 'utf8');
  const compiledClearStateProgram = await compileProgram(algodClient, clearStateProgramSource);

  // Recover the account from the mnemonic
  // const sender = algosdk.mnemonicToSecretKey(senderMnemonic);
  const sender = algosdk.mnemonicToSecretKey(senderMnemonic);

  // Deploy the smart contract
  const appId = await deployContract(algodClient, sender, compiledApprovalProgram, compiledClearStateProgram);
  console.log("Deployed Smart Contract with App ID:", appId);
}

main().catch(console.error);
