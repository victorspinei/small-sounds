const path = require('path');
const multer = require('multer');
const songMaxSize = 10 * 1024 * 1024; // 10 MB (adjust as needed)

const uploadSong = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            // Specify your desired destination path here for songs
            cb(null, path.join(__dirname, '../media/songs'));
        },
        filename: function (req, file, cb) {
            // Append current date to the original filename for songs
            const currentDate = new Date().toISOString().replace(/:/g, '-');
            const filename = `${currentDate}-${file.originalname}`;
            cb(null, filename);
        },
    }),
    limits: { fileSize: songMaxSize },
    fileFilter: function (req, file, cb) {
        // Check if the file extension is .mp3
        if (file.originalname.toLowerCase().endsWith('.mp3') || 
            file.originalname.toLowerCase().endsWith('.wav') || 
            file.originalname.toLowerCase().endsWith('.ogg') ) {
            // Pass the file
            cb(null, true);
        } else {
            // Reject the file and provide an error message
            cb(new Error("Error: File upload only supports MP3 files."));
        }
    },
}).single("mySong");

module.exports = uploadSong;