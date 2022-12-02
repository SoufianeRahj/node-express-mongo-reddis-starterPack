const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");

const resourceSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "A resource must have a first name"],
      maxlength: [40, "An email must have less or equal than 40 characters"],
      minlength: [2, "An email must have more or equal than 2 characters"],
      validate: [validator.isEmail, "Please enter a valid email"],
    },
    firstName: {
      type: String,
      required: [true, "A resource must have a first name"],
      maxlength: [
        20,
        "A first name must have less or equal than 20 characters",
      ],
      minlength: [2, "A first name must have more or equal than 2 characters"],
      validate: [
        validator.isAlpha,
        "first name must only contains alpha characters",
      ],
    },
    lastName: {
      type: String,
      required: [true, "A resource must have a last name"],
      maxlength: [
        20,
        "A first name must have less or equal than 20 characters",
      ],
      minlength: [2, "A first name must have more or equal than 2 characters"],
      validate: [
        validator.isAlpha,
        "first name must only contains alpha characters",
      ],
    },
    age: {
      type: Number,
      min: [0, "the age must be at least 1"],
      max: [200, "the age can't exceed 200"],
    },
    gender: {
      type: String,
      required: [true, "A resource must have a gender"],
      enum: {
        values: ["male", "female"],
        message: "gender is either male or female",
      },
    },
    married: {
      type: Boolean,
      validate: {
        validator: function (val) {
          if (this.age < 18 && val) {
            return false;
          }
          return true;
        },
        message: "The person cannot be married under 18",
      },
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    slug: {
      type: String,
      select: false,
    },
  },
  {
    // to add virtual properties in js objects and json outputs
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//INDEX
resourceSchema.index({ email: 1 });

// Virtual properties
resourceSchema.virtual("major").get(function () {
  return this.age >= 18;
});

// Virtual populate
resourceSchema.virtual("subresources", {
  ref: "Subresource",
  foreignField: "resource",
  localField: "_id",
});

// MIDDLEWARES

// DOCUMENT MIDDLEWARES
resourceSchema.pre("save", function (next) {
  this.slug = slugify(this.lastName + this.firstName);
  next();
});

// MODEL CREATION
const Resource = mongoose.model("Resource", resourceSchema);

module.exports = Resource;
