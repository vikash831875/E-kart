import React, { useState } from 'react'
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

const ProductImg = ({ images }) => {
  
  if (!images || images.length === 0) return null;

  const [mainImg, setMainImg] = useState(images[0].url);

  return (
    <div className='flex gap-5 w-max'>
      <div className='gap-5 flex flex-col'>
        {images.map((img, index) => {
          return (
            <img 
              key={index} // ✅ ADDED KEY PROP HERE
              onClick={() => setMainImg(img.url)} 
              src={img.url} 
              alt="thumbnail" 
              className='cursor-pointer w-20 h-20 shadow-lg' 
            />
          )
        })}
      </div>
      <Zoom>
 <img src={mainImg} alt="main product" className='w-[500px] border shadow-lg' />
      </Zoom>
     
    </div>
  )
}

export default ProductImg