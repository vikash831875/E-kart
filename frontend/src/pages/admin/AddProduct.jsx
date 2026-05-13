import ImageUpload from '@/components/ImageUpload'
import { Button } from '@/components/ui/button'
import {
  Card, CardContent, CardDescription,
  CardFooter, CardHeader, CardTitle
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import axios from 'axios'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { setProducts } from '@/redux/productSlice'

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
    brand: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (productData.productImg.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    const formData = new FormData();
    formData.append("productName", productData.productName);
    formData.append("productPrice", Number(productData.productPrice));
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
            Authorization: `Bearer ${accessToken}`
          }
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
          brand: ""
        });
      }

    } catch (error) {
      console.log(error.response?.data);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='pl-[350px] py-10 pr-20 mx-auto px-4 bg-gray-100'>
      <Card className='w-full my-20 shadow-md'>

        <CardHeader>
          <CardTitle>Add Product</CardTitle>
          <CardDescription>Enter Product details below</CardDescription>
        </CardHeader>

        <form onSubmit={submitHandler}>
          <CardContent>
            <div className='flex flex-col gap-4'>

              <div className='grid gap-2'>
                <Label>Product Name</Label>
                <input
                  className='border p-2 rounded-md'
                  type='text'
                  name="productName"
                  value={productData.productName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='grid gap-2'>
                <Label>Price</Label>
                <input
                  className='border p-2 rounded-md'
                  type='number'
                  name="productPrice"
                  value={productData.productPrice}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='grid gap-2'>
                  <Label>Brand</Label>
                  <input
                    className='border p-2 rounded-md'
                    type='text'
                    name="brand"
                    value={productData.brand}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className='grid gap-2'>
                  <Label>Category</Label>
                  <input
                    className='border p-2 rounded-md'
                    type='text'
                    name="category"
                    value={productData.category}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className='grid gap-2'>
                <Label>Description</Label>
                <Textarea
                  name="productDesc"
                  value={productData.productDesc}
                  onChange={handleChange}
                />
              </div>

              <ImageUpload
                productData={productData}
                setProductData={setProductData}
              />

            </div>
          </CardContent>

          <CardFooter>
            <Button disabled={loading} type="submit" className="w-full">
              {loading ? "Adding..." : "Add Product"}
            </Button>
          </CardFooter>
        </form>

      </Card>
    </div>
  );
};

export default AddProduct;