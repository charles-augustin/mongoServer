const mongoose = require('mongoose');

require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const schema = mongoose.Schema;

const commentSchema = new schema ({
    rating:{
        type:Number,
        min:1,
        max: 5,
        required: true
    },
    comment: {
        type:String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},{
    timestamps: true
});

const dishSchema = new schema ( {
    name:{
        type: String,
        required: true,
        unique: true
    },

    desc:{
        type:String,
        required: true,
    },

    image: {
        type:String,
        required: true
    },

    category: {
        type:String,
        required: true
    },

    label: {
        type:String,
        default: ''
    },

    price: {
        type:Currency,
        required: true,
        min:0
    },

    featured: {
        type: Boolean,
        default: false
    },

    comments: [commentSchema]
},{
    timestamps: true
});

var dishes = mongoose.model('dish',dishSchema);

module.exports = dishes;