import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary-600 py-10 mt-10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="text-white">
            <h3 className="text-lg mb-2">Appointiac</h3>
            <p className="text-sm">
              &copy; {new Date().getFullYear()} Appointiac. All Rights Reserved.
            </p>
          </div>
          <div className="space-x-4">
            <Link
              to="/linktree"
              className="text-white hover:text-white transition-colors duration-300"
            >
              Follow Our Socials
            </Link>
            <Link
              to="/about"
              className="text-white hover:text-white transition-colors duration-300"
            >
              About Us
            </Link>
            <Link
              to="/tandc"
              className="text-white hover:text-white transition-colors duration-300"
            >
              Terms and Conditions
            </Link>
            <Link
              to="/admin/login"
              className="text-white hover:text-white transition-colors duration-300"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
