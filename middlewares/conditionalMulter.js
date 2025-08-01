const parser = require("./multer"); // your multer config

const conditionalUpload = (req, res, next) => {
  const contentType = req.headers["content-type"] || "";

  if (contentType.includes("multipart/form-data")) {
    parser.array("fileUploader", 10)(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  } else {
    // No files to process
    req.files = []; // ensure it's an empty array
    next();
  }
};

module.exports = conditionalUpload;
