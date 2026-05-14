import { Product } from "../models/productModel.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";


// ================= ADD PRODUCT =================
export const addProduct = async (req, res) => {
  try {
    const { productName, productDesc, productPrice, category, brand } = req.body;

    const userId = req.user?._id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User not authenticated"
      });
    }

    if (!productName || !productDesc || !productPrice || !category || !brand) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    let productImg = [];

    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const fileUri = getDataUri(file);

        const result = await cloudinary.uploader.upload(fileUri, {
          folder: "mern_products"
        });

        productImg.push({
          url: result.secure_url,
          public_id: result.public_id
        });
      }
    }

    const newProduct = await Product.create({
      userId,
      productName,
      productDesc,
      productPrice,
      category,
      brand,
      productImg
    });

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: newProduct
    });

  } catch (error) {
    console.log("ADD ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ================= GET ALL =================
const seedProducts = async () => {
  const existing = await Product.countDocuments();
  if (existing > 0) return;

  const sampleProducts = [
    {
      productName: "Galaxy S24 Ultra",
      productDesc: "Premium Android smartphone with a powerful camera and long-lasting battery.",
      productPrice: 89999,
      category: "mobile",
      brand: "Samsung",
      productImg: [
        {
          url: "https://via.placeholder.com/400x400?text=Galaxy+S24+Ultra",
          public_id: "seed_galaxy_s24_ultra",
        },
      ],
    },
    {
      productName: "MacBook Pro 14",
      productDesc: "High-performance laptop for creative work and modern productivity.",
      productPrice: 199999,
      category: "laptop",
      brand: "Apple",
      productImg: [
        {
          url: "https://via.placeholder.com/400x400?text=MacBook+Pro+14",
          public_id: "seed_macbook_pro_14",
        },
      ],
    },
    {
      productName: "Sony WH-1000XM5",
      productDesc: "Noise cancelling wireless headphones with exceptional sound quality.",
      productPrice: 24999,
      category: "headphone",
      brand: "Sony",
      productImg: [
        {
          url: "https://via.placeholder.com/400x400?text=Sony+WH-1000XM5",
          public_id: "seed_sony_wh1000xm5",
        },
      ],
    },
    {
      productName: "AirPods Pro 2",
      productDesc: "Wireless earbuds with active noise cancellation and spatial audio.",
      productPrice: 24999,
      category: "earphone",
      brand: "Apple",
      productImg: [
        {
          url: "https://via.placeholder.com/400x400?text=AirPods+Pro+2",
          public_id: "seed_airpods_pro_2",
        },
      ],
    },
    {
      productName: "Dell XPS 13",
      productDesc: "Compact laptop for professionals with a stunning InfinityEdge display.",
      productPrice: 139999,
      category: "laptop",
      brand: "Dell",
      productImg: [
        {
          url: "https://via.placeholder.com/400x400?text=Dell+XPS+13",
          public_id: "seed_dell_xps_13",
        },
      ],
    },
    {
      productName: "OnePlus Nord 4",
      productDesc: "Affordable smartphone with strong performance and fast charging.",
      productPrice: 27999,
      category: "mobile",
      brand: "OnePlus",
      productImg: [
        {
          url: "https://via.placeholder.com/400x400?text=OnePlus+Nord+4",
          public_id: "seed_oneplus_nord_4",
        },
      ],
    },
    {
      productName: "JBL Charge 5",
      productDesc: "Portable Bluetooth speaker with powerful sound and long battery life.",
      productPrice: 12999,
      category: "speaker",
      brand: "JBL",
      productImg: [
        {
          url: "https://via.placeholder.com/400x400?text=JBL+Charge+5",
          public_id: "seed_jbl_charge_5",
        },
      ],
    },
    {
      productName: "Apple Watch Series 9",
      productDesc: "Smartwatch with advanced health tracking and seamless iPhone integration.",
      productPrice: 34999,
      category: "watch",
      brand: "Apple",
      productImg: [
        {
          url: "https://via.placeholder.com/400x400?text=Apple+Watch+Series+9",
          public_id: "seed_apple_watch_9",
        },
      ],
    },
    {
      productName: "Sony Alpha a7 IV",
      productDesc: "Full-frame mirrorless camera for professional photo and video creators.",
      productPrice: 219999,
      category: "camera",
      brand: "Sony",
      productImg: [
        {
          url: "https://via.placeholder.com/400x400?text=Sony+Alpha+a7+IV",
          public_id: "seed_sony_a7_iv",
        },
      ],
    },
    {
      productName: "Samsung Galaxy Tab S9",
      productDesc: "Premium tablet with vivid display and powerful productivity features.",
      productPrice: 79999,
      category: "tablet",
      brand: "Samsung",
      productImg: [
        {
          url: "https://via.placeholder.com/400x400?text=Galaxy+Tab+S9",
          public_id: "seed_galaxy_tab_s9",
        },
      ],
    },
  ];

  await Product.insertMany(sampleProducts);
};

export const getAllProduct = async (req, res) => {
  try {
    const { search, category, brand, minPrice, maxPrice } = req.query;

    await seedProducts();

    const filter = {};

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [
        { productName: regex },
        { productDesc: regex },
        { category: regex },
        { brand: regex },
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (brand) {
      filter.brand = brand;
    }

    if (minPrice || maxPrice) {
      filter.productPrice = {};
      if (minPrice) filter.productPrice.$gte = Number(minPrice);
      if (maxPrice) filter.productPrice.$lte = Number(maxPrice);
    }

    const products = await Product.find(filter);

    return res.status(200).json({
      success: true,
      products,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product id is required",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ================= DELETE PRODUCT (🔥 FIXED) =================
export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    console.log("DELETE ID:", productId);

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID missing"
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // ✅ SAFE CLOUDINARY DELETE
    if (product.productImg?.length > 0) {
      for (let img of product.productImg) {
        if (img?.public_id) {
          try {
            await cloudinary.uploader.destroy(img.public_id);
          } catch (err) {
            console.log("Cloudinary error:", err.message);
          }
        }
      }
    }

    await Product.findByIdAndDelete(productId);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (error) {
    console.log("DELETE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ================= UPDATE PRODUCT =================
export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const {
      productName,
      productDesc,
      productPrice,
      category,
      brand,
      existingImages
    } = req.body || {};

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    let updatedImages = [];

    // ✅ KEEP OLD IMAGES
    if (existingImages) {
      const keepIds = JSON.parse(existingImages);

      updatedImages = product.productImg.filter((img) =>
        keepIds.includes(img.public_id)
      );

      const removedImages = product.productImg.filter(
        (img) => !keepIds.includes(img.public_id)
      );

      for (let img of removedImages) {
        if (img.public_id) {
          try {
            await cloudinary.uploader.destroy(img.public_id);
          } catch (err) {
            console.log("Cloudinary remove error:", err.message);
          }
        }
      }
    } else {
      updatedImages = product.productImg;
    }

    // ✅ ADD NEW IMAGES
    if (req.files?.length > 0) {
      for (let file of req.files) {
        const fileUri = getDataUri(file);

        const result = await cloudinary.uploader.upload(fileUri, {
          folder: "mern_products"
        });

        updatedImages.push({
          url: result.secure_url,
          public_id: result.public_id
        });
      }
    }

    // ✅ UPDATE FIELDS
    product.productName = productName || product.productName;
    product.productDesc = productDesc || product.productDesc;
    product.productPrice = productPrice || product.productPrice;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.productImg = updatedImages;

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product
    });

  } catch (error) {
    console.log("UPDATE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};