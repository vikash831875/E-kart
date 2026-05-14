import { ShoppingCart, Menu, X } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/userSlice";

const Navbar = () => {
  const { cart } = useSelector((store) => store.product);
  const { user } = useSelector((store) => store.user);

  const admin = user?.role === "admin";

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const accessToken = localStorage.getItem("accessToken");

  const [open, setOpen] = useState(false);

  // ✅ Logout Handler
  const logoutHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/user/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.data.success) {
        dispatch(setUser(null));
        localStorage.removeItem("accessToken");

        toast.success(res.data.message);

        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      toast.error("Logout failed");
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-md fixed top-0 left-0 w-full z-50 border-b shadow-sm">
      
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
        
        {/* ✅ Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/Ekart.png"
            alt="Ekart Logo"
            className="w-[85px] sm:w-[100px] md:w-[110px] object-contain"
          />
        </Link>

        {/* ✅ Desktop Menu */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          <ul className="flex items-center gap-6 lg:gap-8 text-[16px] font-semibold text-gray-700">
            
            <Link
              to="/"
              className="hover:text-pink-600 transition duration-200"
            >
              Home
            </Link>

            <Link
              to="/products"
              className="hover:text-pink-600 transition duration-200"
            >
              Products
            </Link>

            {user && (
              <Link
                to={`/profile/${user._id}`}
                className="hover:text-pink-600 transition duration-200"
              >
                Hello {user.firstName}
              </Link>
            )}

            {admin && (
              <Link
                to="/dashboard/sales"
                className="hover:text-pink-600 transition duration-200"
              >
                Dashboard
              </Link>
            )}
          </ul>

          {/* ✅ Cart */}
          <Link
            to="/cart"
            className="relative hover:scale-105 transition"
          >
            <ShoppingCart size={24} />

            <span className="absolute -top-2 -right-3 bg-pink-600 text-white text-xs font-bold min-w-[20px] h-[20px] flex items-center justify-center rounded-full px-1">
              {cart?.items?.length || 0}
            </span>
          </Link>

          {/* ✅ Auth Button */}
          {user ? (
            <Button
              onClick={logoutHandler}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white px-5"
            >
              Logout
            </Button>
          ) : (
            <Button
              onClick={() => navigate("/login")}
              className="bg-pink-600 hover:bg-pink-700 text-white px-5"
            >
              Login
            </Button>
          )}
        </nav>

        {/* ✅ Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* ✅ Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          open ? "max-h-[500px]" : "max-h-0"
        }`}
      >
        <div className="bg-white border-t shadow-lg px-5 py-6 flex flex-col gap-5">
          
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="text-lg font-semibold text-gray-700 hover:text-pink-600 transition"
          >
            Home
          </Link>

          <Link
            to="/products"
            onClick={() => setOpen(false)}
            className="text-lg font-semibold text-gray-700 hover:text-pink-600 transition"
          >
            Products
          </Link>

          {user && (
            <Link
              to={`/profile/${user._id}`}
              onClick={() => setOpen(false)}
              className="text-lg font-semibold text-gray-700 hover:text-pink-600 transition"
            >
              Hello {user.firstName}
            </Link>
          )}

          {admin && (
            <Link
              to="/dashboard/sales"
              onClick={() => setOpen(false)}
              className="text-lg font-semibold text-gray-700 hover:text-pink-600 transition"
            >
              Dashboard
            </Link>
          )}

          {/* ✅ Cart */}
          <Link
            to="/cart"
            onClick={() => setOpen(false)}
            className="flex items-center justify-between text-lg font-semibold text-gray-700 hover:text-pink-600 transition"
          >
            <span>Cart</span>

            <span className="bg-pink-600 text-white min-w-[24px] h-[24px] flex items-center justify-center rounded-full text-sm px-2">
              {cart?.items?.length || 0}
            </span>
          </Link>

          {/* ✅ Auth Button */}
          {user ? (
            <Button
              onClick={() => {
                logoutHandler();
                setOpen(false);
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white"
            >
              Logout
            </Button>
          ) : (
            <Button
              onClick={() => {
                navigate("/login");
                setOpen(false);
              }}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white"
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;