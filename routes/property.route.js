const express = require("express");
const router = express.Router();
const parser = require("../middlewares/multer");
const {
  createProperty,
  getProperties,
  updateProperty,
  deleteProperty,
} = require("../controllers/property.controllers");
const conditionalUpload = require("../middlewares/conditionalMulter");

router.post("/property", parser.array("files", 10), createProperty);
router.get("/property", getProperties);
router.put("/property/:id", conditionalUpload, updateProperty);
router.delete("/property/:id", deleteProperty);

module.exports = router;
