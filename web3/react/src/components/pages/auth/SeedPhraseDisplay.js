import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './displayseed.css'

const SeedPhraseDisplay = ({ seedPhrase, setIndices }) => {
  const [isCopied, setIsCopied] = useState(false);
  const navigate = useNavigate();

  const handleCopyClick = () => {
    navigator.clipboard.writeText(seedPhrase.join(' '));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleContinue = () => {
    const randomIndices = generateRandomIndices();
    navigate('/verify', { state: { seedPhrase, indices: randomIndices } });
  };
  
  const generateRandomIndices = () => {
    let indices = new Set();
    while (indices.size < 3) {
      indices.add(Math.floor(Math.random() * 25));
    }
    return Array.from(indices);
  };
  

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="text-center mb-4 font-bold text-2xl">
        Your Seed Phrase
      </div>
      <div className="grid-container">
        {seedPhrase.map((word, index) => (
          <div
            key={index}
            className="seed-word-container"
          >
            <span className="seed-word-label">{index + 1}. {word}
            
            </span>
          </div>
        ))}
      </div>
      <div className="text-center space-x-4 mt-4">
        <button
          onClick={handleCopyClick}
          className="btn-primary text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          {isCopied ? 'Copied!' : 'Copy Seed Phrase'}
        </button>
        <button
          onClick={handleContinue}
          className="bg-green-900 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        >
          Continue
        </button>
      </div>
    </div>
  );
  
  
};

export default SeedPhraseDisplay;
