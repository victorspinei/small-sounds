const fs = require('fs');
const path = require('path');


exports.ValidateEmail = email => {
    const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return email.match(validRegex);
}

exports.GetContent = username => `\t👋 Hi, I’m @${username}\n\t👀 I’m interested in ...\n\t🌱 I’m currently learning ...\n\t💞️ I’m looking to collaborate on ...\n\t📫 How to reach me ...\n`;

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