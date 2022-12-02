const factory = require("./handlerFactory.js");
const Subresource = require("./../models/subresourceModel.js");

exports.getAllSubresources = factory.getAll(Subresource);
exports.getOneSubresource = factory.getOne(Subresource);

exports.setResourceId = (req, res, next) => {
  if (!req.body.resource) req.body.resource = req.params.resourceId;
  next();
};

exports.createSubresource = factory.createOne(Subresource);
exports.updateSubresource = factory.updateOne(Subresource);
exports.deleteSubresource = factory.deleteOne(Subresource);
