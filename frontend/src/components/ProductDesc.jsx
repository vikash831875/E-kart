import React from 'react'
import { Button } from './ui/button'
import axios from 'axios'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setCart } from '@/redux/productSlice'

const ProductDesc = ({ product }) => {
  const accessToken = localStorage.getItem("accessToken")
  const dispatch = useDispatch()

  // ✅ Fixed the syntax error here
  const addToCart = async (productId) => {
    try {
      const res = await axios.post(`http://localhost:8000/api/v1/cart/add`, { productId }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      if (res.data.success) {
        toast.success("Product added to Cart")
        dispatch(setCart(res.data.cart))
      }
    } catch (error) {
      console.error(error);
      // Let the user know if something went wrong!
      toast.error(error.response?.data?.message || "Failed to add to cart"); 
    }
  }

  return (
    <div className='flex flex-col gap-4'>
      <h1 className='font-bold text-4xl text-gray-800'>{product.productName}</h1>
      <p className='text-gray-800'>{product.category} | {product.brand}</p>
      <h2 className='text-pink-500 font-bold text-2xl'>₹{product.productPrice}</h2>

      <p className='line-clamp-12 text-muted-foreground'>{product.productDesc}</p>

      <div className='flex gap-2 items-center w-[300px]'>
        <p className='text-gray-800'>Quantity :</p>
        {/* Added a min={1} so users can't accidentally order 0 or negative items */}
        <input type='number' className='w-14' defaultValue={1} min={1} /> 
      </div>

      {/* ✅ Connected the addToCart function to the button click */}
      <Button onClick={() => addToCart(product._id)} className='bg-pink-600 w-max'>
        Add to Cart
      </Button>

    </div>
  )
}

export default ProductDesc