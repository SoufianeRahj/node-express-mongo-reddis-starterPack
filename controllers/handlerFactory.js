const catchAsync = require("./../utils/CatchAsync.js");
const AppError = require("./../utils/AppError.js");
const APIFeatures = require("./../utils/APIFeatures.js");

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // to allow for nested get reviews on tour
    let filter = {};
    if (req.params.resourceId) filter = { resource: req.params.resourceId };

    // BUILDING THE QUERY
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // EXECUTING THE QUERY
    const doc = await features.query; // chain with .explain() to analyze/optimise read queries

    res.status(200).json({
      status: "success",
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    // req.params contains path param which is different from query strings
    const id = req.params.id;

    let query = Model.findById(id);
    if (populateOptions) query = query.populate(populateOptions);
    const doc = await query;

    // case where the doc is null
    // happens where the given id is wrong for instance
    if (!doc) {
      return next(new AppError("No document found with that Id", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    // jsend format
    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    //patch not a put
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true, // this permits to run validators
    });

    if (!doc) {
      return next(new AppError("No document found with that Id", 404));
    }

    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndRemove(req.params.id);

    if (!doc) {
      return next(new AppError("No document found with that Id", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });
