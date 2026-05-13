import { ShoppingCart, Menu, X, User } from 'lucide-react';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from './ui/button';
import axios from 'axios';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '@/redux/userSlice';

const Navbar = () => {

  

    const { cart } = useSelector(store => store.product);
    const { user } = useSelector(store => store.user);
      const admin = user?.role==="admin" ? true : false;

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const accessToken = localStorage.getItem('accessToken');

    const [open, setOpen] = useState(false);

    // ✅ Logout
    const logoutHandler = async () => {
        try {
            const res = await axios.post(
                `http://localhost:8000/api/v1/user/logout`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            );

            if (res.data.success) {
                dispatch(setUser(null));
                localStorage.removeItem('accessToken');
                toast.success(res.data.message);
                navigate('/login');
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <header className='bg-pink-50 fixed w-full z-20 border-b border-pink-200'>

            {/* ✅ Top Navbar */}
            <div className='max-w-7xl mx-auto flex justify-between items-center py-3 px-4'>

                {/* Logo */}
                <img src='/Ekart.png' alt='' className='w-[100px]' />

                {/* ✅ Desktop Menu */}
                <nav className='hidden md:flex items-center gap-10'>

                    <ul className='flex gap-7 items-center text-lg font-semibold'>
                        <Link to="/">Home</Link>
                        <Link to="/products">Products</Link>

                        {user && (
                            <Link to={`/profile/${user._id}`}>
                                <li>Hello {user.firstName}</li>
                            </Link>
                        )}

                        {admin && (
                            <Link to={`/dashboard/sales`}>
                                <li> Dashboard</li>
                            </Link>
                        )}
                    </ul>

                    {/* Cart */}
                    <Link to="/cart" className='relative'>
                        <ShoppingCart />
                        <span className='bg-pink-500 rounded-full absolute text-white -top-2 -right-4 px-2 text-xs'>
                            {cart?.items?.length || 0}
                        </span>
                    </Link>

                    {/* Auth */}
                    {user ? (
                        <Button onClick={logoutHandler} className="bg-gradient-to-tl from-blue-600 to-purple-600 text-white">
                            Logout
                        </Button>
                    ) : (
                        <Button onClick={() => navigate('/login')} className="bg-pink-600 text-white">
                            Login
                        </Button>
                    )}

                </nav>

                {/* ✅ Mobile Hamburger */}
                <div className='md:hidden'>
                    <button onClick={() => setOpen(!open)}>
                        {open ? <X size={28}/> : <Menu size={28}/>}
                    </button>
                </div>

            </div>

            {/* ✅ Mobile Menu (VERTICAL) */}
            {open && (
                <div className='md:hidden bg-white border-t px-5 py-6 flex flex-col gap-5 shadow'>

                    <Link 
                        to="/" 
                        onClick={()=>setOpen(false)} 
                        className='text-lg font-semibold'
                    >
                        Home
                    </Link>

                    <Link 
                        to="/products" 
                        onClick={()=>setOpen(false)} 
                        className='text-lg font-semibold'
                    >
                        Products
                    </Link>

                    {user && (
                        <Link 
                            to={`/profile/${user._id}`} 
                            onClick={()=>setOpen(false)} 
                            className='text-lg font-semibold'
                        >
                            Hello {user.firstName}
                        </Link>
                    )}

                    {/* Cart */}
                    <Link 
                        to="/cart" 
                        onClick={()=>setOpen(false)} 
                        className='flex justify-between items-center text-lg font-semibold'
                    >
                        <span>Cart</span>
                        <span className='bg-pink-500 text-white px-2 rounded-full text-sm'>
                            {cart?.items?.length || 0}
                        </span>
                    </Link>

                    {/* Auth */}
                    {user ? (
                        <Button 
                            onClick={logoutHandler} 
                            className="w-full bg-gradient-to-tl from-blue-600 to-purple-600 text-white"
                        >
                            Logout
                        </Button>
                    ) : (
                        <Button 
                            onClick={() => navigate('/login')} 
                            className="w-full bg-pink-600 text-white"
                        >
                            Login
                        </Button>
                    )}

                </div>
            )}

        </header>
    )
}

export default Navbar