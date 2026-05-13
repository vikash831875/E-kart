import Breadcrums from '@/components/Breadcrums'
import ProductDesc from '@/components/ProductDesc'
import ProductImg from '@/components/ProductImg'
import React, { useEffect } from 'react' // ✅ Import useEffect
import { useSelector, useDispatch } from 'react-redux' // ✅ Import useDispatch
import { useParams } from 'react-router-dom'
import axios from 'axios'
// Add this near your other imports at the top!
import { setProducts } from '@/redux/productSlice';
// 👇 Make sure to import whatever action you use to save products to Redux
// import { setProducts } from '@/redux/productSlice' 

const SingleProduct = () => {
  const params = useParams();
  const productId = params.id;
  const dispatch = useDispatch();
  const { products } = useSelector(store => store.product);

  const product = products.find((item) => item._id === productId);

  // ✅ THE NEW FIX: Fetch data if the product is undefined
  useEffect(() => {
    const fetchProducts = async () => {
      if (!product) {
        try {
          // ✅ Changed to match your Express router!
          const res = await axios.get('http://localhost:8000/api/v1/product/getallproducts'); 
          
          if (res.data.success) {
            // ✅ Dispatch all products back to Redux so product.find() works
            dispatch(setProducts(res.data.products)); 
          }
        } catch (error) {
          console.error("Error fetching product data:", error);
        }
      }
    };

    fetchProducts();
  }, [product, dispatch]);// Re-run if product changes


  // Our safety check from earlier
  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading product...
      </div>
    );
  }

  return (
    <div className='pt-20 py-10 max-w-7xl mx-auto'>
       <Breadcrums product={product} />
       <div className='mt-10 grid grid-cols-2 items-start'>
        <ProductImg images={product.productImg} /> 
        <ProductDesc product={product} />
       </div>
    </div>
  )
}

export default SingleProduct