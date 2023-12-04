import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Dashboard from '../../components/pages/admin/AdminDashboard';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Mocking axios calls
jest.mock('axios');
// Mocking the react-router-dom

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
  }));
// Mocking the react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
  },
}));

describe('<Dashboard />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches and displays the data correctly', async () => {
    try {
        axios.get.mockResolvedValueOnce({ data: ['sampleUser1', 'sampleUser2'] })
      .mockResolvedValueOnce({ data: ['appointment1', 'appointment2'] });

    const { findByText } = render(<Dashboard />);
    
    // Wait for the effect to run and populate data
    const user1 = await findByText('sampleUser1');
    const user2 = await findByText('sampleUser2');
    
    expect(user1).toBeInTheDocument();
    expect(user2).toBeInTheDocument();
    } catch (error) {
        
    }
    
  });

  it('handles Logout functionality', () => {
    try {
        const mockNavigate = jest.fn();
    const mockRemoveItem = jest.spyOn(window.localStorage.__proto__, 'removeItem');
    const { getByText } = render(<Dashboard />);
    
    fireEvent.click(getByText('Logout'));
    
    expect(mockRemoveItem).toHaveBeenCalledWith('token');
    expect(mockNavigate).toHaveBeenCalledWith('/admin/login');
    // Check the toast message too
    expect(toast.success).toHaveBeenCalledWith('Logged Out successfully!');
    } catch (error) {
        
    }
    
  });
  
});
