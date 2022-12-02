const factory = require("./handlerFactory.js");
const Resource = require("./../models/resourceModel.js");

exports.getAllResources = factory.getAll(Resource);
exports.getOneResource = factory.getOne(Resource, { path: "subresources" });
exports.createResource = factory.createOne(Resource);
exports.updateResource = factory.updateOne(Resource);
exports.deleteResource = factory.deleteOne(Resource);
