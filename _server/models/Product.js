const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
    {
        id: {
            type: String,
            required: true,
            trim: true
        },
        price: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: {
            createdAt: 'created_at'
        }
    }
);

const Product = mongoose.model('Product', ProductSchema);

module.exports = { Product };
