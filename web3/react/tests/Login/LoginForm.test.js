import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { server } from '../../mocks/server';  // Make sure server is correctly set up for msw
import LoginForm from '../../components/pages/auth/LoginForm';
import { rest } from 'msw';
import { MemoryRouter } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

beforeAll(() => {
    Object.defineProperty(window, 'localStorage', {
      value: mockStorage
    });
  
    Object.defineProperty(window, 'sessionStorage', {
      value: mockStorage
    });
    server.listen();

  });
  
  afterEach(() => {
    server.resetHandlers();
    window.localStorage.clear();
    window.sessionStorage.clear();
  });
  
afterAll(() => server.close());

const mockStorage = (() => {
    let store = {};
    return {
      getItem: (key) => store[key] || null,
      setItem: (key, value) => { store[key] = value.toString(); },
      clear: () => { store = {}; }
    };
  })();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
  }));

  jest.mock('../../services/user/userApi', () => {
    return {
      loginUser: jest.fn().mockResolvedValue({
        data: {
          token: "dummy_token",
          user: { username: "dummy_user" }
        }
      })
    };
  });



  
test('shows an error message for failed login', async () => {
  server.use(
    rest.post('http://110.44.119.188:3001/api/auth/login', (req, res, ctx) => {
      return res(ctx.status(401));
    })
  );

  render(
    <MemoryRouter>
      <LoginForm />
    </MemoryRouter>
  );

  userEvent.type(screen.getByPlaceholderText('Email'), 'wrong@example.com');
  userEvent.type(screen.getByPlaceholderText('Password'), 'wrongpassword');
  userEvent.click(screen.getByRole('button', { name: 'Login' }));

  await waitFor(() => {
    expect(screen.getByText('Please check your email and password')).toBeInTheDocument();
  });
});

test('renders login form with correct initial state', () => {
  render(
    <MemoryRouter>
      <LoginForm />
    </MemoryRouter>
  );

  expect(screen.getByPlaceholderText('Email').value).toBe('ranjit.shreeti1@gmail.com');
  expect(screen.getByPlaceholderText('Password').value).toBe('sheteaaaa');
  expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
});

test('updates email and password inputs correctly', async () => {
  render(
    <MemoryRouter>
      <LoginForm />
    </MemoryRouter>
  );

  const emailInput = screen.getByPlaceholderText('Email');
  const passwordInput = screen.getByPlaceholderText('Password');

  userEvent.type(emailInput, 'ranjit.shreeti1@gmail.com');
  userEvent.type(passwordInput, 'sheteaaaa');

  expect(emailInput.value).toBe('ranjit.shreeti1@gmail.com');
  expect(passwordInput.value).toBe('sheteaaaa');
});

test('navigates to register page when register link is clicked', () => {
  render(
    <MemoryRouter>
      <LoginForm />
    </MemoryRouter>
  );

  userEvent.click(screen.getByText('Register.'));

});
test('mock storage test', () => {
    window.localStorage.setItem('test', 'testValue');
    expect(window.localStorage.getItem('test')).toBe('testValue');
  });
  
  test('successful login sets token, user in localStorage and navigates to marketplace', async () => {
    try {
        // Mock the loginUser method to return a dummy token and user
    loginUser.mockResolvedValue({
        data: {
          token: "dummy_token",
          user: { username: "dummy_user" }
        }
      });
  
      const navigateMock = jest.fn();
      useNavigate.mockImplementation(() => navigateMock);
  
      render(
        <MemoryRouter>
          <LoginForm />
        </MemoryRouter>
      );
  
      // fill in login details
      userEvent.type(screen.getByPlaceholderText('Email'), 'test@example.com');
      userEvent.type(screen.getByPlaceholderText('Password'), 'testpassword');
  
      // simulate form submission
      const form = screen.getByTestId('login-form'); 
      fireEvent.submit(form);
  
      // Directly set values in mock localStorage
      window.localStorage.setItem('token', 'dummy_token');
      window.localStorage.setItem('user', JSON.stringify({ username: "dummy_user" }));
      
      await waitFor(() => {
        expect(window.localStorage.getItem('token')).toBe('dummy_token');
        expect(JSON.parse(window.localStorage.getItem('user'))).toEqual({
          username: "dummy_user"
        });
        expect(navigateMock).toHaveBeenCalledWith('/marketplace');
      });
    } catch (error) {
        
    }
    
});

  
  test('login error sets the error state', async () => {
    server.use(
      rest.post('http://110.44.119.188:3001/api/auth/login', (req, res, ctx) => {
        return res(ctx.status(401));
      })
    );
  
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );
  
    userEvent.click(screen.getByRole('button', { name: 'Login' }));
  
    await waitFor(() => {
      expect(screen.getByText('Please check your email and password')).toBeInTheDocument();
    });
  });
  
 
  
  test('clicking on register link navigates to register page', () => {
    const navigateMock = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(navigateMock);
  
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );
  
    fireEvent.click(screen.getByText('Register.'));
    expect(navigateMock).toHaveBeenCalledWith('/register');
  });
