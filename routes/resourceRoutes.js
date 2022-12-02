const express = require("express");

const resourceController = require("./../controllers/resourceController.js");
const subresourceRouter = require("./subresourceRoutes.js");

const router = express.Router();

// Route for manipulating the subressource

router.use("/:resourceId/subresource", subresourceRouter);

// Routes for manipulating the current resource
router
  .route("/")
  .get(resourceController.getAllResources)
  .post(resourceController.createResource);

router
  .route("/:id")
  .get(resourceController.getOneResource)
  .patch(resourceController.updateResource)
  .delete(resourceController.deleteResource);

module.exports = router;
