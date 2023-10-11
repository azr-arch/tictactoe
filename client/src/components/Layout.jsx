import React from "react";

const Layout = ({ children }) => {
  return (
    <main className="min-h-screen flex items-center justify-center flex-col bg-black_1">
      {children}
    </main>
  );
};

export default Layout;
