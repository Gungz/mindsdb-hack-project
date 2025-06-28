import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import ChatbotWidget from '../ChatbotWidget';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <ChatbotWidget />
    </div>
  );
};

export default Layout;