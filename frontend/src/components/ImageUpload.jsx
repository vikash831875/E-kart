import { Label } from '@/components/ui/label'
import React, { useRef } from 'react'
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

const ImageUpload = ({ productData, setProductData }) => {

  const fileRef = useRef(null);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setProductData((prev) => ({
      ...prev,
      productImg: [...prev.productImg, ...files] // ✅ append
    }));
  };

  // ✅ remove image
  const handleRemove = (index) => {
    const updatedImages = productData.productImg.filter((_, i) => i !== index);

    setProductData((prev) => ({
      ...prev,
      productImg: updatedImages
    }));
  };

  return (
    <div className='grid gap-2'>
      <Label>Product Images</Label>

      <input
        ref={fileRef}
        type='file'
        className='hidden'
        accept='image/*'
        multiple
        onChange={handleImageChange}
      />

      <Button
        type="button"
        variant="outline"
        className="cursor-pointer w-full"
        onClick={() => fileRef.current.click()}
      >
        Upload Images
      </Button>

      {/* Preview + Remove */}
      {productData.productImg.length > 0 && (
        <div className='grid grid-cols-3 gap-4 mt-3'>
          {productData.productImg.map((file, idx) => {

            let preview;
            if (file instanceof File) {
              preview = URL.createObjectURL(file);
            } else if (typeof file === 'string') {
              preview = file;
            } else if (file?.url) {
              preview = file.url;
            } else {
              return null;
            }

            return (
              <Card key={idx} className="relative overflow-hidden group">
                <CardContent className="p-2">
                  <img
                    src={preview}
                    alt="preview"
                    className='w-full h-32 object-cover rounded-md'
                  />

                  {/* ❌ Remove Button */}
                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                  >
                    X
                  </button>

                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default ImageUpload;