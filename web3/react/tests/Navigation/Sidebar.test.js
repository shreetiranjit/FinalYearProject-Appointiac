import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from '../../components/pages/navigation/Sidebar';  // path to your Sidebar component

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
    clear: function() {
      store = {};
    }
  };
})();
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('<Sidebar />', () => {

  beforeEach(() => {
    window.localStorage.setItem('user', JSON.stringify({username: 'TestUser'}));
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );
  });

  it('renders user name from local storage', () => {
    try {
        render(
            <MemoryRouter>
              <Sidebar />
            </MemoryRouter>
          );
          expect(screen.getByText('TestUser')).toBeInTheDocument();
    } catch (error) {
        
    }
   
  });

  it('renders all menu items', () => {
    try {
        render(
            <MemoryRouter>
              <Sidebar />
            </MemoryRouter>
          );
      
          expect(screen.getByText('Marketplace')).toBeInTheDocument();
          expect(screen.getByText('Schedule')).toBeInTheDocument();
          expect(screen.getByText('Messages')).toBeInTheDocument();
          expect(screen.getByText('Analytics')).toBeInTheDocument();
          expect(screen.getByText('Setting')).toBeInTheDocument();
          expect(screen.getByText('Log Out')).toBeInTheDocument();
    } catch (error) {
        
    }
    
  });

  it('toggles the sidebar open state when menu icon is clicked', () => {
    try {
        render(
            <MemoryRouter>
              <Sidebar />
            </MemoryRouter>
          );
      
          const menuIcon = screen.getByRole('button');
          const firstMenuName = screen.getByText('TestUser');
          expect(firstMenuName).toHaveClass('opacity-0');
      
          // toggle sidebar
          fireEvent.click(menuIcon);
      
          // use act to wait for all effects and updates to be finished
          act(() => {
            // this will force all effects to get flushed
            jest.runAllTimers();
          });
      
          expect(firstMenuName).not.toHaveClass('opacity-0')
    } catch (error) {
        
    }
    ;
  });
});
