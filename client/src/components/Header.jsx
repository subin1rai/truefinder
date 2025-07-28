import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, LogOut, User, Settings } from "lucide-react";
import { logout } from "../redux/slice/AuthSlice"; // Adjust the path as needed

const Header = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    dispatch(logout());
    setIsDropdownOpen(false);
    // optionally clear persist
    // persistor.purge(); // only if you want to fully clear persisted state
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Heart className="h-8 w-8 text-pink-500" />
          <span className="text-2xl font-bold text-gray-800">BestMate</span>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          {isAuthenticated ? (
            <>
            <a
              href="/dashboard"
              className="text-gray-600 hover:text-pink-500 transition-colors"
              >
              dashboard
            </a>
            <a
              href="/browse"
              className="text-gray-600 hover:text-pink-500 transition-colors"
              >
              Browse Profile
            </a>
            <a
              href="/chat"
              className="text-gray-600 hover:text-pink-500 transition-colors"
              >
              Message
            </a>
              </>
          ) : (
            <>
              <a
                href="/browse"
                className="text-gray-600 hover:text-pink-500 transition-colors"
              >
                Browse Profiles
              </a>
              <a
                href="/about"
                className="text-gray-600 hover:text-pink-500 transition-colors"
              >
                About
              </a>
              <a
                href="/contact"
                className="text-gray-600 hover:text-pink-500 transition-colors"
              >
                Contact
              </a>
            </>
          )}
        </nav>

        <div className="flex items-center space-x-3">
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <Avatar
                className="cursor-pointer hover:ring-2 hover:ring-pink-300 transition-all"
                onClick={toggleDropdown}
              >
                <AvatarImage src={user?.avatar || ""} />
                <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                    <div className="font-medium">{user?.name || "User"}</div>
                    <div className="text-gray-500 text-xs">
                      {user?.email || ""}
                    </div>
                  </div>

                  <a
                    href="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </a>

                  <a
                    href="/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </a>

                  <div className="border-t border-gray-100 mt-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <a href="/auth">
                <Button variant="outline">Login</Button>
              </a>
              <a href="/auth">
                <Button className="bg-pink-500 hover:bg-pink-600">
                  Join Now
                </Button>
              </a>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
