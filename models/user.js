var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema ({
    //not required for passport authentication
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    facebookId: {
        type: String
    },
    // password: {
    //     type: String,
    //     required: true,
    // },
    admin: {
        type:Boolean,
        default:false
    }
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',User);