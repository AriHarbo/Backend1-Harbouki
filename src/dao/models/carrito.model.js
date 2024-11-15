const mongoose = require("mongoose")

const carritoModelo = mongoose.model(
    "carritos",
    new mongoose.Schema(
        {
            productos: {
                type: [
                    {
                        id: String,
                        cantidad: Number
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