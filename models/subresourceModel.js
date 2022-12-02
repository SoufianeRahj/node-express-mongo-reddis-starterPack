const mongoose = require("mongoose");

const subresourceSchema = new mongoose.Schema(
  {
    prop1: {
      type: String,
      required: [true, "please enter a prop1"],
    },
    prop2: {
      type: String,
      required: [true, "please enter a prop2"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    resource: {
      type: mongoose.Schema.ObjectId,
      ref: "Resource",
      required: [true, "A subresource must belong to a resource"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// MIDDLEWARES
// populate reviews with tour and user data for all find queries
subresourceSchema.pre(/^find/, function (next) {
  //   this.populate({
  //     path: "user",
  //     select: "name photo",
  //   }).populate({
  //     path: "tour",
  //     select: "name3",
  //   });

  this.populate({
    path: "resource",
    select: "firstName lastName",
  });
  next();
});

const Subresource = mongoose.model("Subresource", subresourceSchema);

module.exports = Subresource;
