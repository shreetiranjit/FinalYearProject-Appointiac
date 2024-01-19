import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Footer from "../../components/pages/home/Footer";

describe('Footer Component', () => {
  beforeEach(() => {
    render(<BrowserRouter><Footer /></BrowserRouter>);
  });

  test('renders Footer component', () => {
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  test('displays the current year', () => {
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(`© ${currentYear} Appointiac. All Rights Reserved.`)).toBeInTheDocument();
  });

  test('has link to Follow Our Socials', () => {
    expect(screen.getByText('Follow Our Socials').closest('a')).toHaveAttribute('href', '/linktree');
  });

  test('has link to About Us', () => {
    expect(screen.getByText('About Us').closest('a')).toHaveAttribute('href', '/about');
  });

  test('has link to Terms and Conditions', () => {
    expect(screen.getByText('Terms and Conditions').closest('a')).toHaveAttribute('href', '/tandc');
  });

  test('has link to Admin Portal', () => {
    expect(screen.getByText('Admin Portal').closest('a')).toHaveAttribute('href', '/admin/login');
  });
});
