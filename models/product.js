const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            //maxlength: 32
        },
        description: {
            type: String,
            required: true,
            //maxlength: 2000
        },
        price: {
            type: Number,
            trim: true,
            required: true,
            maxlength: 32
        },
        category: [{
            type: ObjectId,
            ref: "Category",
            required: true
        }],
        quantity: {
            type: Number,
            default: 0
        },
        sold: {
            type: Number,
            default: 0
        },
        photo: {
            type: String,
            required: true
            // data: Buffer,
            // contentType: String
        },
        shipping: {
            required: false,
            type: Boolean
        },
        shippingZone: {
            type: String,
            required: false
        }
    },
    { timestamps: true }
);

productSchema.virtual("categoryId")
.set(function (categoryId) {
    this.addCategory(JSON.parse(categoryId));
})
.get(function () {
    return this.category;
});

productSchema.methods = {
    addCategory(categories) {
        for (let category of categories) {
            this.category.push({_id: category});
        }
    }
}

module.exports = mongoose.model("Product", productSchema);