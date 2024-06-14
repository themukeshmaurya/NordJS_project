import mongoose from 'mongoose';
const bcrypt = require("bcryptjs");

const userSchemas = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        required: true,
        unique: true,
    },
    password:{
        type:String,
        required: true,
        default:'pass@123',
    },
    jobTitle: {
        type: String,
    },
    gender: {
        type: String,
    },
    userImage: [{
        fileName: { type: String },
        path: { type: String }
    }],
    dateOfBirth:{
        type:Date,
    },
},
    { timestamps: true }    
);

// generating a hash
userSchemas.methods.generateHash = function (password:string) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(), null);
  };
  
  // checking if password is valid
  userSchemas.methods.validPassword = function (password:string) {
    return bcrypt.compareSync(password, this.password);
  };

const User = mongoose.model("User", userSchemas);

module.exports = User;