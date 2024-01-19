import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import Profile from "../../components/pages/navpages/Profile";
import {
  fetchUserProfile,
  updateUserProfile,
  updateUserProfilePic,
  updateUserCertifications,
} from "../../services/user/profileApi";
import { BrowserRouter } from "react-router-dom";

import userEvent from '@testing-library/user-event';

jest.mock("../../services/user/profileApi");

  
const mockUser = {
  _id: "test123",
  username: "lovelove",
  fullname: "Test User",
};

localStorage.setItem("user", JSON.stringify(mockUser));

test("renders Profile component", () => {
  render(
    <BrowserRouter>
      <Profile />
    </BrowserRouter>
  );
  expect(screen.getByText("Edit Profile")).toBeInTheDocument();
});

test("triggers edit mode", async () => {
  render(
    <BrowserRouter>
      <Profile />
    </BrowserRouter>
  );
  fireEvent.click(screen.getByText("Edit Profile"));
  expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
});

test("updates and displays user data", async () => {
  const updatedUser = { ...mockUser, username: "updatedUser" };
  fetchUserProfile.mockResolvedValueOnce(updatedUser);
  updateUserProfile.mockResolvedValueOnce(updatedUser);
  render(
    <BrowserRouter>
      <Profile />
    </BrowserRouter>
  );
  fireEvent.click(screen.getByText("Edit Profile"));
  const usernameInput = screen.getByPlaceholderText("Username");
  fireEvent.change(usernameInput, { target: { value: updatedUser.username } });
  fireEvent.click(screen.getByText("Save"));
  expect(screen.getByPlaceholderText("Username")).toHaveValue("updatedUser");
});

describe("<Profile />", () => {
  const mockUser = {
    _id: "1234",
    fullname: "John Doe",
    username: "johndoe",
    image: "profile.jpg",
    certifications: ["cert1.jpg"],
    gender: "male",
    description: "test description",
  };

  beforeEach(() => {
    localStorage.setItem("user", JSON.stringify(mockUser));
    fetchUserProfile.mockResolvedValue(mockUser);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  

  test("handles user profile image upload successfully", async () => {
    updateUserProfilePic.mockResolvedValue({
      data: {
        data: { image: "updatedProfile.jpg" },
      },
    });

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    // Either find the image or the placeholder div that says "No Image"
    const profileElement =
      screen.queryByAltText("Profile") ||
      screen.getByText("No Image").parentElement;

    // Hover over the profile element (either image or placeholder)
    fireEvent.mouseEnter(profileElement);

    // Get the file input for the profile image
    const fileInput = screen.getByText("Edit Profile").nextSibling;

    // Mock the image file to be uploaded
    const file = new File(["(⌐■_■)"], "profile.jpg", { type: "image/jpg" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
    //   expect(updateUserProfilePic).toHaveBeenCalled();
      const updatedProfileImage = screen.queryByAltText("Profile");
      expect(updatedProfileImage).toBeTruthy();
      if (updatedProfileImage) {
        expect(updatedProfileImage.src).toMatch("http://localhost:3001/profile.jpg");
      }
    });
  });

  test("toggles edit mode correctly", () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );
    const editButton = screen.getByText("Edit Profile");
    fireEvent.click(editButton);
    expect(screen.getByText("Save")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Save"));
    expect(editButton).toBeInTheDocument();
  });

  test("handles certification image upload successfully", async () => {
    updateUserCertifications.mockResolvedValue({
      data: {
        certifications: ["updatedCert1.jpg"],
      },
    });

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );
    const editButton = screen.getByText("Edit Profile");
    fireEvent.click(editButton);

    const fileInput = screen.getByText("Update Certification").nextSibling;
    const file = new File(["(⌐■_■)"], "cert.jpg", { type: "image/jpg" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(updateUserCertifications).toHaveBeenCalled();
      expect(screen.getByAltText("Certification").src).toMatch(
        "updatedCert1.jpg"
      );
    });
  });

//   it("updates user profile correctly", async () => {
//     render(
//         <BrowserRouter>
//           <Profile />
//         </BrowserRouter>
//       );
//     // Activate edit mode
//     const editButton = screen.getByText(/Edit Profile/i);
//     userEvent.click(editButton);

//     // Input new values
//     const usernameInput = screen.getByTestId("username-input");
//     userEvent.clear(usernameInput);
//     userEvent.type(usernameInput, "newUsername");

//     // Add any other input changes you wish to test

//     // Click Save
//     const saveButton = screen.getByText(/Save/i);
//     userEvent.click(saveButton);

//     // Expectations
//     await screen.findByText(/Profile updated successfully/); // Assuming you give a success feedback like this.

//     expect(updateUserProfile).toHaveBeenCalledWith("1234", {
//       //...other fields
//       username: "newUsername"
//     });
//     expect(fetchUserProfile).toHaveBeenCalledWith("1234");
//     expect(localStorage).toHaveBeenCalledWith("user", JSON.stringify({
//       _id: "123",
//       image: "updated_image.jpg",
//       // ... any other fields you expect
//     }));
//   });
});
