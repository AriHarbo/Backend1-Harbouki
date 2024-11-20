import mongoose from "mongoose"
import paginate from "mongoose-paginate-v2"

const productosSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        code: {
            type: String,
            unique: true
        },
        price: Number,
        status: {
            type: Boolean,
            default: true
        },
        stock: {
            type: Number,
            default: 0
        },
        category: String,
        thumbnails: {
            type: [String],
            default: []     
        }
    },
    {
        timestamps: true
    }
)

productosSchema.plugin(paginate)

 export const productosModelo =mongoose.model(
    "productos",
    productosSchema
)

