import FilterSidebar from "@/components/FilterSidebar";
import React, { useEffect, useState } from "react";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import ProductCard from "@/components/ProductCard";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "@/redux/productSlice";
import { Filter, X } from "lucide-react";

const Products = () => {
  const products = useSelector((state) => state.product.products);

  const [allProducts, setAllProducts] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 999999]);
  const [sort, setSort] = useState("");

  // ✅ Mobile Filter Toggle
  const [showFilter, setShowFilter] = useState(false);

  const dispatch = useDispatch();

  // ✅ Fetch Products
  const getAllProducts = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/product/getallproducts`
      );

      if (res.data.success) {
        setAllProducts(res.data.products);
        dispatch(setProducts(res.data.products));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ Filtering Logic
  useEffect(() => {
    let filtered = [...allProducts];

    // Search
    if (search.trim()) {
      const keyword = search.toLowerCase();

      filtered = filtered.filter(
        (p) =>
          p.productName?.toLowerCase().includes(keyword) ||
          p.brand?.toLowerCase().includes(keyword) ||
          p.category?.toLowerCase().includes(keyword) ||
          p.productDesc?.toLowerCase().includes(keyword)
      );
    }

    // Category
    if (category !== "All") {
      filtered = filtered.filter(
        (p) => p.category === category
      );
    }

    // Brand
    if (brand !== "All") {
      filtered = filtered.filter(
        (p) => p.brand === brand
      );
    }

    // Price
    filtered = filtered.filter(
      (p) =>
        p.productPrice >= priceRange[0] &&
        p.productPrice <= priceRange[1]
    );

    // Sorting
    if (sort === "lowtoHigh") {
      filtered.sort(
        (a, b) => a.productPrice - b.productPrice
      );
    } else if (sort === "hightoLow") {
      filtered.sort(
        (a, b) => b.productPrice - a.productPrice
      );
    }

    dispatch(setProducts(filtered));
  }, [
    search,
    category,
    brand,
    priceRange,
    sort,
    allProducts,
    dispatch,
  ]);

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-10 px-4 sm:px-6 lg:px-8">
      
      <div className="max-w-7xl mx-auto">

        {/* ✅ Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Products
            </h1>

            <p className="text-sm sm:text-base text-gray-500 mt-1">
              Explore all available products
            </p>
          </div>

          {/* ✅ Mobile Filter Button */}
          <button
            onClick={() => setShowFilter(true)}
            className="
              md:hidden
              flex
              items-center
              gap-2
              border
              bg-white
              px-4
              py-2.5
              rounded-xl
              shadow-sm
              text-sm
              font-medium
              hover:bg-gray-100
              transition
            "
          >
            <Filter size={18} />
            Filters
          </button>
        </div>

        {/* ✅ Main Layout */}
        <div className="flex flex-col md:flex-row gap-6">

          {/* ✅ Sidebar Desktop */}
          <div className="hidden md:block w-[260px] shrink-0">
            <FilterSidebar
              search={search}
              setSearch={setSearch}
              brand={brand}
              setBrand={setBrand}
              category={category}
              setCategory={setCategory}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              allProducts={allProducts}
            />
          </div>

          {/* ✅ Mobile Sidebar Overlay */}
          {showFilter && (
            <>
              {/* Overlay */}
              <div
                className="fixed inset-0 bg-black/40 z-40 md:hidden"
                onClick={() => setShowFilter(false)}
              />

              {/* Sidebar */}
              <div
                className="
                  fixed
                  top-0
                  left-0
                  h-full
                  w-[85%]
                  max-w-[320px]
                  bg-white
                  z-50
                  overflow-y-auto
                  shadow-xl
                  p-4
                  md:hidden
                "
              >
                
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold">
                    Filters
                  </h2>

                  <button
                    onClick={() => setShowFilter(false)}
                    className="p-2 rounded-lg hover:bg-gray-100"
                  >
                    <X size={22} />
                  </button>
                </div>

                <FilterSidebar
                  search={search}
                  setSearch={setSearch}
                  brand={brand}
                  setBrand={setBrand}
                  category={category}
                  setCategory={setCategory}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  allProducts={allProducts}
                />
              </div>
            </>
          )}

          {/* ✅ Products Section */}
          <div className="flex-1">

            {/* Sort */}
            <div className="flex justify-between items-center mb-5">
              
              <p className="text-sm sm:text-base text-gray-600">
                {products?.length || 0} Products Found
              </p>

              <div className="w-[180px]">
                <NativeSelect
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <NativeSelectOption value="">
                    Sort By
                  </NativeSelectOption>

                  <NativeSelectOption value="lowtoHigh">
                    Price: Low to High
                  </NativeSelectOption>

                  <NativeSelectOption value="hightoLow">
                    Price: High to Low
                  </NativeSelectOption>
                </NativeSelect>
              </div>
            </div>

            {/* ✅ Product Grid */}
            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
                2xl:grid-cols-5
                gap-5
              "
            >
              {products?.length > 0 ? (
                products.map((p) => (
                  <div key={p._id} className="h-full">
                    <ProductCard product={p} />
                  </div>
                ))
              ) : (
                <div className="col-span-full flex justify-center items-center py-20">
                  <p className="text-gray-500 text-lg font-medium">
                    No Products Found
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;