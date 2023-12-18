import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="grid grid-cols-[auto,1fr] min-h-screen overflow-auto">
      {children}
    </div>
  );
}

export default Layout;
