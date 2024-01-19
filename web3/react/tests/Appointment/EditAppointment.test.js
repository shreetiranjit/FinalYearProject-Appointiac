import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import EditAppointment from "../../components/pages/appointment/EditAppointment";
import * as timeslotApi from '../../services/user/timeslotApi';
import { BrowserRouter } from 'react-router-dom';
import { toast } from "react-toastify";
import MockDate from 'mockdate';
import userEvent from '@testing-library/user-event';
import { useLocation } from "react-router-dom";
jest.mock('../../services/user/timeslotApi');
jest.mock('react-toastify');

toast.error = jest.fn();
toast.success = jest.fn();

const mockNavigate = jest.fn();
const mockAppointment = {
    _id: '1234',
    timestamp: '10:00-11:00',
    amount_per_session: 100,
    expiry_date: '2023-09-09T10:00',
    for_auction: true,
    forsale: false,
    description: 'Existing Description',
  };
  
  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: { appointment: mockAppointment } }),
  }));
  
describe('EditAppointment Component', () => {
    
  beforeEach(() => {
    timeslotApi.updateAppointment.mockResolvedValue({});
    MockDate.set(new Date());
    global.localStorage.setItem('user', JSON.stringify({ _id: 'testUser123' }));

  });

  afterEach(() => {
    jest.clearAllMocks();
    MockDate.reset();
  });

  test('renders Update Appointment button', () => {
    render(<BrowserRouter><EditAppointment /></BrowserRouter>);
    screen.getByRole('button', { name: /Update Appointment/i });
  });
 
  test('submits the form and updates an appointment', async () => {
    render(<BrowserRouter><EditAppointment /></BrowserRouter>);
  
    const startTimeInput = screen.getByPlaceholderText('Start Time');
    const endTimeInput = screen.getByPlaceholderText('End Time');
    const amountPerSessionInput = screen.getByPlaceholderText('Amount Per Session');
    const expiryDateInput = screen.getByPlaceholderText('Expiry Date');
    const auctionYesRadio = screen.getByTestId('forAuctionYesRadio');
    const forSaleYesRadio = screen.getByTestId('forSaleYesRadio');
    
    fireEvent.change(startTimeInput, { target: { value: '11:00' } });
    fireEvent.change(endTimeInput, { target: { value: '12:00' } });
    fireEvent.change(amountPerSessionInput, { target: { value: 150 } });
    fireEvent.change(expiryDateInput, { target: { value: '2023-10-10T10:00' } });
    userEvent.click(auctionYesRadio);
    
    const descriptionInput = screen.getByPlaceholderText('Description');
    fireEvent.change(descriptionInput, { target: { value: 'Updated Description' } });

    fireEvent.click(screen.getByRole('button', { name: /Update Appointment/i }));
  
    await waitFor(() => {
      expect(timeslotApi.updateAppointment).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Appointment Edit successful!');
      expect(mockNavigate).toHaveBeenCalledWith('/schedule');
    });
  });

  test('shows error toast when there is an error updating an appointment', async () => {
    timeslotApi.updateAppointment.mockRejectedValueOnce(new Error('Test error message'));

    render(<BrowserRouter><EditAppointment /></BrowserRouter>);
    fireEvent.click(screen.getByRole('button', { name: /Update Appointment/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error updating appointment: Test error message');
    });
  });
});
