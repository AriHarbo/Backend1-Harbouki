const mongoose = require("mongoose")
const productosModelo = require("./productos.model")

const carritoModelo = mongoose.model(
    "carritos",
    new mongoose.Schema(
        {
            productos: {
                type: [
                    {
                        id: {
                            type: mongoose.Schema.Types.ObjectId,  // Se utiliza ObjectId
                            ref: 'productos',
                            required: true
                        },
                        cantidad: {
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

module.exports = {carritoModelo} ;