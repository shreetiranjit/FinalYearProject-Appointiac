// Navbar.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import Navbar from '../../components/pages/navigation/Navbar';

// Mock your logo import
jest.mock('../../assets/images/logo.png', () => 'logo.png');

const server = setupServer(
  // Define your MSW API mocks here if needed
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Navbar', () => {
  test('renders Navbar with logo and navigation links', () => {
    render(
      <Router>
        <Navbar />
      </Router>
    );

    expect(screen.getByText('Appointiac')).toBeInTheDocument();
    expect(screen.getByText('Home')).toHaveAttribute('href', '/');
    expect(screen.getByText('Login')).toHaveAttribute('href', '/login');
    expect(screen.getByText('Register')).toHaveAttribute('href', '/register');
  });
  test('toggles menu state correctly', () => {
    const { rerender } = render(
      <Router>
        <Navbar />
      </Router>
    );

    expect(screen.getByTestId('navbar-links')).toHaveClass('block lg:hidden');

    fireEvent.click(screen.getByRole('button'));

    rerender(
      <Router>
        <Navbar />
      </Router>
    );

    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByTestId('navbar-links')).toHaveClass('block lg:hidden');
  });
  
});
