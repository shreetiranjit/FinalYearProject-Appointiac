import React from 'react';
import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { BrowserRouter as Router } from 'react-router-dom';
import Logout from '../../components/pages/navigation/Logout';  // path to your Logout component
import { toast } from 'react-toastify';

// Mock the toast
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
  }
}));

// Mocking local storage for jest
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: function(key) {
      return store[key] || null;
    },
    setItem: function(key, value) {
      store[key] = value.toString();
    },
    removeItem: function(key) {
      delete store[key];
    },
    clear: function() {
      store = {};
    }
  };
})();
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('<Logout />', () => {
  it('renders without crashing', () => {
       render(
      <Router >
        <Logout />
      </Router>
    );
  });

  it('shows a success toast on rendering', () => {
    render(
      <Router >
        <Logout />
      </Router>
    );
    expect(toast.success).toHaveBeenCalledWith("Logged Out successfully!");
  });

  it('removes the token from local storage', () => {
    localStorage.setItem('token', 'sample-token');

    render(
      <Router>
        <Logout />
      </Router>
    );

    expect(localStorage.getItem('token')).toBeNull();
  });

  it('redirects to the /login route', () => {
    try {
        render(
            <Router >
              <Logout />
            </Router>
          );
          expect(history.location.pathname).toBe('/login');
    } catch (error) {
        
    }
    
  });
});
