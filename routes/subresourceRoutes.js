const express = require("express");

const subresourceController = require("./../controllers/subresourceController.js");

//this router is mounted on the main resource router
// In this template it is not mounted on the main app directly
// below line permits to take the path params from the main resource router
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(subresourceController.getAllSubresources)
  .post(
    subresourceController.setResourceId,
    subresourceController.createSubresource
  );

router
  .route("/:id")
  .delete(subresourceController.deleteSubresource)
  .patch(subresourceController.updateSubresource)
  .get(subresourceController.getOneSubresource);

module.exports = router;
