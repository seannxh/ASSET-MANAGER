const mongoose = require('mongoose');

const AssetSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['stock', 'house', 'car', 'savings'],
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    imageURL: {
        type: String,
        requred: true
    },
    username: {
        type: String,
        required: true
    },

    stockSymbol: {
        type: String,
        required: function() { return this.type === 'stock'; }
    },
    sharesOwned: {
        type: Number,
        required: function() { return this.type === 'stock'; }
    },

    address: {
        type: String,
        required: function() { return this.type === 'house'; }
    },
    bedrooms: {
        type: Number,
        required: function() { return this.type === 'house'; }
    },
    bathrooms: {
        type: Number,
        required: function() { return this.type === 'house'; }
    },
    squareFeet: {
        type: Number,
        required: function() { return this.type === 'house'; }
    },
    forSale: {
        type: Boolean,
        default: false
    },

    carName: {
        type: String,
        required: function() { return this.type === 'car'; }
    },
    carBrand: {
        type: String,
        required: function() { return this.type === 'car'; }
    },
    carYear: {
        type: Number,
        required: function() { return this.type === 'car'; }
    },
    carTrim: {
        type: String,
        required: function() { return this.type === 'car'; }
    },
    carMileage: {
        type: Number,
        required: function() { return this.type === 'car'; }
    },

    accountNumber: {
        type: String,
        required: function() { return this.type === 'savings'; }
    },
    interestRate: {
        type: String,
        required: function() { return this.type === 'savings'; }
    }
});

const Asset = mongoose.model('Asset', AssetSchema);

module.exports = Asset;
