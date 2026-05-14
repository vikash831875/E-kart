// Utility to validate image URLs
export const validateImageUrl = async (url) => {
  try {
    if (!url || typeof url !== "string") {
      return { valid: false, error: "Invalid URL format" };
    }

    // Check if URL is a valid HTTP(S) URL
    const urlObj = new URL(url);
    if (!["http:", "https:"].includes(urlObj.protocol)) {
      return { valid: false, error: "URL must use HTTP or HTTPS protocol" };
    }

    // For now, we'll return true for known image CDNs
    // In production, you might want to make HEAD requests to verify image availability
    const validDomains = [
      "unsplash.com",
      "pexels.com",
      "images.unsplash.com",
      "images.pexels.com",
      "cdn.shopify.com",
      "images-na.ssl-images-amazon.com",
      "m.media-amazon.com",
      "res.cloudinary.com",
      "d1csarkz8rvq51.cloudfront.net",
    ];

    const domain = urlObj.hostname;
    const isDomainValid = validDomains.some((validDomain) => domain.includes(validDomain));

    if (!isDomainValid) {
      console.warn(`⚠️ Warning: Using image from unknown domain: ${domain}`);
    }

    return { valid: true, error: null };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

// Validate all images in a product array
export const validateProductImages = async (products) => {
  const validationResults = [];

  for (const product of products) {
    const issues = [];

    // Check primary image
    if (!product.images || product.images.length === 0) {
      issues.push("Missing images array");
    } else {
      for (let i = 0; i < product.images.length; i++) {
        const validation = await validateImageUrl(product.images[i]);
        if (!validation.valid) {
          issues.push(`Image ${i + 1}: ${validation.error}`);
        }
      }
    }

    // Check thumbnail
    const thumbValidation = await validateImageUrl(product.thumbnail);
    if (!thumbValidation.valid) {
      issues.push(`Thumbnail: ${thumbValidation.error}`);
    }

    validationResults.push({
      productName: product.productName,
      valid: issues.length === 0,
      issues,
    });
  }

  return validationResults;
};

// Check for duplicate images across products
export const checkDuplicateImages = (products) => {
  const imageMap = new Map();
  const duplicates = [];

  for (const product of products) {
    if (product.images) {
      for (const imageUrl of product.images) {
        if (imageMap.has(imageUrl)) {
          duplicates.push({
            imageUrl,
            products: [imageMap.get(imageUrl), product.productName],
          });
        } else {
          imageMap.set(imageUrl, product.productName);
        }
      }
    }
  }

  return duplicates;
};
