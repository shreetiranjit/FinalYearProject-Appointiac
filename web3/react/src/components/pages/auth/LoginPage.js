import React from 'react';
import Navbar from '../../pages/navigation/Navbar';
import Footer from '../../pages/home/Footer';
import SeedPhraseImport from './SeedPhraseImport';

const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* <LoginForm /> */}
        <SeedPhraseImport />
      </main>
      <Footer />
    </div>
  )
}

export default LoginPage;
