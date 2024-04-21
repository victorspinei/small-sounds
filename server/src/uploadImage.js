const path = require('path');
const multer = require('multer');

// Define the maximum size for uploading picture i.e. 1 MB. It is optional.
const imageMaxSize = 1 * 1024 * 1024;

const uploadImage = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            // Specify your desired destination path here
            cb(null, path.join(__dirname, '../media/images'));
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + "-" + Date.now() + ".jpg");
        },
    }),
    limits: { fileSize: imageMaxSize },
    fileFilter: function (req, file, cb) {
        // Set the filetypes, it is optional
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        
        if (mimetype && extname) {
            return cb(null, true);
        }

        cb(new Error(
            "Error: File upload only supports the following filetypes - " +
            filetypes
        ));
    },
}).single("myPic");


module.exports = uploadImage;