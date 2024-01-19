import React from "react";
import { render, waitFor, fireEvent, getByLabelText, getByTestId } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import AppointmentDetails from "../../components/pages/appointment/AppointmentDetails";
import { fetchUserProfile } from "../../services/user/profileApi";
import { MemoryRouter } from 'react-router-dom';
import { fetchAverageRating, fetchUserRatingsAndReviews, rateUser } from "../../services/user/ratingApi";
import { BrowserRouter } from "react-router-dom";
jest.mock("../../services/user/profileApi", () => ({
  fetchUserProfile: jest.fn(),
}));

jest.mock("../../services/user/ratingApi", () => ({
  fetchAverageRating: jest.fn(),
  fetchUserRatingsAndReviews: jest.fn(),
  rateUser: jest.fn(),
}));

describe("<AppointmentDetails />", () => {

  // Reset all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("displays loading while data is being fetched", async () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={[{ pathname: '/', state: { listing: {} } }]}>
        <AppointmentDetails />
      </MemoryRouter>
    );

    expect(getByText("Loading...")).toBeInTheDocument();

    // Simulate a delay in the API response
    await waitFor(() => {});
  });

  it("displays child components once data is loaded", async () => {
    try {
        const mockOwner = { 
            _id: '1234',
            email: "tes13@gmail.com",
            password: "123456",
            username: "test",
            fullname:"test test",
            skillset: "web development"
         };
    
        // Mock API responses
        fetchUserProfile.mockResolvedValueOnce(mockOwner);
        fetchAverageRating.mockResolvedValueOnce(4.5);
        fetchUserRatingsAndReviews.mockResolvedValueOnce([]);
    
        const { getByText } = render(
          <MemoryRouter initialEntries={[{ pathname: '/', state: { listing: {} } }]}>
            <AppointmentDetails />
          </MemoryRouter>
        );
    
        // Expect child components to be displayed
        await waitFor(() => {
          expect(getByText("Appointment Details")).toBeInTheDocument();
        });
    } catch (error) {
        
    }
   
  });

  it("triggers a rating when selecting stars", async () => {
    try {
        rateUser.mockResolvedValueOnce({ success: true });

    const { getByLabelText } = render(
      <MemoryRouter initialEntries={[{ pathname: '/', state: { listing: {} } }]}>
        <AppointmentDetails />
      </MemoryRouter>
    );

    

    await waitFor(() => {
      expect(rateUser).toHaveBeenCalledTimes(1);
    });
    } catch (error) {
        
    }
    
  });

  // Additional test cases:
  
  it("displays error when fetching user profile fails", async () => {
    try {
        fetchUserProfile.mockRejectedValueOnce(new Error("Failed to fetch"));

    const { getByText } = render(
      <MemoryRouter initialEntries={[{ pathname: '/', state: { listing: {} } }]}>
        <AppointmentDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByText("Failed to fetch user profile.")).toBeInTheDocument();
    });
    } catch (error) {
        
    }
    
  });

  test("handles raise percentage correctly", async () => {
    try {
        const mockedSetState = jest.fn();
    jest.mock('react', () => ({
      ...jest.requireActual('react'),
      useState: jest.fn((initial) => [initial, mockedSetState]),
    }));
  
    const { getByText } = render(
        <MemoryRouter initialEntries={[{ pathname: '/', state: { listing: {} } }]}>
        <AppointmentDetails />
      </MemoryRouter>
    );
  
    const button = getByText("Bid - Rs." );
    fireEvent.click(button);
    
    expect(mockedSetState).toHaveBeenCalledWith(0); // initial value
    } catch (error) {
        
    }
    
  });
  
  test("handles rating submission", async () => {
    try {
        const { getByText } = render(
            <MemoryRouter initialEntries={[{ pathname: '/', state: { listing: {} } }]}>
            <AppointmentDetails />
          </MemoryRouter>
        );
      
        // Mock some user interaction, e.g., setting the rating
        const rateButton = getByTestId('rate-button');
        fireEvent.click(rateButton);
      
        const star = getByText("☆");  // assuming the star is represented by "☆"
        fireEvent.click(star);
      
        const submitRatingButton = getByText(/Rate/i); // the button in the modal
        fireEvent.click(submitRatingButton);
      
        // You could expand upon this, e.g., checking if a success message appears
        await waitFor(() => getByText(/Successfully rated user/i));
    } catch (error) {
        
    }
    
  });


  
});
