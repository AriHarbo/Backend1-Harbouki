import mongoose from "mongoose"
import {productosModelo} from "./productos.model.js"

export const carritoModelo = mongoose.model(
    "carritos",
    new mongoose.Schema(
        {
            products: {
                type: [
                    {
                        id: {
                            type: mongoose.Schema.Types.ObjectId,  // Se utiliza ObjectId
                            ref: 'productos',
                            required: true
                        },
                        quantity: {
                            type: Number,
                            required: true
                        }
                    }
                ]
            }
        },
        {
            timestamps: true
        }
    )
)
