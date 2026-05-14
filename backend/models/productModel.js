import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    productName:{type:String, required:true},
    shortDescription:{type:String},
    fullDescription:{type:String},
    productDesc:{type:String, required:true},
    productPrice:{type:Number},
    price:{type:Number},
    originalPrice:{type:Number},
    discountPercentage:{type:Number},
    stock:{type:Number, default:0},
    thumbnail:{type:String},
    images:[String],
    productImg:[
        {
            url:{type:String, required:true},
            public_id:{type:String, required:true}

        }
    ],
    rating:{type:Number, default:4.5},
    numReviews:{type:Number, default:0},
    specifications:[
      {
        label:{type:String},
        value:{type:String}
      }
    ],
    featured:{type:Boolean, default:false},
    category:{type:String},
    brand:{type:String}

},
{timestamps:true}

)

export const Product = mongoose.model("Product", productSchema)