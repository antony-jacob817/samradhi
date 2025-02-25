import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useSearchStore } from '../store/searchStore';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { query, setQuery } = useSearchStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/products');
  };

  return (
    <nav className="bg-green-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
        <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
            <img src="src\components\leaf.png" className="h-8 w-8" />
              <span className="text-xl font-bold">Samridhi</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-96 px-4 py-2 rounded-lg text-gray-900 focus:outline-none"
              />
              <button type="submit" className="absolute right-3 top-2.5 text-gray-500">
                <Search className="h-5 w-5" />
              </button>
            </form>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/products" className="hover:text-green-200">Products</Link>
            <Link to="/offices" className="hover:text-green-200">Offices</Link>
            {user?.role === 'seller' && (
              <Link to="/seller" className="hover:text-green-200">Seller Dashboard</Link>
            )}
            <Link to="/cart" className="hover:text-green-200">
              <ShoppingCart className="h-6 w-6" />
            </Link>
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="hover:text-green-200">
                  <User className="h-6 w-6" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 hover:text-green-200"
                >
                  <LogOut className="h-6 w-6" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="hover:text-green-200">
                <User className="h-6 w-6" />
              </Link>
            )}
          </div>

          <div className="md:hidden">
            <button className="p-2">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};