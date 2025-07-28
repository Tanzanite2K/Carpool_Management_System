import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <header className="w-full bg-gradient-to-r from-[#3AAFA9] to-[#2B7A78] text-white shadow-md">
      <div className="w-full px-6 md:px-12 py-5 flex justify-between items-center">
        <div className="text-3xl md:text-4xl font-extrabold tracking-wide hover:scale-105 transition-transform duration-300">
          <Link to="/">Carpooling Website</Link>
        </div>

        {/* Right - Navigation + Auth */}
        <div className="flex items-center space-x-6 text-lg font-medium">
          {isLoggedIn && (
            <>
              <Link
                to="/search"
                className="hover:underline hover:text-gray-100 transition duration-200"
              >
                Search
              </Link>
              <Link
                to="/share"
                className="hover:underline hover:text-gray-100 transition duration-200"
              >
                Share
              </Link>
              <Link
                to="/trips"
                className="hover:underline hover:text-gray-100 transition duration-200"
              >
                Trips
              </Link>
            </>
          )}

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="px-5 py-2 rounded-full bg-white text-[#17252A] font-semibold hover:bg-gray-200 transition duration-300"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="px-5 py-2 rounded-full hover:bg-white hover:text-[#17252A] font-semibold transition duration-300"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 bg-white text-[#17252A] rounded-full font-semibold hover:bg-gray-200 transition duration-300"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;