const mongoose = require("mongoose");
const slugify = require("slugify");
const geocoder = require("../utils/geocoder");
const JobSchema = new mongoose.Schema({
  company: {
    type: String,
    required: [true, "Please add a company name"],
    trim: true,
    maxlength: [50, "Name can not be more than 50 characters"],
  },
  slug: String, // url friendly version of the name

  jobTitle: {
    type: String,
    required: [true, "Please add a job title"],
    trim: true,
    maxlength: [50, "Name can not be more than 50 characters"],
  },
  jobDescription: {
    type: String,
    required: [true, "Please add a description"],
    maxlength: [500, "Description can not be more than 500 characters"],
  },
  videoDescription: {
    type: String,
    default: "no video uploaded",
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      "Please use a valid URL with HTTP or HTTPS",
    ],
  },
  address: {
    type: String,
    required: [true, "Please add an address"],
  },
  location: {
    // GeoJSON Point
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
      index: "2dsphere",
    },
    formattedAddress: String,
    street: String,
    city: String,
    postcode: String,
    country: String,
  },

  averageSalary: {
    type: Number,
  },

  travel: {
    type: Boolean,
    default: false,
  },
  remote: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

JobSchema.pre("save", function(next) {
  this.slug = slugify(this.company, { lower: true });
  next();
});

// Geocode and create location field

JobSchema.pre("save", async function(next) {
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: "Point",
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    postcode: loc[0].zipcode,
    country: loc[0].countryCode,
  };

  // Do not save address in db
  this.address = undefined;
  next();
});

module.exports = mongoose.model("Job", JobSchema);
