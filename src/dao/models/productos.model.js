const mongoose = require("mongoose")
const paginate = require("mongoose-paginate-v2")

const productosSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            unique: true
        },
        description: String,
        code: String,
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

 const productosModelo =mongoose.model(
    "productos",
    productosSchema
)

module.exports = { productosModelo };