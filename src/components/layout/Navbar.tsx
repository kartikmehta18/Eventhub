// import React, { useState, useEffect } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { Calendar, Search, Menu, X, User, LogOut } from 'lucide-react';
// import { useAuth } from '../../context/AuthContext';
// import AuthModal from '../auth/AuthModal';

// const Navbar: React.FC = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
//   const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
//   const location = useLocation();
//   const { user, signOut } = useAuth();

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   const handleSignOut = async () => {
//     try {
//       await signOut();
//       setIsProfileMenuOpen(false);
//     } catch (error) {
//       console.error('Error signing out:', error);
//     }
//   };

//   useEffect(() => {
//     const handleScroll = () => {
//       if (window.scrollY > 20) {
//         setIsScrolled(true);
//       } else {
//         setIsScrolled(false);
//       }
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => {
//       window.removeEventListener('scroll', handleScroll);
//     };
//   }, []);

//   const isActive = (path: string) => {
//     return location.pathname === path;
//   };
  
//   const navLinks = [
//     { path: '/', label: 'Home' },
//     { path: '/events', label: 'Events' },
//     { path: '/submit', label: 'Submit Event' },
//   ];

//   return (
//     <>
//       <nav
//         className={`fixed w-full z-50 transition-all duration-300 bg-purple-700 text-white ${isScrolled ? 'shadow-md py-2' : 'py-4'}`}
//       >
//         <div className="container mx-auto px-4 md:px-6">
//           <div className="flex justify-between items-center">
//             <Link
//               to="/"
//               className="flex items-center space-x-2 text-white transition-colors hover:text-purple-200"
//             >
//               <Calendar size={28} />
//               <span className="text-xl font-bold">EventHub</span>
//             </Link>

//             {/* Desktop Navigation */}
//             <div className="hidden md:flex items-center space-x-8">
//               {navLinks.map((link) => (
//                 <Link
//                   key={link.path}
//                   to={link.path}
//                   className={`text-sm font-medium transition-colors ${
//                     isActive(link.path)
//                       ? 'text-yellow-200 underline underline-offset-4'
//                       : 'text-white hover:text-yellow-200'
//                   }`}
//                 >
//                   {link.label}
//                 </Link>
//               ))}
//               <Link
//                 to="/search"
//                 className="p-2 text-white hover:text-yellow-200 transition-colors"
//                 aria-label="Search events"
//               >
//                 <Search size={20} />
//               </Link>

//               {user ? (
//                 <div className="relative">
//                   <button
//                     onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
//                     className="flex items-center space-x-2 text-white hover:text-yellow-200 transition-colors"
//                   >
//                     <User size={20} />
//                     <span className="text-sm font-medium">Profile</span>
//                   </button>

//                   {isProfileMenuOpen && (
//                     <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
//                       <Link
//                         to="/profile"
//                         className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
//                         onClick={() => setIsProfileMenuOpen(false)}
//                       >
//                         My Profile
//                       </Link>
//                       <Link
//                         to="/my-events"
//                         className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
//                         onClick={() => setIsProfileMenuOpen(false)}
//                       >
//                         My Events
//                       </Link>
//                       <button
//                         onClick={handleSignOut}
//                         className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
//                       >
//                         <LogOut size={16} className="mr-2" />
//                         Sign Out
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <button
//                   onClick={() => setIsAuthModalOpen(true)}
//                   className="bg-yellow-400 hover:bg-yellow-300 text-purple-900 font-medium py-2 px-4 rounded-lg transition-colors"
//                 >
//                   Sign In
//                 </button>
//               )}
//             </div>

//             {/* Mobile Menu Button */}
//             <button
//               className="md:hidden p-2 text-white hover:text-yellow-200 transition-colors"
//               onClick={toggleMenu}
//               aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
//             >
//               {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
//             </button>
//           </div>

//           {/* Mobile Navigation Menu */}
//           {isMenuOpen && (
//             <div className="md:hidden absolute top-full left-0 right-0 bg-purple-800 text-white shadow-md rounded-b-lg py-4 px-6 flex flex-col space-y-4 transition-all duration-300 ease-in-out transform">
//               {navLinks.map((link) => (
//                 <Link
//                   key={link.path}
//                   to={link.path}
//                   className={`text-sm font-medium transition-colors ${
//                     isActive(link.path)
//                       ? 'text-yellow-200 underline underline-offset-4'
//                       : 'text-white hover:text-yellow-200'
//                   }`}
//                   onClick={() => setIsMenuOpen(false)}
//                 >
//                   {link.label}
//                 </Link>
//               ))}
//               <Link
//                 to="/search"
//                 className="flex items-center space-x-2 text-white hover:text-yellow-200 transition-colors"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 <Search size={18} />
//                 <span>Search Events</span>
//               </Link>

//               {user ? (
//                 <>
//                   <Link
//                     to="/profile"
//                     className="flex items-center space-x-2 text-white hover:text-yellow-200 transition-colors"
//                     onClick={() => setIsMenuOpen(false)}
//                   >
//                     <User size={18} />
//                     <span>My Profile</span>
//                   </Link>
//                   <button
//                     onClick={() => {
//                       handleSignOut();
//                       setIsMenuOpen(false);
//                     }}
//                     className="flex items-center space-x-2 text-red-200 hover:text-red-400 transition-colors"
//                   >
//                     <LogOut size={18} />
//                     <span>Sign Out</span>
//                   </button>
//                 </>
//               ) : (
//                 <button
//                   onClick={() => {
//                     setIsMenuOpen(false);
//                     setIsAuthModalOpen(true);
//                   }}
//                   className="bg-yellow-400 hover:bg-yellow-300 text-purple-900 font-medium py-2 px-4 rounded-lg transition-colors w-full"
//                 >
//                   Sign In
//                 </button>
//               )}
//             </div>
//           )}
//         </div>
//       </nav>

//       <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
//     </>
//   );
// };

// export default Navbar;

"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Calendar, Search, Menu, X, User, LogOut, Sparkles, Bell, Ticket, ChevronDown } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import AuthModal from "../auth/AuthModal"

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const location = useLocation()
  const { user, signOut } = useAuth()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      setIsProfileMenuOpen(false)
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const navLinks = [
    { path: "/", label: "Home", icon: <Sparkles size={16} className="mr-1" /> },
    { path: "/events", label: "Events", icon: <Ticket size={16} className="mr-1" /> },
    { path: "/submit", label: "Submit Event", icon: <Calendar size={16} className="mr-1" /> },
  ]

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-500 bg-white/20 mt-2 border-2 border-white/5 rounded-full p-2 `}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center">
            <Link
              to="/"
              className="flex items-center space-x-2 text-white transition-all duration-300 transform hover:scale-105"
            >
              <div className="relative">
                <Calendar size={28} className="text-yellow-300" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                </span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-yellow-200 to-yellow-400 text-transparent bg-clip-text">
                EventHub
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center bg-purple-600/40 rounded-full p-1 backdrop-blur-sm">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center text-sm font-medium px-4 py-2 rounded-full transition-all duration-300 ${
                      isActive(link.path)
                        ? "bg-yellow-400 text-purple-900 shadow-md"
                        : "text-white hover:bg-purple-600/70"
                    }`}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                ))}
              </div>

              <Link
                to="/search"
                className="p-2 text-white hover:text-yellow-300 transition-colors relative group"
                aria-label="Search events"
              >
                <Search size={20} />
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-purple-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  Search
                </span>
              </Link>

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-2 bg-purple-600/40 hover:bg-purple-600/70 text-white rounded-full px-3 py-1.5 transition-all duration-300"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center text-purple-900 font-bold">
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : <User size={16} />}
                    </div>
                    <span className="text-sm font-medium max-w-[80px] truncate">{user.displayName || "Profile"}</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-300 ${isProfileMenuOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl py-2 border border-purple-200 transform transition-all duration-300 origin-top-right">
                      <div className="px-4 py-2 border-b border-purple-100">
                        <p className="text-sm font-medium text-purple-900">{user.email}</p>
                        <p className="text-xs text-purple-500">Logged in</p>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 transition-colors"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <User size={16} className="mr-2 text-purple-600" />
                        My Profile
                      </Link>
                      <Link
                        to="/my-events"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 transition-colors"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <Calendar size={16} className="mr-2 text-purple-600" />
                        My Events
                      </Link>
                      <Link
                        to="/notifications"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 transition-colors"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <Bell size={16} className="mr-2 text-purple-600" />
                        Notifications
                      </Link>
                      <div className="border-t border-purple-100 mt-1 pt-1">
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors"
                        >
                          <LogOut size={16} className="mr-2" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-300 hover:to-amber-300 text-purple-900 font-medium py-2 px-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-white hover:text-yellow-300 transition-colors bg-purple-600/40 rounded-full"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-gradient-to-b from-purple-800 to-violet-900 text-white shadow-lg rounded-b-2xl py-4 px-6 flex flex-col space-y-3 transition-all duration-300 ease-in-out transform border-t border-purple-500/30 backdrop-blur-sm">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center text-sm font-medium transition-colors p-2 rounded-lg ${
                    isActive(link.path) ? "bg-yellow-400 text-purple-900" : "text-white hover:bg-purple-700/50"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.icon}
                  <span className="ml-2">{link.label}</span>
                </Link>
              ))}
              <Link
                to="/search"
                className="flex items-center space-x-2 text-white hover:bg-purple-700/50 p-2 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Search size={18} />
                <span>Search Events</span>
              </Link>

              <div className="border-t border-purple-600/50 my-1 pt-2"></div>

              {user ? (
                <>
                  <div className="flex items-center space-x-3 p-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center text-purple-900 font-bold">
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : <User size={18} />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user.displayName || "User"}</p>
                      <p className="text-xs text-purple-300 truncate max-w-[200px]">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 text-white hover:bg-purple-700/50 p-2 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User size={18} />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    to="/my-events"
                    className="flex items-center space-x-2 text-white hover:bg-purple-700/50 p-2 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Calendar size={18} />
                    <span>My Events</span>
                  </Link>
                  <Link
                    to="/notifications"
                    className="flex items-center space-x-2 text-white hover:bg-purple-700/50 p-2 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Bell size={18} />
                    <span>Notifications</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut()
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center space-x-2 text-red-300 hover:bg-red-900/20 p-2 rounded-lg transition-colors w-full"
                  >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setIsMenuOpen(false)
                    setIsAuthModalOpen(true)
                  }}
                  className="bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-300 hover:to-amber-300 text-purple-900 font-medium py-3 px-4 rounded-lg transition-colors w-full flex items-center justify-center space-x-2"
                >
                  <User size={18} />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          )}
        </div>
      </nav>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  )
}

export default Navbar
