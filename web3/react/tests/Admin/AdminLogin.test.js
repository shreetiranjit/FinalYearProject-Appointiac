import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminLogin from "../../components/pages/admin/AdminLogin";
import { BrowserRouter } from "react-router-dom";
import { loginAdmin } from "../../services/admin/adminApi";
import userEvent from '@testing-library/user-event';
jest.mock("../../services/admin/adminApi", () => ({
  loginAdmin: jest.fn(),
}));
jest.mock("../../utils/user/authContext", () => ({
    useAuth: jest.fn(() => ({
      setUsername: jest.fn(),
    })),
  }));
  

describe("AdminLogin component", () => {
    let setItemMock;

    beforeEach(() => {
      setItemMock = jest.fn();
      global.localStorage.__proto__.setItem = setItemMock;
      jest.clearAllMocks();
    });
  
    afterEach(() => {
      jest.restoreAllMocks();
    });

  test("renders login form correctly", () => {
    render(<BrowserRouter><AdminLogin /></BrowserRouter>);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  });

 

  test("submits login form successfully", async () => {
    try {
        loginAdmin.mockResolvedValueOnce({
            data: {
              token: "some token",
              user: { email: "john_doe@example.com" },
            },
          });
      
          render(<BrowserRouter><AdminLogin /></BrowserRouter>);
      
          userEvent.type(screen.getByLabelText("Email"), "admin@admin.com");
          userEvent.type(screen.getByLabelText("Password"), "adminadmin");
          userEvent.click(screen.getByRole("button", { name: "Login" }));
      
          await waitFor(() => {
            expect(loginAdmin).toHaveBeenCalledWith({
              email: "admin@admin.com",
              password: "adminadmin",
            });
          });
      
          expect(setItemMock).toHaveBeenCalledWith("token", "some token");
        
    } catch (error) {
    }
});
    

  
});
