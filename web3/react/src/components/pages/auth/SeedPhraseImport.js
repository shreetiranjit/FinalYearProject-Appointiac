import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import algosdk from 'algosdk';
import '../../pages/home/HomePage.css'

const SeedPhraseImport = () => {
    const [pastedSeedPhrase, setPastedSeedPhrase] = useState(Array(25).fill(''));
    const navigate = useNavigate();

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            const words = text.split(' ').filter(word => word.trim() !== '');
            if (words.length === 25) {
                setPastedSeedPhrase(words);
            } else {
                alert('The seed phrase must consist of 25 words.');
            }
        } catch (error) {
            console.error('Failed to read clipboard contents: ', error);
        }
    };

    const handleImport = () => {
        if (pastedSeedPhrase.includes('')) {
          alert('Please ensure all fields are filled.');
          return;
        }
    
        try {
          // Convert the 25 words seed phrase to a Uint8Array
          const seed = algosdk.mnemonicToMasterDerivationKey(pastedSeedPhrase.join(' '));
          // Create an account from the seed
          const account = algosdk.mnemonicToSecretKey(pastedSeedPhrase.join(' '));
    
          // Log the account's address and secret key

          localStorage.setItem('secret', account.sk);
          localStorage.setItem('address', account.addr);
          localStorage.setItem('seed', pastedSeedPhrase.join(' '))
          navigate('/dashboard');
        } catch (error) {
          console.error('Failed to import seed phrase:', error);
          alert('Invalid seed phrase. Please check and try again.');
        }
      };

    const handleChange = (index, value) => {
        const newPastedSeedPhrase = [...pastedSeedPhrase];
        newPastedSeedPhrase[index] = value;
        setPastedSeedPhrase(newPastedSeedPhrase);
    };

    return (
        <div className="max-w-7xl mx-auto p-4">
             <div className="text-center mb-4 font-bold text-xl">
                Import your seed phrase to continue
            </div>
            <div className="grid-container">
                {pastedSeedPhrase.map((word, index) => (
                    <div
                        key={index}
                        className=" seed-input-container "
                    >
                        <span className="seed-input-label">{index + 1}</span>
                        <input
                            type="text"
                            value={word}
                            onChange={(e) => handleChange(index, e.target.value)}
                            className=" seed-input
                            "
                        />

                    </div>
                ))}
            </div>
            <div className="text-center space-x-4">
                <button
                    onClick={handlePaste}
                    className="btn-primary text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                    Paste Seed Phrase
                </button>
                <button
                    onClick={handleImport}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                >
                    Import
                </button>
            </div>
        </div>
    );
};

export default SeedPhraseImport;
