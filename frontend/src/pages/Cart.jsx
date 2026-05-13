import { Card } from '@/components/ui/card';
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import userLogo from "../assets/userlogo.jpg"
import axios from 'axios';
import { setCart } from '@/redux/productSlice';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const navigate = useNavigate();
    const { cart } = useSelector(store => store.product);
    const dispatch = useDispatch();
    const accessToken = localStorage.getItem('accessToken');

    // ✅ Fetch cart
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await axios.get('http://localhost:8000/api/v1/cart', {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });

                if (res.data.success) {
                    dispatch(setCart(res.data.cart));
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchCart();
    }, []);

    const API = 'http://localhost:8000/api/v1/cart';
    

    // load cart

    const loadCart = async()=>{
        try {

            const res = await axios.get(API, {
                headers:{
                    Authorization:`Bearer ${accessToken}`
                }
            })

            if(res.data.success){
                 dispatch(setCart(res.data.cart))
            }
            
        } catch (error) {

            console.log(error);
            
        }
    }



    

    // ✅ Update quantity
    const updateQuantity = async (productId, type) => {
        const res = await axios.put(
            'http://localhost:8000/api/v1/cart/update',
            { productId, type },
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        dispatch(setCart(res.data.cart));
    };

    // ✅ Remove item
    const removeItem = async (productId) => {
        const res = await axios.delete(
            'http://localhost:8000/api/v1/cart/remove',
            {
                data: { productId },
                headers: { Authorization: `Bearer ${accessToken}` }
            }
        );

        dispatch(setCart(res.data.cart));
        toast.success("Product removed from Cart")
    };

    // ✅ CALCULATIONS
    const subtotal = cart?.items?.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    ) || 0;

    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    useEffect(()=>{
        loadCart()
    }, [dispatch])

    return (
        <div className='pt-20 bg-gray-50 min-h-screen px-4'>

            <div className='max-w-7xl mx-auto'>
                <h1 className='text-2xl font-bold mb-6'>Shopping Cart</h1>

                <div className='flex flex-col lg:flex-row gap-6'>

                    {/* ✅ LEFT SIDE */}
                    <div className='flex-1 flex flex-col gap-5'>

                        {cart?.items?.length > 0 ? (
                            cart.items.map((item, index) => {
                                const product = item.productId;

                                return (
                                    <Card key={index}>
                                        <div className='flex flex-col sm:flex-row items-center justify-between p-4 gap-4'>

                                            {/* LEFT (Image + Details) */}
                                            <div className='flex items-center gap-4 w-full sm:w-[40%]'>

                                                <img
                                                    src={product?.productImg?.[0]?.url || userLogo}
                                                    alt=""
                                                    className='w-20 h-20 rounded object-cover'
                                                />

                                                <div className='flex flex-col'>

                                                    {/* Name */}
                                                    <h2 className='font-semibold truncate max-w-[200px]'>
                                                        {product?.productName}
                                                    </h2>

                                                    {/* ✅ Description */}
                                                    <p className='text-sm text-gray-500 line-clamp-2'>
                                                        {product?.productDesc}
                                                    </p>

                                                    {/* Price */}
                                                    <p className='text-sm font-medium text-gray-700 mt-1'>
                                                        ₹{item.price}
                                                    </p>

                                                </div>
                                            </div>

                                            {/* CENTER (Quantity) */}
                                            <div className='flex items-center gap-3'>
                                                <button
                                                    onClick={() => updateQuantity(product._id, "decrease")}
                                                    className='border px-3 py-1 rounded'
                                                >
                                                    -
                                                </button>

                                                <span>{item.quantity}</span>

                                                <button
                                                    onClick={() => updateQuantity(product._id, "increase")}
                                                    className='border px-3 py-1 rounded'
                                                >
                                                    +
                                                </button>
                                            </div>

                                            {/* RIGHT (Total + Remove) */}
                                            <div className='flex items-center gap-6'>
                                                <h2 className='font-semibold'>
                                                    ₹{item.price * item.quantity}
                                                </h2>

                                                <button
                                                    onClick={() => removeItem(product._id)}
                                                    className='text-red-500 flex items-center gap-1'
                                                >
                                                    <Trash2 size={16} />
                                                    Remove
                                                </button>
                                            </div>

                                        </div>
                                    </Card>
                                )
                            })
                        ) : (
                            <div className='flex flex-col items-center justify-center mt-20 gap-4'>

        <p className='text-gray-500 text-lg'>
            Your cart is empty 🛒
        </p>

        <button
            onClick={() => window.location.href = "/products"}
            className='bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700'
        >
            Go to Products
        </button>

    </div>
                      
                        )}

                    </div>

                    {/* ✅ RIGHT SIDE (ORDER SUMMARY) */}
                    <div className='w-full lg:w-[350px] bg-white rounded-lg p-5 shadow'>

                        <h2 className='font-semibold text-lg mb-4'>Order Summary</h2>

                        <div className='flex justify-between mb-2'>
                            <span>Subtotal ({cart?.items?.length || 0} items)</span>
                            <span>₹{subtotal}</span>
                        </div>

                        <div className='flex justify-between mb-2'>
                            <span>Shipping</span>
                            <span>₹0</span>
                        </div>

                        <div className='flex justify-between mb-2'>
                            <span>Tax (5%)</span>
                            <span>₹{tax.toFixed(2)}</span>
                        </div>

                        <hr className='my-3' />

                        <div className='flex justify-between font-bold text-lg'>
                            <span>Total</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>

                        {/* Promo */}
                        <div className='flex gap-2 mt-4'>
                            <input
                                type="text"
                                placeholder="Promo Code"
                                className='border p-2 rounded w-full'
                            />
                            <button className='border px-3 rounded'>Apply</button>
                        </div>

                        {/* Buttons */}
                        <button onClick={()=>navigate('/address')} className='w-full bg-pink-600 text-white py-2 mt-4 rounded'>
                            PLACE ORDER
                        </button>

                        <button className='w-full border py-2 mt-2 rounded'>
                            Continue Shopping
                        </button>

                        {/* Info */}
                        <ul className='text-xs text-gray-500 mt-4 space-y-1'>
                            <li>* Free shipping on orders over 299</li>
                            <li>* 30-days return policy</li>
                            <li>* Secure checkout with SSL encryption</li>
                        </ul>

                    </div>

                </div>
            </div>
        </div>
    )
}

export default Cart