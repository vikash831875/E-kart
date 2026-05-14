import ImageUpload from "@/components/ImageUpload";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { setProducts } from "@/redux/productSlice";

const AddProduct = () => {
  const { products } = useSelector((state) => state.product);

  const accessToken = localStorage.getItem("accessToken");

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const [productData, setProductData] = useState({
    productName: "",
    productPrice: 0,
    productDesc: "",
    productImg: [],
    category: "",
    brand: "",
  });

  // ✅ Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Submit Handler
  const submitHandler = async (e) => {
    e.preventDefault();

    if (productData.productImg.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    const formData = new FormData();

    formData.append("productName", productData.productName);
    formData.append(
      "productPrice",
      Number(productData.productPrice)
    );
    formData.append("productDesc", productData.productDesc);
    formData.append("category", productData.category);
    formData.append("brand", productData.brand);

    productData.productImg.forEach((img) => {
      formData.append("files", img);
    });

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:8000/api/v1/product/add",
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.data.success) {
        dispatch(setProducts([...products, res.data.product]));

        toast.success(res.data.message);

        setProductData({
          productName: "",
          productPrice: 0,
          productDesc: "",
          productImg: [],
          category: "",
          brand: "",
        });
      }
    } catch (error) {
      console.log(error.response?.data);

      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        min-h-screen
        bg-gray-100
        px-4
        sm:px-6
        lg:px-8
        py-24
        md:ml-[260px]
      "
    >
      <div className="max-w-5xl mx-auto">
        
        {/* Card */}
        <Card className="w-full shadow-lg border-0 rounded-3xl">
          
          {/* Header */}
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl sm:text-3xl font-bold">
              Add Product
            </CardTitle>

            <CardDescription className="text-sm sm:text-base text-gray-600">
              Enter product details below
            </CardDescription>
          </CardHeader>

          {/* Form */}
          <form onSubmit={submitHandler}>
            <CardContent>
              
              <div className="flex flex-col gap-6">

                {/* Product Name */}
                <div className="grid gap-2">
                  <Label className="text-sm font-medium">
                    Product Name
                  </Label>

                  <input
                    className="
                      border
                      border-gray-300
                      p-3
                      rounded-xl
                      outline-none
                      focus:ring-2
                      focus:ring-pink-500
                      text-sm
                      sm:text-base
                    "
                    type="text"
                    name="productName"
                    value={productData.productName}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    required
                  />
                </div>

                {/* Price */}
                <div className="grid gap-2">
                  <Label className="text-sm font-medium">
                    Price
                  </Label>

                  <input
                    className="
                      border
                      border-gray-300
                      p-3
                      rounded-xl
                      outline-none
                      focus:ring-2
                      focus:ring-pink-500
                      text-sm
                      sm:text-base
                    "
                    type="number"
                    name="productPrice"
                    value={productData.productPrice}
                    onChange={handleChange}
                    placeholder="Enter price"
                    required
                  />
                </div>

                {/* Brand & Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  {/* Brand */}
                  <div className="grid gap-2">
                    <Label className="text-sm font-medium">
                      Brand
                    </Label>

                    <input
                      className="
                        border
                        border-gray-300
                        p-3
                        rounded-xl
                        outline-none
                        focus:ring-2
                        focus:ring-pink-500
                        text-sm
                        sm:text-base
                      "
                      type="text"
                      name="brand"
                      value={productData.brand}
                      onChange={handleChange}
                      placeholder="Enter brand"
                      required
                    />
                  </div>

                  {/* Category */}
                  <div className="grid gap-2">
                    <Label className="text-sm font-medium">
                      Category
                    </Label>

                    <input
                      className="
                        border
                        border-gray-300
                        p-3
                        rounded-xl
                        outline-none
                        focus:ring-2
                        focus:ring-pink-500
                        text-sm
                        sm:text-base
                      "
                      type="text"
                      name="category"
                      value={productData.category}
                      onChange={handleChange}
                      placeholder="Enter category"
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="grid gap-2">
                  <Label className="text-sm font-medium">
                    Description
                  </Label>

                  <Textarea
                    name="productDesc"
                    value={productData.productDesc}
                    onChange={handleChange}
                    placeholder="Enter product description"
                    className="min-h-[140px] rounded-xl text-sm sm:text-base"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Product Images
                  </Label>

                  <ImageUpload
                    productData={productData}
                    setProductData={setProductData}
                  />
                </div>
              </div>
            </CardContent>

            {/* Footer */}
            <CardFooter className="pt-2">
              <Button
                disabled={loading}
                type="submit"
                className="
                  w-full
                  h-[50px]
                  rounded-xl
                  text-sm
                  sm:text-base
                  font-semibold
                  bg-pink-600
                  hover:bg-pink-700
                  transition
                "
              >
                {loading ? "Adding Product..." : "Add Product"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AddProduct;