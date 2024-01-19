import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import Settings from "../../components/pages/navpages/Settings";
import * as profileApi from '../../services/user/profileApi';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../../services/user/profileApi');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn(),
};

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Settings Component', () => {
  beforeEach(() => {
    profileApi.deleteUserProfile = jest.fn();
    localStorageMock.getItem.mockReturnValue(JSON.stringify({ _id: 'test-id' }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders Deactivate Account button', () => {
    render(<BrowserRouter><Settings /></BrowserRouter>);

    expect(screen.getByText('Deactivate Account')).toBeInTheDocument();
  });

  test('shows deactivation modal on click', () => {
    render(<BrowserRouter><Settings /></BrowserRouter>);
  
    fireEvent.click(screen.getByText('Deactivate Account'));

    expect(screen.getByText('Confirm Deactivation')).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Type 'CONFIRM' to deactivate")).toBeInTheDocument();
  });

  test('deactivates account when user confirms deactivation and accepts terms', async () => {
    profileApi.deleteUserProfile.mockResolvedValue({});
    render(<BrowserRouter><Settings /></BrowserRouter>);
  
    fireEvent.click(screen.getByText('Deactivate Account'));

    fireEvent.change(screen.getByPlaceholderText("Type 'CONFIRM' to deactivate"), { target: { value: 'CONFIRM' } });
    fireEvent.click(screen.getByText('I have read and accept the terms of deactivation.'));
    fireEvent.click(screen.getByText('Deactivate'));

    await waitFor(() => {
      expect(profileApi.deleteUserProfile).toHaveBeenCalledWith('test-id');
      expect(localStorageMock.clear).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/register');
    });
  });
});
