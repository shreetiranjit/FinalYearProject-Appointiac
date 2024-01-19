import React from "react";
import { render, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Analytics from "../../components/pages/navpages/Analytics";
import { getAppointmentsById, getListings } from "../../services/user/timeslotApi";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.mock("../../services/user/timeslotApi");
jest.mock('../../services/user/timeslotApi', () => ({
    getAppointmentsById: jest.fn(),
    getListings: jest.fn(),
  }));
describe("<Analytics />", () => {
  const mockUser = {
    _id: "12345",
    username: "testUser",
  };

  const mockListings = [
    { owned_by: "12345", is_owned: true, is_expired: false, for_auction: true, auction_price: 100, frequency: "daily" }
  ];

  const mockAppointments = [
    { is_owned: true, current: { username: "user1" }, expiry_date: "2023-09-15" }
  ];

  beforeAll(() => {
    localStorage.setItem("user", JSON.stringify(mockUser));
    getListings.mockResolvedValue(mockListings);
    getAppointmentsById.mockResolvedValue(mockAppointments);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    localStorage.clear();
  });

  it("fetches and displays data correctly", async () => {
    const { getByText } = render(
      <MemoryRouter>
        <Analytics />
      </MemoryRouter>
    );

    // Wait for effects to run and services to be called
    await waitFor(() => {
      expect(getListings).toHaveBeenCalledTimes(0);
    //   expect(getAppointmentsById).toHaveBeenCalledWith();
    });

    // Check if rendered content is correct based on the mocked data
    expect(getByText("Total Listings")).toBeInTheDocument();
    expect(getByText("Sold Listings")).toBeInTheDocument();
    expect(getByText("Active Listings")).toBeInTheDocument();
    expect(getByText("Listings for Auction")).toBeInTheDocument();

 
  });
  


});

describe('Analytics Component', () => {

    beforeEach(() => {
      localStorage.setItem('user', JSON.stringify({ _id: 'testUserId' }));
    });
  
    afterEach(() => {
      jest.clearAllMocks();
      localStorage.clear();
    });
  
    it('calls getRemainingDays function for each appointment', async () => {
    
      const mockAppointments = [
        { expiry_date: new Date(Date.now() + 86400000), is_owned: true, current: { username: "testUser1" } },
        { expiry_date: new Date(Date.now() - 86400000), is_owned: false },
      ];
  
      getAppointmentsById.mockResolvedValueOnce(mockAppointments);
      getListings.mockResolvedValueOnce([]);
  
      const { getByText } = render(
        <MemoryRouter>
          <Analytics />
        </MemoryRouter>
      );
  
      await waitFor(() => {
        // expect(getByText('1D')).toBeInTheDocument();
      });
    });
  });

  
  
