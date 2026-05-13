import FilterSidebar from '@/components/FilterSidebar'
import React, { useEffect, useState } from 'react'
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select"
import ProductCard from '@/components/ProductCard'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setProducts } from '@/redux/productSlice'

const Products = () => {

    const products = useSelector(state => state.product.products)

    const [allProducts, setAllProducts] = useState([])
    const [search, setSearch] = useState("")
    const [category, setCategory] = useState("All")
    const [brand, setBrand] = useState("All")
    const [priceRange, setPriceRange] = useState([0, 999999])
    const [sort, setSort] = useState("")

    const [showFilter, setShowFilter] = useState(false) // ✅ mobile toggle

    const dispatch = useDispatch()

    // ✅ API
    const getAllProducts = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/api/v1/product/getallproducts`)
            if (res.data.success) {
                setAllProducts(res.data.products)
                dispatch(setProducts(res.data.products))
            }
        } catch (error) {
            console.log(error)
        }
    }

    // ✅ FILTER
    useEffect(() => {
        let filtered = [...allProducts]

        if (search.trim()) {
            const keyword = search.toLowerCase()
            filtered = filtered.filter(p =>
                p.productName?.toLowerCase().includes(keyword) ||
                p.brand?.toLowerCase().includes(keyword) ||
                p.category?.toLowerCase().includes(keyword) ||
                p.productDesc?.toLowerCase().includes(keyword)
            )
        }

        if (category !== "All") {
            filtered = filtered.filter(p => p.category === category)
        }

        if (brand !== "All") {
            filtered = filtered.filter(p => p.brand === brand)
        }

        filtered = filtered.filter(p =>
            p.productPrice >= priceRange[0] &&
            p.productPrice <= priceRange[1]
        )

        if (sort === "lowtoHigh") {
            filtered.sort((a, b) => a.productPrice - b.productPrice)
        } else if (sort === "hightoLow") {
            filtered.sort((a, b) => b.productPrice - a.productPrice)
        }

        dispatch(setProducts(filtered))

    }, [search, category, brand, priceRange, sort, allProducts])

    useEffect(() => {
        getAllProducts()
    }, [])

    return (
        <div className='pt-20 pb-10 px-4'>
            <div className='max-w-7xl mx-auto'>

                {/* ✅ MOBILE FILTER BUTTON */}
                <div className='md:hidden mb-4 flex justify-between items-center'>
                    <h1 className='text-xl font-semibold'>Products</h1>

                    <button
                        onClick={() => setShowFilter(!showFilter)}
                        className='border px-4 py-2 rounded'
                    >
                        Filter
                    </button>
                </div>

                <div className='flex flex-col md:flex-row gap-6'>

                    {/* ✅ SIDEBAR */}
                    <div className={`${showFilter ? "block" : "hidden"} md:block w-full md:w-[250px]`}>
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

                    {/* ✅ MAIN */}
                    <div className='flex-1'>

                        {/* SORT */}
                        <div className='flex justify-end mb-4'>
                            <NativeSelect
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                            >
                                <NativeSelectOption>Sort</NativeSelectOption>
                                <NativeSelectOption value="lowtoHigh">
                                    Price: Low to High
                                </NativeSelectOption>
                                <NativeSelectOption value="hightoLow">
                                    Price: High to Low
                                </NativeSelectOption>
                            </NativeSelect>
                        </div>

                        {/* ✅ GRID */}
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5'>

                            {
                                products?.length > 0 ? (
                                    products.map((p) => (
                                        <ProductCard key={p._id} product={p} />
                                    ))
                                ) : (
                                    <p className='text-center col-span-full text-gray-500'>
                                        No Products Found
                                    </p>
                                )
                            }

                        </div>

                    </div>

                </div>
            </div>
        </div>
    )
}

export default Products