import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import CreateAppointment from "../../components/pages/appointment/CreateAppointment";
import * as timeslotApi from '../../services/user/timeslotApi';
import { BrowserRouter } from 'react-router-dom';
import { toast } from "react-toastify";
import MockDate from 'mockdate';
import userEvent from '@testing-library/user-event';

jest.mock('../../services/user/timeslotApi');
jest.mock('react-toastify');

toast.error = jest.fn();
toast.success = jest.fn();

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const localStorageMock = (function() {
    let store = {};
    return {
      getItem(key) {
        return store[key] || null;
      },
      setItem(key, value) {
        store[key] = value.toString();
      },
      clear() {
        store = {};
      }
    };
  })();

Object.defineProperty(global, 'localStorage', {
    value: localStorageMock
});

global.localStorage.setItem('user', JSON.stringify({ _id: 'testUser123' }));

describe('CreateAppointment Component', () => {
  beforeEach(() => {
    timeslotApi.createAppointment.mockResolvedValue({});
    MockDate.set(new Date());
  });

  afterEach(() => {
    jest.clearAllMocks();
    MockDate.reset();
  });

  test('renders Create Appointment button', () => {
    render(<BrowserRouter><CreateAppointment /></BrowserRouter>);
    screen.getByRole('button', { name: /Create Appointment/i });
  });
 
  test('submits the form and creates an appointment', async () => {
    render(<BrowserRouter><CreateAppointment /></BrowserRouter>);
  
    const startTimeInput = screen.getByPlaceholderText('Start Time');
    const endTimeInput = screen.getByPlaceholderText('End Time');
    const amountPerSessionInput = screen.getByPlaceholderText('Amount Per Session');
    const expiryDateInput = screen.getByPlaceholderText('Expiry Date');
    const auctionYesRadio = screen.getByTestId('forAuctionYesRadio');
    const forSaleYesRadio = screen.getByTestId('forSaleYesRadio');
    
    fireEvent.change(startTimeInput, { target: { value: '10:00' } });
    fireEvent.change(endTimeInput, { target: { value: '11:00' } });
    fireEvent.change(amountPerSessionInput, { target: { value: 100 } });
    fireEvent.change(expiryDateInput, { target: { value: '2023-09-09T10:00' } });
    userEvent.click(auctionYesRadio);  
    

  
    userEvent.click(forSaleYesRadio);
    
    const descriptionInput = screen.getByPlaceholderText('Description');
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
  
    fireEvent.click(screen.getByRole('button', { name: /Create Appointment/i }));
  
    await waitFor(() => {
      expect(timeslotApi.createAppointment).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Appointment Creation successful!');
      expect(mockNavigate).toHaveBeenCalledWith('/marketplace');
    });
  });
  

  test('shows error toast when there is an error creating an appointment', async () => {
    timeslotApi.createAppointment.mockRejectedValueOnce(new Error('Test error message'));

    render(<BrowserRouter><CreateAppointment /></BrowserRouter>);
    fireEvent.click(screen.getByRole('button', { name: /Create Appointment/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error creating appointment: Test error message');
    });
  });
});
