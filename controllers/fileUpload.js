const { render } = require("ejs");
const File = require("../models/File");
const path = require("path");
const cloudinary = require("cloudinary").v2;

exports.localFileUpload = async (req, res) => {
  try {
    const file = req.files.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded. Please select a file.",
      });
    }

    const uploadpath =
      __dirname + "/files/" + Date.now() + `.${file.name.split(".")[1]}`;

    file.mv(uploadpath, (err) => {
      console.log(err);
    });

    await File.create({
      name: file.name,
      imageUrl: `file/${file.name}`,
    });

    res.json({
      status: true,
      message: "file uploaded",
    });
  } catch (error) {
    console.log(error);
  }
};

function isFileTypeSupported(type, supportedFileType, fileSize) {
  const max_size = 5 * 1024 * 1024;
  if (fileSize > max_size) {
    return {
      success: false,
      message: "Video size should not exceed 5 MB",
    };
  }
  return supportedFileType.includes(type);
}

async function uploadFileToCloudinary(file, folder) {
  const options = { folder };
  options.resource_type = "auto";
  return await cloudinary.uploader.upload(file.tempFilePath, options);
}

exports.imageUpload = async (req, res) => {
  try {
    const { name, email, tags } = req.body;
    const file = req.files.image;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded. Please select an image file.",
      });
    }

    const supportedType = ["jpg", "jpeg", "png"];
    const fileType = `${file.name.split(".")[1]}`.toLowerCase();

    if (!isFileTypeSupported(fileType, supportedType, file.size)) {
      return res.status(400).json({
        success: false,
        message: "Formate not supported",
      });
    }

    const response = await uploadFileToCloudinary(file, "images");
    await File.create({
      name,
      tags,
      email,
      imageUrl: response.secure_url,
    });

    res.json({
      status: true,
      message: "file uploaded to cloudinary",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: false,
      message: error,
    });
  }
};

exports.getImages = async (req, res) => {
  try {
    const images = await File.find();
    res.json({
      status: true,
      message: "images fetches",
      data: images,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.videoFileUpload = async (req, res) => {
  try {
    const { name, email, tags } = req.body;
    const file = req.files.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded. Please select a video file.",
      });
    }

    const supportedType = [".mp4", ".mov"];
    const fileType = path.extname(file.name).toLowerCase();

    if (!isFileTypeSupported(fileType, supportedType, file.size)) {
      return res.status(400).json({
        success: false,
        message: "Formate not supported",
      });
    }

    const response = await uploadFileToCloudinary(file, "images");
    await File.create({
      name,
      tags,
      email,
      videoUrl: response.secure_url,
    });

    res.json({
      status: true,
      message: "video uploaded to cloudinary",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: false,
      message: error,
    });
  }
};

function isReduceFileTypeSupported(type, supportedFileType) {
  return supportedFileType.includes(type);
}

async function uploadReduceFileToCloudinary(file, folder, quality) {
  const options = { folder };
  if (quality) {
    options.quality = quality;
  }
  options.resource_type = "auto";
  return await cloudinary.uploader.upload(file.tempFilePath, options);
}

exports.imageReduceUpload = async (req, res) => {
  try {
    const { name, email, tags } = req.body;
    const file = req.files.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded. Please select an image file.",
      });
    }

    const supportedType = ["jpg", "jpeg", "png", "webp"];
    const fileType = `${file.name.split(".")[1]}`.toLowerCase();

    if (!isReduceFileTypeSupported(fileType, supportedType)) {
      return res.status(400).json({
        success: false,
        message: "Formate not supported",
      });
    }

    const response = await uploadReduceFileToCloudinary(file, "images", 50);
    await File.create({
      name,
      tags,
      email,
      imageUrl: response.secure_url,
    });

    const message = `Hello ${name} , Your image uploaded successfully`;
    res.render("form", {
      message,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: false,
      message: error,
    });
  }
};

exports.renderView = (req, res) => {
  const name = "Kushank";
  res.render("home", {
    name,
  });
};

exports.deleteAllImages = async (req, res) => {
  try {
    const result = await File.deleteMany({});

    res.status(200).json({
      success: true,
      message: "All records deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete records",
      error: error.message,
    });
  }
};
