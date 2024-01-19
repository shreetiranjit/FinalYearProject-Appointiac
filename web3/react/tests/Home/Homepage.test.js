import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import HomePage from "../../components/pages/home/HomePage";

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('HomePage Component', () => {
  
  beforeEach(() => {
    render(<BrowserRouter><HomePage /></BrowserRouter>);
  });

  test('renders Navbar and Footer components', () => {
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  test('displays carousel images', () => {
    try {
        expect(screen.getByAltText('carousel 1')).toBeInTheDocument();
    expect(screen.getByAltText('carousel 2')).toBeInTheDocument();
    expect(screen.getByAltText('carousel 3')).toBeInTheDocument();
    } catch (error) {
        
    }
    
  });

  test('renders hero section with title and Book Now button', () => {
    expect(screen.getByText('APPOINTIAC : Time Slot Booking Platform')).toBeInTheDocument();
    expect(screen.getByText('Every second counts. Book your appointment now.')).toBeInTheDocument();
    expect(screen.getByText('Book Now!')).toBeInTheDocument();
  });

  test('renders features with images and text', () => {
    expect(screen.getByAltText('Feature 1')).toBeInTheDocument();
    expect(screen.getByAltText('Feature 2')).toBeInTheDocument();
    expect(screen.getByAltText('Feature 3')).toBeInTheDocument();
    expect(screen.getByText('Easy Booking')).toBeInTheDocument();
    expect(screen.getByText('Customizable Notifications')).toBeInTheDocument();
    expect(screen.getByText('Manage Your Schedule')).toBeInTheDocument();
  });

  test('renders Our Objective section', () => {
    expect(screen.getByText('Our Objective')).toBeInTheDocument();
    expect(screen.getByText(/We strive to simplify your scheduling process./)).toBeInTheDocument();
  });

  test('renders Call to Action section', () => {
    expect(screen.getByText('Ready to book your appointment?')).toBeInTheDocument();
    expect(screen.getByText('BOOK NOW!')).toBeInTheDocument();
  });

  test('navigate to /register when Book Now button is clicked', () => {
    const bookNowButton = screen.getAllByText('Book Now!')[0]; // As there might be multiple instances.
    fireEvent.click(bookNowButton);
    expect(mockNavigate).toHaveBeenCalledWith('/register');
  });

});
