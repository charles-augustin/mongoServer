const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// const dishSchema = new Schema({
//     _id : {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'dish'
//     }
// });

const favSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dishes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'dish'
        }
    ]
}, {
    timestamps: true
});

var Favorites = mongoose.model('Favorite', favSchema);

module.exports = Favorites;