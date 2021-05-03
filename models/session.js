const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
    {
        device: {
            type: String,
        },
        browser: {
            type: String
        },
        location: {
            type: {
              type: String, 
              enum: ['Point'], 
              required: true
            },
            coordinates: {
              type: [Number],
              required: true
            }
        },
        status: {
            type: Number,
            default: 1 // 0: session closed; 1: session opened
        }
    },
    {
        timestamps: true
    }
);


sessionSchema.virtual('coordinates')
.set(function (coordinates){
    this._coordinates = JSON.parse(coordinates);
    this.location = this.formatCoordinates(this._coordinates);
})
.get(function (){
    return this._coordinates;
});

sessionSchema.methods = {
    formatCoordinates: function (coordinates){
        return {
            type: "Point",
            coordinates: [coordinates.lng, coordinates.lat]
        }
    }
}


module.exports = mongoose.model("Session", sessionSchema);