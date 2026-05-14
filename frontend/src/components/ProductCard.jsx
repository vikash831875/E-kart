import React, { useState } from 'react'
import { Button } from './ui/button';
import { ShoppingCart } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCart } from '@/redux/productSlice';
import axios from 'axios';
import { toast } from 'sonner';

const ProductCard = ({ product, loading }) => {

  const { productImg, productPrice, productName, productDesc, images, thumbnail } = product || {};
  const [imageError, setImageError] = useState(false);
  const accessToken = localStorage.getItem('accessToken');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get primary image with multiple fallbacks
  const imageUrl = 
    images?.[0] || 
    thumbnail || 
    productImg?.[0]?.url || 
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80';

  const addToCart = async(productId)=>{
    try {
        const res = await axios.post(`http://localhost:8000/api/v1/cart/add`, {productId}, {
            headers:{
                Authorization:`Bearer ${accessToken}`

            }
        })
        if(res.data.success){
            toast.success('Product addded to Cart');
            dispatch(setCart(res.data.cart))
        }
    } catch (error) {
        console.error(error);
        
    }
  }

  const handleImageError = () => {
    setImageError(true);
    console.warn(`Failed to load image for product: ${productName}`);
  };

  return (
    <div className='shadow-lg rounded-lg overflow-hidden h-max'>
      
      <div className='w-full h-full aspect-square overflow-hidden relative bg-gray-100'>
        {
          loading
            ? <Skeleton className='w-full h-full rounded-lg' />
            : (
              <>
                <img
                  onClick={()=>navigate(`/products/${product._id}`)}
                  src={imageError ? 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80' : imageUrl}
                  alt={productName || "Product image"}
                  onError={handleImageError}
                  className='w-full h-full transform duration-300 hover:scale-105 object-cover'
                />
                {imageError && (
                  <div className='absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50'>
                    <div className='text-center'>
                      <svg className='w-8 h-8 text-gray-400 mx-auto mb-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                      </svg>
                      <p className='text-xs text-gray-500'>Image unavailable</p>
                    </div>
                  </div>
                )}
              </>
            )
        }
      </div>

      {
        loading
          ? <div className='px-2 space-y-2 my-2'>
              <Skeleton className='w-[200px] h-4' />
              <Skeleton className='w-[100px] h-4' />
              <Skeleton className='w-[150px] h-8' />
            </div>
          : <div className='px-2 space-y-1'>
              
              <h1 className='font-semibold h-12 line-clamp-2'>{productName}</h1>

              {/* ✅ USING productDesc */}
              <p className='text-sm text-gray-600 line-clamp-2'>
                {productDesc}
              </p>

              <h2 className='font-bold'>₹{productPrice}</h2>

              <Button onClick = {()=> addToCart(product._id)} className='bg-pink-600 mb-3 w-full flex items-center justify-center gap-2'>
                <ShoppingCart size={18} />
                Add to Cart
              </Button>

            </div>
      }

    </div>
  )
}

export default ProductCard