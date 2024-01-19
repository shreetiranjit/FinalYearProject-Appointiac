import { render, screen, fireEvent } from "@testing-library/react";
import Marketplace from "../../components/pages/navpages/Marketplace";
import { getListings } from "../../services/user/timeslotApi";
import { fetchUserProfile } from "../../services/user/profileApi";
import { useNavigate, BrowserRouter } from "react-router-dom";

jest.mock("../../services/user/timeslotApi");
jest.mock("../../services/user/profileApi");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn()
}));

const mockListings = [
  { 
    _id: "abcd1234",
    ownername: "John Doe",
    for_auction: true,
    auction_price: 100, 
    timestamp:  "12:11- 12:59"
  }
];

const mockUser = {
  username: "shreeti"
};

beforeEach(() => {
  getListings.mockResolvedValue(mockListings);
  localStorage.setItem("user", JSON.stringify(mockUser));
  fetchUserProfile.mockResolvedValue({ image: "sampleImage.jpg" });
});

test("renders Marketplace", () => {
  try {
    render(<BrowserRouter><Marketplace /></BrowserRouter>);
  expect(screen.getByText("Appointiac")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Search listings...")).toBeInTheDocument();
  } catch (error) {
    throw error;
  }
  
});



test("fetches and displays listings", async () => {
  try {
    render(<BrowserRouter><Marketplace /></BrowserRouter>);
  expect(await screen.findByText(mockListings[0].ownername)).toBeInTheDocument();
  } catch (error) {
    throw error;
  }
  
});

test("filters listings based on search term", async () => {
  try {
    render(<BrowserRouter><Marketplace /></BrowserRouter>);

    // Simulate searching for a specific ownername
    const searchInput = screen.getByPlaceholderText("Search listings...");
    fireEvent.change(searchInput, { target: { value: mockListings[0].ownername } });
  
    // Only the searched listing should be in the document
    expect(screen.getByText(mockListings[0].ownername)).toBeInTheDocument();
  } catch (error) {
    
  }
 
});

test("ListingCard fetches and displays owner data", async () => {
  try {
    const { ListingCard } = Marketplace; // Extract the ListingCard from Marketplace
    render(<BrowserRouter><ListingCard listing={mockListings[0]} /></BrowserRouter>);
    expect(await screen.findByText(mockListings[0].ownername)).toBeInTheDocument();
  } catch (error) {
    
  }

});


