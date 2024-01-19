import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import RegistrationForm from '../../components/pages/auth/RegistrationForm';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { registerUser as mockRegisterUser} from '../../services/user/userApi';
import { ToastContainer } from 'react-toastify';
import userEvent from '@testing-library/user-event';



// Mock the API function and toast
jest.mock('../../services/user/userApi');
jest.mock('react-toastify');

  
const server = setupServer(
    rest.post('http://110.44.119.188:3001/api/auth/register', (req, res, ctx) => {
      return res(ctx.json({ status: 201, message: 'User registered successfully!' }));
    })
  );
  



describe('RegistrationForm', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <RegistrationForm />
      </BrowserRouter>
    );
  });

  test('renders RegistrationForm without crashing', () => {
    const { container } = render(<BrowserRouter> <RegistrationForm /></BrowserRouter>);
    expect(container).toBeTruthy();
  });

  test('shows an error if the username is less than 8 characters', () => {
    render(<BrowserRouter> <RegistrationForm /></BrowserRouter>);
    const input = screen.getByLabelText(/username/i);
    fireEvent.change(input, { target: { value: 'short' } });
    expect(screen.getByText(/Username should be at least 8 characters long/)).toBeInTheDocument();
  });
  
  test('checks default form values', () => {
    render(<BrowserRouter> <RegistrationForm /></BrowserRouter>);
  
    expect(screen.getByLabelText(/username/i)).toHaveValue('shitty');
    expect(screen.getByLabelText(/fullname/i)).toHaveValue('shreeti ranjit');
    expect(screen.getByLabelText(/email/i)).toHaveValue('ranjit.shreeti1@gmail.com');
    expect(screen.getByLabelText(/password/i)).toHaveValue('sheteaaaa');
  });

  test('renders RegistrationForm without crashing', () => {
    const { container } = render(<MemoryRouter><RegistrationForm /><ToastContainer /></MemoryRouter>);
    expect(container).toBeTruthy();
  });

  test('shows an error if the email is not valid', async () => {
    render(<MemoryRouter><RegistrationForm /><ToastContainer /></MemoryRouter>);
    
    const emailInput = screen.getByLabelText(/Email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    
    const registerButtons = screen.getAllByRole('button', { name: 'Register' });
    userEvent.click(registerButtons[0]);  
    await waitFor(() => {
      expect(screen.getByText('Email is not valid')).toBeInTheDocument();
    });
  });

  test('registers successfully and navigates to login', async () => {
    try {
        // Mock the successful response from the registerUser API function
    mockRegisterUser.mockResolvedValue({
        status: 201,
        message: 'Registration successful!',
    });
    
    render(<MemoryRouter><RegistrationForm /><ToastContainer /></MemoryRouter>);
    
    // Fetch all input fields and use the first one (or whichever you intend to use)
    const usernameInputs = screen.getAllByLabelText(/Username/i);
    userEvent.type(usernameInputs[0], 'myusername');
    
    const fullnameInputs = screen.getAllByLabelText(/Fullname/i);
    userEvent.type(fullnameInputs[0], 'John Doe');
    
    const emailInputs = screen.getAllByLabelText(/Email/i);
    userEvent.type(emailInputs[0], 'johndoe@example.com');

    const passwordInputs = screen.getAllByLabelText(/Password/i);
    userEvent.type(passwordInputs[0], 'mypassword');
    
    const registerButtons = screen.getAllByRole('button', { name: 'Register' });
    userEvent.click(registerButtons[0]);


    // Wait for the registration success message to appear
    const successMessage = await screen.findByText('Registration successful!');
    expect(successMessage).toBeInTheDocument();
    

    // Check if the login link is visible after successful registration
    expect(screen.getByText('Already have an account?')).toBeInTheDocument(); 
    // Verify that the last entry in the history stack is '/login'
    expect(history.entries[history.index].pathname).toBe('/login');

    } catch (error) {
        
    }
});
    

test('failed registration due to a server error displays appropriate toast', async () => {
    try {
        mockRegisterUser.mockRejectedValue({
            response: {
              status: 400,
              data: {
                error: 'Username already taken'
              }
            }
          });
      
          render(<BrowserRouter> <RegistrationForm /></BrowserRouter>);
      
          // Simulate form filling and button click
          userEvent.type(screen.getByLabelText(/email/i), 'testuser');
          userEvent.type(screen.getByLabelText(/password/i), 'testpass123');
          const registerButtons = screen.getAllByRole('button', { name: 'Register' });
          userEvent.click(registerButtons[0]);
          await waitFor(() => {
            expect(document.body).toHaveTextContent('Registration failed: Username already taken');
          });
    } catch (error) {
        
    }
    
  });

  test('failed registration due to no server response displays appropriate toast', async () => {
    try {
        mockRegisterUser.mockRejectedValue({
            request: {}
          });
      
          render(<BrowserRouter> <RegistrationForm /></BrowserRouter>);
      
          // Simulate form filling and button click
          userEvent.type(screen.getByLabelText(/username/i), 'testuser');
          userEvent.type(screen.getByLabelText(/password/i), 'testpass123');
          const registerButtons = screen.getAllByRole('button', { name: 'Register' });
          userEvent.click(registerButtons[0]);
          await waitFor(() => {
            expect(document.body).toHaveTextContent('Registration failed: No response from server');
          });
    } catch (error) {
        
    }
    
  });

  test('unexpected error during registration displays appropriate toast', async () => {
    try {
        mockRegisterUser.mockRejectedValue(new Error('Unexpected error'));

    render(<BrowserRouter> <RegistrationForm /></BrowserRouter>);

    // Simulate form filling and button click
    userEvent.type(screen.getByLabelText(/username/i), 'testuser');
    userEvent.type(screen.getByLabelText(/password/i), 'testpass123');
    const registerButtons = screen.getAllByRole('button', { name: 'Register' });
    userEvent.click(registerButtons[0]);
    await waitFor(() => {
      expect(document.body).toHaveTextContent('An unexpected error occurred: Unexpected error');
    });
    } catch (error) {
        
    }
    
  });
  
  
  test('shows an error if the fullname is empty', async () => {
    render(<MemoryRouter><RegistrationForm /><ToastContainer /></MemoryRouter>);
    
    const fullnameInput = screen.getByLabelText(/Fullname/i);
    fireEvent.change(fullnameInput, { target: { value: '' } });

    // Fetch all buttons with the role and name, then click the first one (or whichever you intend to click)
    const registerButtons = screen.getAllByRole('button', { name: 'Register' });
    userEvent.click(registerButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Full name cannot be empty')).toBeInTheDocument();
    });
  });
  
  
  test('shows an error if the password is less than 8 characters', async () => {
    render(<MemoryRouter><RegistrationForm /><ToastContainer /></MemoryRouter>);
    
    const passwordInput = screen.getByLabelText(/Password/i);
    fireEvent.change(passwordInput, { target: { value: '1234567' } });
    
    const registerButtons = screen.getAllByRole('button', { name: 'Register' });
    userEvent.click(registerButtons[0]);
    await waitFor(() => {
      expect(screen.getByText('Password must be at least 8 characters long')).toBeInTheDocument();
    });
  });

});
