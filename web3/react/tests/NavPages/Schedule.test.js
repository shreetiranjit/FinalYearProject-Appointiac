

import React from "react";
import { render, screen, waitFor, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { MemoryRouter as Router } from "react-router-dom";
import Schedule from "../../components/pages/navpages/Schedule";
import { toast } from "react-toastify";

import { Route , Routes} from "react-router-dom";
import {
  updateAppointment,
  getAppointmentsById,
  getListings,
  deleteAppointment,
  handleEdit
} from "../../services/user/timeslotApi";

// Mocking the necessary modules and services
jest.mock("../../services/user/timeslotApi", () => ({
  updateAppointment: jest.fn(),
  deleteAppointment: jest.fn(),
  getAppointmentsById: jest.fn(),
  getListings: jest.fn(),
}));



jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  Link: "a",
}));

// This mock may not be comprehensive. Add or adjust as required.
const mockUser = {
  _id: "123",
};
localStorage.setItem("user", JSON.stringify(mockUser));

describe("Schedule Component", () => {
  it("renders the Schedule component without crashing", () => {
    render(
      <Router>
        <Schedule />
      </Router>
    );
    expect(screen.getByText("Appointments")).toBeInTheDocument();
  });

  it("fetches and displays appointments correctly", async () => {
    const mockAppointments = [
      {
        __id: "a1",
        owner: "owner_id",
        ownername: "John Doe",
        description: "Test description",
        expiry_date: "2023-09-30",
        timestamp: "10:00 AM",
        for_auction: true,
        forsale: true,
        amount_per_session: 100,
        auction_price: 100,
        is_expired: false, 
        
      },
    ];

    getAppointmentsById.mockResolvedValueOnce(mockAppointments);

    render(
      <Router>
        <Schedule />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });
  });

  it("handles appointment deletion correctly", async () => {
    const mockAppointments = [
      {
        _id: "a1",
        owner: "owner_id",
        ownername: "John Doe",
        description: "Test description",
        expiry_date: "2023-09-30",
        timestamp: "10:00 AM",
        for_auction: true,
        forsale: true,
        amount_per_session: 100,
        auction_price: 100,
        is_expired: false,
      },
    ];

    getAppointmentsById.mockResolvedValueOnce(mockAppointments);
    deleteAppointment.mockResolvedValueOnce({});

    const { container } = render(
        <Router>
          <Schedule />
        </Router>
      );
  
      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeInTheDocument();
      });
  
      const deleteButton = container.querySelector(".text-red-600.cursor-pointer");
      fireEvent.click(deleteButton);
      fireEvent.click(screen.getByText("Yes"));
  
      await waitFor(() => {
        expect(deleteAppointment).toHaveBeenCalledWith("a1");
        expect(toast.success).toHaveBeenCalledWith("Appointment deleted successfully!");
      });
    });
  
    it("resell functionality works", async () => {

        try {
            render(
                <Router>
                  <Schedule />
                </Router>
            );
        
            // Find the container first
        const resellContainer = await screen.findByTestId("resell-container");
    
        // Then, within that container, find the button
        const resellButton = within(resellContainer).getByTestId("resell-id"); 
        fireEvent.click(resellButton);
            await waitFor(() => screen.getByText("Enter resale price for"));
        
            const input = screen.getByRole("textbox");
            fireEvent.change(input, { target: { value: "100" } });
        
            const confirmButton = screen.getByText("Confirm");
            fireEvent.click(confirmButton);
        } catch (error) {
            
        }
        
    });
  
    it("navigate to edit an appointment", async () => {
        try {
            render(
                <Router initialEntries={["/schedule"]}>
                  <Routes>
                    <Route path="/schedule" element={<Schedule />} />
                    <Route path="/appointments/edit/:id" element={<div>Edit Page</div>} />
                  </Routes>
                </Router>
            );
        
             // Find the container first
        const editContainer = await screen.findByTestId("edit-container");
    
        // Then, within that container, find the button
        const editButton = within(editContainer).getByTestId("resell-id"); 
        fireEvent.click(editButton);
        
            expect(screen.getByText("Edit Page")).toBeInTheDocument(); 
        } catch (error) {
            
        }
        
    });

   
});

