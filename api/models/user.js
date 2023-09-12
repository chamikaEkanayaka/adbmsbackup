const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _Id: mongoose.Schema.Types.ObjectId,
    email: String,
    passWd: String,
    firstName: String,
    lastName: String,
    address: String,
    phoneNo: String,
    userRole: String    
})

module.exports = mongoose.model('User', userSchema);