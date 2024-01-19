import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import LoginPage from '../../components/pages/auth/LoginPage';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../../components/pages/auth/LoginForm', () => () => <div data-testid="login-form" />);
jest.mock('../../components/pages/navigation/Navbar', () => () => <nav data-testid="navbar" />);
jest.mock('../../components/pages/home/Footer', () => () => <footer data-testid="footer" />);
describe('<LoginPage />', () => {
    it('renders the Navbar, LoginForm, and Footer components', () => {
        render(<BrowserRouter><LoginPage /></BrowserRouter>);

        // Check if the Navbar is rendered
        const navbar = screen.getByTestId('navbar');
        expect(navbar).toBeInTheDocument();

        // Check if the LoginForm is rendered
        const loginForm = screen.getByTestId('login-form');
        expect(loginForm).toBeInTheDocument();

        // Check if the Footer is rendered
        const footer = screen.getByTestId('footer');
        expect(footer).toBeInTheDocument();
    });
});
