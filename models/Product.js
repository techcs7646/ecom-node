const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id:  { type: String, required: true },
    title: { type: String },
    price: { type: Number, required: true },
    description: { type: String },
    image: { type: String },
    category: { type: String } 
});
module.exports = mongoose.model('Product', productSchema);