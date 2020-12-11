const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InvoiceSchema = new Schema(
    {
        id: {
            type: String,
            required: true,
            trim: true
        },
        vendor: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        client: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        products: [
            {
                id: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product'
                },
                quantity: {
                    type: Number
                }
            }
        ],
        tax: {
            type: Number
        },
        status: {
            type: String,
            default: 'draft'
        },
        billfor: {
            type: String
        }
    },
    {
        timestamps: {
            createdAt: 'created_at'
        }
    }
);

const Invoice = mongoose.model('Invoice', InvoiceSchema);

module.exports = { Invoice };
