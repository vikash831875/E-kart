import Breadcrums from "@/components/Breadcrums";
import ProductDesc from "@/components/ProductDesc";
import ProductImg from "@/components/ProductImg";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import { setProducts } from "@/redux/productSlice";

const SingleProduct = () => {
  const params = useParams();

  const productId = params.id;

  const dispatch = useDispatch();

  const { products } = useSelector((store) => store.product);

  const product = products.find(
    (item) => item._id === productId
  );

  // ✅ Fetch Products if product not found
  useEffect(() => {
    const fetchProducts = async () => {
      if (!product) {
        try {
          const res = await axios.get(
            "http://localhost:8000/api/v1/product/getallproducts"
          );

          if (res.data.success) {
            dispatch(setProducts(res.data.products));
          }
        } catch (error) {
          console.error(
            "Error fetching product data:",
            error
          );
        }
      }
    };

    fetchProducts();
  }, [product, dispatch]);

  // ✅ Loading State
  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen px-4">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-lg sm:text-xl font-medium text-gray-700">
            Loading product...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        min-h-screen
        bg-white
        pt-24
        pb-10
        px-4
        sm:px-6
        lg:px-8
      "
    >
      <div className="max-w-7xl mx-auto">

        {/* ✅ Breadcrumbs */}
        <div className="mb-6 sm:mb-8 overflow-x-auto">
          <Breadcrums product={product} />
        </div>

        {/* ✅ Main Product Section */}
        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-8
            xl:gap-12
            items-start
          "
        >
          {/* Product Images */}
          <div className="w-full">
            <ProductImg images={product.productImg} />
          </div>

          {/* Product Description */}
          <div className="w-full">
            <ProductDesc product={product} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;