const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    username:{
        type: String,
        required : true,
    },
    email:{
        type: String,
        required : true,
        unique:true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password:{
        type: String,
        required : true,
    },
    token:{
        type : String
    },
});

module.exports = mongoose.model('Register', userSchema);