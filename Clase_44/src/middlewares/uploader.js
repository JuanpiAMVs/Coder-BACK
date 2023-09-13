import multer from "multer"
import __dirname from "../utils.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder;

    switch (file.fieldname) {
        case "imgProfile":
          folder = "profiles";
          break;
        case "thumbnails":
          folder = "products";
          break;
        case "document":
          folder = "documents";
          break;
        default:
          folder = "uploads";
      }

    cb(null, `${__dirname}/public/${folder}`);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploader = multer({ storage });

export default uploader;