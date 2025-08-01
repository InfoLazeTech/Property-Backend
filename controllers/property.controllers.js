const Property = require("../models/property.models");
const cloudinary = require("../utils/cloudinary.js");

const createProperty = async (req, res) => {
  try {
    const { propertyNo, propertyname, status } = req.body;

    if (!propertyNo || !propertyname || !req.files || req.files.length === 0) {
      return res.status(400).json({ error: "All fields and at least one document are required." });
    }

    const fileUrls = req.files.map((file) => file.path); // Cloudinary file URL

    const newProperty = new Property({
      propertyNo,
      propertyname,
      status, // Optional - Mongoose will apply default if not provided
      fileUploader: fileUrls,
    });

    await newProperty.save();

    res.status(201).json({ message: "Property created", property: newProperty });
  } catch (error) {
    console.error("Error creating property:", error);
    res.status(500).json({ error: error.message });
  }
};


const getProperties = async (req, res) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 });
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch properties" });
  }
};

const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ error: "Property not found" });
    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const { propertyname, status } = req.body;
    const files = req.files; // Either [] or uploaded files

    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    // Append new file URLs if uploaded
    if (files && files.length > 0) {
      const newFileUrls = files.map((file) => file.path);
      property.fileUploader = [...property.fileUploader, ...newFileUrls];
    }

    if (propertyname) property.propertyname = propertyname;
    if (status) property.status = status;

    await property.save();
    res
      .status(200)
      .json({ message: "Property updated successfully", property });
  } catch (error) {
    console.error("Update Property Error:", error);
    res.status(500).json({ error: "Failed to update property" });
  }
};

const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ error: "Property not found" });

    // Optional: Delete associated files from Cloudinary
    const deleteFromCloudinary = async (url) => {
      const publicId = url.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`properties/${publicId}`);
    };

    await Promise.all(property.fileUploader.map(deleteFromCloudinary));

    await Property.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Property deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createProperty,
  getProperties,
  updateProperty,
  deleteProperty,
  getPropertyById,
};
