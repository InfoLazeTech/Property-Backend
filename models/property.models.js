const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
    propertyNo: { type: String, unique: true },
    propertyname: { type: String, required: true },
    status: {
        type: String,
        enum: ['available', 'sold', 'pending'],
        default: 'available',
    },
    fileUploader:{
        type:[String],
        required:true
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
module.exports=mongoose.model("Property",propertySchema)