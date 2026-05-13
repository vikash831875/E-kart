import { Search, Pencil, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setProducts } from "@/redux/productSlice";
import { toast } from "sonner";

const AdminProduct = () => {
  const { products } = useSelector((store) => store.product);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({});
  const [newImages, setNewImages] = useState([]);
  const [keepImages, setKeepImages] = useState([]);

  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("");

  const accessToken = localStorage.getItem("accessToken");

  // ✅ FETCH PRODUCTS
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/v1/product/getallproducts"
      );

      if (res.data.success) {
        dispatch(setProducts(res.data.products));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ OPEN EDIT
  const openEdit = (product) => {
    setSelectedProduct(product);
    setFormData(product);
    setNewImages([]);
    setKeepImages(product.productImg || []);
    setOpen(true);
  };

  // ✅ INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ NEW IMAGE
  const handleImageChange = (e) => {
    setNewImages(Array.from(e.target.files));
  };

  // ✅ REMOVE IMAGE
  const removeImage = (public_id) => {
    setKeepImages((prev) =>
      prev.filter((img) => img.public_id !== public_id)
    );
  };

  // ✅ UPDATE PRODUCT
  const updateProduct = async () => {
    try {
      const data = new FormData();

      data.append("productName", formData.productName);
      data.append("productDesc", formData.productDesc);
      data.append("productPrice", formData.productPrice);
      data.append("category", formData.category);
      data.append("brand", formData.brand);

      const existingIds = keepImages.map((img) => img.public_id);
      data.append("existingImages", JSON.stringify(existingIds));

      newImages.forEach((file) => {
        data.append("files", file);
      });

      const res = await axios.put(
        `http://localhost:8000/api/v1/product/update/${selectedProduct._id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        toast.success("Product updated");
        setOpen(false);
        fetchProducts();
      }
    } catch (error) {
      console.log(error);
      toast.error("Update failed");
    }
  };

  // ✅ DELETE PRODUCT
  const deleteProduct = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/product/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Deleted");
        fetchProducts();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ FILTER + SORT
  const filteredProducts = products
    ?.filter((product) =>
      product.productName.toLowerCase().includes(search.toLowerCase())
    )
    ?.sort((a, b) => {
      if (sortOption === "lowToHigh") {
        return Number(a.productPrice) - Number(b.productPrice);
      }
      if (sortOption === "highToLow") {
        return Number(b.productPrice) - Number(a.productPrice);
      }
      return 0;
    });

  return (
    <div className="pl-[350px] py-20 pr-20 flex flex-col gap-5 min-h-screen bg-gray-100">

      {/* 🔍 TOP */}
      <div className="flex justify-between items-center">

        {/* SEARCH */}
        <div className="relative bg-white rounded-lg">
          <input
            type="text"
            placeholder="Search Product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[400px] border rounded-lg py-2 pl-3 pr-10 outline-none"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
        </div>

        {/* SORT */}
        <Select onValueChange={(value) => setSortOption(value)}>
          <SelectTrigger className="w-[200px] bg-white">
            <SelectValue placeholder="Sort by Price" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="lowToHigh">Low → High</SelectItem>
              <SelectItem value="highToLow">High → Low</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* 📦 PRODUCTS */}
      <div className="flex flex-col gap-4">
        {filteredProducts?.length === 0 ? (
          <p className="text-center text-gray-500">No products found</p>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product._id}
              className="flex items-center justify-between px-4 py-3 bg-white rounded-lg shadow"
            >

              {/* LEFT */}
              <div className="flex gap-4 items-center w-[60%]">
                <img
                  src={product?.productImg?.[0]?.url || "/no-image.png"}
                  className="w-20 h-20 object-cover rounded-md border"
                />
                <div>
                  <h2 className="font-bold">{product.productName}</h2>
                  <p className="text-sm text-gray-500">
                    {product.brand} | {product.category}
                  </p>
                </div>
              </div>

              {/* PRICE */}
              <div className="w-[20%] text-center font-semibold text-pink-600">
                ₹ {product.productPrice}
              </div>

              {/* ACTIONS */}
              <div className="flex gap-3 w-[20%] justify-end">

                <Pencil
                  onClick={() => openEdit(product)}
                  className="cursor-pointer text-green-600"
                />

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Trash2 className="cursor-pointer text-red-600" />
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Delete <b>{product.productName}</b>?
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteProduct(product._id)}
                        className="bg-red-600 text-white"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

              </div>

            </div>
          ))
        )}
      </div>

      {/* 🔥 EDIT DIALOG */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">

            <div>
              <Label>Product Name</Label>
              <Input name="productName" value={formData.productName || ""} onChange={handleChange}/>
            </div>

            <div>
              <Label>Price</Label>
              <Input type="number" name="productPrice" value={formData.productPrice || ""} onChange={handleChange}/>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Brand</Label>
                <Input name="brand" value={formData.brand || ""} onChange={handleChange}/>
              </div>

              <div>
                <Label>Category</Label>
                <Input name="category" value={formData.category || ""} onChange={handleChange}/>
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea name="productDesc" value={formData.productDesc || ""} onChange={handleChange}/>
            </div>

            {/* IMAGES */}
            <div>
              <Label>Images</Label>
              <div className="flex gap-2 flex-wrap">
                {keepImages.map((img) => (
                  <div key={img.public_id} className="relative">
                    <img src={img.url} className="w-20 h-20 rounded border"/>
                    <button
                      onClick={() => removeImage(img.public_id)}
                      className="absolute top-0 right-0 bg-white text-red-600 px-1 rounded-full"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Upload New Images</Label>
              <Input type="file" multiple onChange={handleImageChange}/>
            </div>

            <Button onClick={updateProduct} className="w-full bg-pink-600">
              Update Product
            </Button>

          </div>

        </DialogContent>
      </Dialog>

    </div>
  );
};

export default AdminProduct;