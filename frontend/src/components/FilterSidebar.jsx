import React from 'react'
import { Label } from './ui/label';
import { NativeSelect } from './ui/native-select';
import { Button } from './ui/button';

const FilterSidebar = ({
    search, setSearch,
    category, setCategory,
    brand, setBrand,
    priceRange, setPriceRange,
    allProducts = []
}) => {

    const Categories = allProducts.map(p => p.category);
    const UniqueCategory = ["All", ...new Set(Categories)];

    const Brands = allProducts.map(p => p.brand);
    const UniqueBrands = ["All", ...new Set(Brands)];

    // ✅ Category
    const handleCategoryClick = (val) => {
        setCategory(val);
    }

    // ✅ Brand
    const handleBrandChanges = (e) => {
        setBrand(e.target.value);
    }

    // ✅ Price Min
    const handleMinChange = (e) => {
        const value = Number(e.target.value);
        if (value <= priceRange[1]) {
            setPriceRange([value, priceRange[1]]);
        }
    }

    // ✅ Price Max
    const handleMaxChange = (e) => {
        const value = Number(e.target.value);
        if (value >= priceRange[0]) {
            setPriceRange([priceRange[0], value]);
        }
    }

    // ✅ Reset
    const resetFilters = () => {
        setSearch("");
        setCategory("All");
        setBrand("All");
        setPriceRange([0, 999999]);
    }

    return (
        <div className='bg-gray-100 mt-10 p-4 rounded-md h-max w-64'>

            {/* 🔍 Search */}
            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search.."
                className="bg-white p-2 rounded-md border-gray-400 border-2 w-full"
            />

            {/* 📂 Category */}
            <h1 className='mt-5 font-semibold text-xl'>Category</h1>
            <div className='flex flex-col gap-2 mt-3'>
                {
                    UniqueCategory.map((item, index) => (
                        <div key={index} className='flex items-center gap-2'>
                            <input
                                type="radio"
                                name="category"
                                checked={category === item}
                                onChange={() => handleCategoryClick(item)}
                            />
                            <Label>{item}</Label>
                        </div>
                    ))
                }
            </div>

            {/* 🏷 Brand */}
            <h1 className='mt-5 font-semibold text-xl'>Brand</h1>
            <NativeSelect
                value={brand}
                onChange={handleBrandChanges}
                className='bg-white w-full p-2 border-gray-200 rounded-md'
            >
                {
                    UniqueBrands.map((item, index) => (
                        <option key={index} value={item}>
                            {item.toUpperCase()}
                        </option>
                    ))
                }
            </NativeSelect>

            {/* 💰 Price Range */}
            <h1 className='mt-5 font-semibold text-xl mb-3'>Price range</h1>

            <label>
                Price Range: ₹{priceRange?.[0]} - ₹{priceRange?.[1]}
            </label>

            <div className='flex gap-2 items-center mt-2'>
                <input
                    type='number'
                    value={priceRange[0]}
                    onChange={handleMinChange}
                    className='w-22 p-1 border border-gray-400 rounded'
                />
                <span>-</span>
                <input
                    type='number'
                    value={priceRange[1]}
                    onChange={handleMaxChange}
                    className='w-22 p-1 border border-gray-400 rounded'
                />
            </div>

            {/* 🎚 Range Sliders */}
            <input
                type='range'
                min="0"
                max="5000"
                step="100"
                value={priceRange[0]}
                onChange={handleMinChange}
                className='w-full mt-2'
            />

            <input
                type='range'
                min="0"
                max="999999"
                step="100"
                value={priceRange[1]}
                onChange={handleMaxChange}
                className='w-full mt-2'
            />

            {/* 🔁 Reset Button */}
            <Button
                onClick={resetFilters}
                className="bg-pink-600 text-white mt-5 cursor-pointer w-full"
            >
                Reset Filters
            </Button>

        </div>
    )
}

export default FilterSidebar