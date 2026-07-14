const express = require("express");
const router = express.Router();

const {
  localFileUpload,
  imageUpload,
  getImages,
  videoFileUpload,
  imageReduceUpload,
  renderView,
<<<<<<< HEAD
  deleteAllImages,
=======
>>>>>>> 82d8eea (file upload)
} = require("../controllers/fileUpload");

router.post("/localFileUpload", localFileUpload);
router.post("/fileUpload", imageUpload);
router.post("/videoFileUpload", videoFileUpload);
router.post("/imageReduceUpload", imageReduceUpload);
router.get("/files", getImages);
<<<<<<< HEAD
router.delete("/delete-all", deleteAllImages);
=======
>>>>>>> 82d8eea (file upload)

router.get("/form", (req, res) => {
  res.render("form", { message: null });
});

router.get("/home", renderView);
module.exports = router;
