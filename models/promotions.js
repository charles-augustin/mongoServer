const mongoose = require('mongoose');

require('mongoose-currency').loadType(mongoose);

const Currency = mongoose.Types.Currency;

const Schema = mongoose.Schema;

//promotion schema
const promotionSchema = new Schema ( {
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: true,
        default: ''
    },
    price: {
        type: Currency,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
   timestamps: true 
});

var promotions = mongoose.model('promotion',promotionSchema);
module.exports = promotions;