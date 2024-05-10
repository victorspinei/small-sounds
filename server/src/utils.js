const fs = require('fs');
const path = require('path');


exports.ValidateEmail = email => {
    const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return email.match(validRegex);
}

exports.GetContent = username => `- 👋 Hi, I’m @${username}`;


exports.removeFolderRecursive = folderPath => {
    if (fs.existsSync(folderPath)) {
        fs.readdirSync(folderPath).forEach((file, index) => {
            const curPath = path.join(folderPath, file);
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                removeFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(folderPath);
        console.log(`Folder "${folderPath}" removed successfully`);
    }
}
exports.genres = ['rock', 'pop', 'hip-hop', 'jazz', 'blues', 'country', 'classical', 'electronic', 'reggae', 'folk', 'metal', 'punk', 'indie', 'other'];
exports.instruments = ['guitar', 'piano', 'drums', 'bass', 'violin', 'saxophone', 'trumpet', 'flute', 'clarinet', 'keyboard', 'ukulele', 'banjo', 'harmonica', 'accordion', 'other'];