import dotenv from "dotenv";
import connectDB from "./database/db.js";
import { Product } from "./models/productModel.js";

dotenv.config();

// Remove duplicate products by name and broken image URLs
const cleanupProducts = async () => {
  try {
    await connectDB();

    console.log("🧹 Starting product cleanup...\n");

    // 1. Remove products with broken image URLs
    console.log("📸 Checking for broken image URLs...");
    const allProducts = await Product.find({});
    let brokenCount = 0;

    for (const product of allProducts) {
      if (!product.productImg || product.productImg.length === 0 || !product.productImg[0]?.url) {
        await Product.deleteOne({ _id: product._id });
        brokenCount++;
        console.log(`  ❌ Deleted: ${product.productName} (missing image)`);
      }
    }

    // 2. Remove duplicate products by name (keep the first one)
    console.log("\n🔍 Checking for duplicate product names...");
    const products = await Product.find({}).sort({ createdAt: 1 });
    const seenNames = new Set();
    let duplicateCount = 0;

    for (const product of products) {
      if (seenNames.has(product.productName)) {
        await Product.deleteOne({ _id: product._id });
        duplicateCount++;
        console.log(`  🗑️ Deleted duplicate: ${product.productName}`);
      } else {
        seenNames.add(product.productName);
      }
    }

    // 3. Ensure every product has unique images (remove identical image URLs)
    console.log("\n🎨 Normalizing product images...");
    const updatedProducts = await Product.find({});
    let normalizedCount = 0;

    for (const product of updatedProducts) {
      if (product.productImg && product.productImg.length > 0) {
        const uniqueImages = [];
        const seenUrls = new Set();

        for (const img of product.productImg) {
          if (!seenUrls.has(img.url)) {
            uniqueImages.push(img);
            seenUrls.add(img.url);
          }
        }

        if (uniqueImages.length !== product.productImg.length) {
          product.productImg = uniqueImages;
          await product.save();
          normalizedCount++;
        }
      }
    }

    const finalCount = await Product.countDocuments();

    console.log("\n✨ Cleanup Summary:");
    console.log(`   - Removed broken images: ${brokenCount}`);
    console.log(`   - Removed duplicates: ${duplicateCount}`);
    console.log(`   - Normalized images: ${normalizedCount}`);
    console.log(`   - Total products remaining: ${finalCount}\n`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Cleanup failed:", error.message);
    process.exit(1);
  }
};

await cleanupProducts();
