import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Search, Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AuthModal from '../auth/AuthModal';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsProfileMenuOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/events', label: 'Events' },
    { path: '/submit', label: 'Submit Event' },
  ];

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-300 bg-purple-700 text-white ${isScrolled ? 'shadow-md py-2' : 'py-4'}`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center">
            <Link
              to="/"
              className="flex items-center space-x-2 text-white transition-colors hover:text-purple-200"
            >
              <Calendar size={28} />
              <span className="text-xl font-bold">EventHub</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'text-yellow-200 underline underline-offset-4'
                      : 'text-white hover:text-yellow-200'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/search"
                className="p-2 text-white hover:text-yellow-200 transition-colors"
                aria-label="Search events"
              >
                <Search size={20} />
              </Link>

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-2 text-white hover:text-yellow-200 transition-colors"
                  >
                    <User size={20} />
                    <span className="text-sm font-medium">Profile</span>
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/my-events"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        My Events
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                      >
                        <LogOut size={16} className="mr-2" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-yellow-400 hover:bg-yellow-300 text-purple-900 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-white hover:text-yellow-200 transition-colors"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-purple-800 text-white shadow-md rounded-b-lg py-4 px-6 flex flex-col space-y-4 transition-all duration-300 ease-in-out transform">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'text-yellow-200 underline underline-offset-4'
                      : 'text-white hover:text-yellow-200'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/search"
                className="flex items-center space-x-2 text-white hover:text-yellow-200 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Search size={18} />
                <span>Search Events</span>
              </Link>

              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 text-white hover:text-yellow-200 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User size={18} />
                    <span>My Profile</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 text-red-200 hover:text-red-400 transition-colors"
                  >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsAuthModalOpen(true);
                  }}
                  className="bg-yellow-400 hover:bg-yellow-300 text-purple-900 font-medium py-2 px-4 rounded-lg transition-colors w-full"
                >
                  Sign In
                </button>
              )}
            </div>
          )}
        </div>
      </nav>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default Navbar;