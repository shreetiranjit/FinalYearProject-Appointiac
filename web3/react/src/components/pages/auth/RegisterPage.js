import React, { useEffect, useState } from 'react';
import Navbar from '../navigation/Navbar';
import Footer from '../home/Footer';
import SeedPhraseDisplay from './SeedPhraseDisplay';

const algosdk = require('algosdk');

const RegisterPage = ({ setIndices }) => {

  const [seedPhraseList, setSeedPhraseList] = useState([]);

  useEffect(() => {
    const generatedAccount = algosdk.generateAccount();
    const passphrase = algosdk.secretKeyToMnemonic(generatedAccount.sk);
    console.log(passphrase);
    
    const seedPhraseArray = passphrase.split(' ');
    setSeedPhraseList(seedPhraseArray);
    localStorage.setItem('secret', generatedAccount.sk);
    localStorage.setItem('address', generatedAccount.addr);
    localStorage.setItem('seed', passphrase)
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* <RegistrationForm /> */}
        <div className="">
          <SeedPhraseDisplay seedPhrase={seedPhraseList} setIndices={setIndices} />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default RegisterPage;
