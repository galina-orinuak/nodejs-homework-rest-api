import multer from "multer";
import path from "path";

const destination = path.resolve("temp");

const configMul = multer.diskStorage({
    destination,
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({
    storage: configMul
})

export default upload;