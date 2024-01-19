import React from 'react';
import { render, screen } from '@testing-library/react';
import RegisterPage from '../../components/pages/auth/RegisterPage'; 
import { BrowserRouter } from 'react-router-dom';

describe('RegisterPage Component', () => {



  test('renders Navbar', () => {
    render(<BrowserRouter><RegisterPage /></BrowserRouter>);
    // This assumes you have some identifiable element/text in your Navbar
    expect(screen.getByTestId('navbar')).toBeInTheDocument(); 
  });


  test('renders Footer', () => {
    render(<BrowserRouter><RegisterPage /></BrowserRouter>);
    // This assumes you have some identifiable element/text in your Footer
    expect(screen.getByTestId('footer')).toBeInTheDocument(); 
  });

});
