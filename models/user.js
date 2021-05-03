const mongoose = require('mongoose')
const crypto = require('crypto')
const { v1: uuid } = require('uuid')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        trim: true,
        required: true,
        maxlenght: 32
    },
    title: {
      type: String,
      trim: true
    },
       email:{
        type: String,
        trim: true,
        required: true,
        unique: 32
    },
       hashed_password:{
        type:  String,
        required: true,
    },
      about:{
        type:  String,
        trim: true,
    },
      salt: String,
      role: {
          type: Number,
          default: 0
      },
      history: {
          type: Array,
          default : []
      },
      resetPasswordToken: {
        type: String,
        required: false
    },
      resetPasswordExpires: {
        type: Date,
        required: false
    },
     resetPasswordLink: {
      data: String,
      default: ''
    },
     avatar: {
       type: String,
       default: 'https://res.cloudinary.com/lenx/image/upload/v1619714832/avatar_g2cc3h.png'
     },
     date:{
        type: Date,
        default: Date.now
     },
     session: [
        {
          type: ObjectId,
          ref: "Session",
        }
      ],
      product: [
        {
          type: ObjectId,
          ref: "Product",
        }
      ],
      about: {
        type: String,
        trim: true
      }
    },
    {timestamps: true}
);

//Virtual Fields

userSchema.virtual('password')
.set(function(password) {
    this._password = password;
    this.salt = uuid();
    this.hashed_password = this.encryptPassword(password);
}) 

.get(function() {
    return this._password;
}
)

userSchema.virtual('sessionId')
.set(function (sessionId) {
    this.session.push({_id: sessionId});
})
.get(function () {
    return this.session;
})

userSchema.methods = {

    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },
    encryptPassword: function(password) {
        if(!password) return '';
        try {
            return crypto.createHmac('sha1', this.salt)
                                    .update(password)
                                    .digest('hex');
        }  catch (err){
            return ""
        }
    },
    generatePasswordReset: function() {
    this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
}
}


module.exports= mongoose.model("User", userSchema)