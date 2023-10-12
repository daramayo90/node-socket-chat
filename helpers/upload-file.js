const path = require('path');
const { v4: uuidv4 } = require('uuid');

const uploadFile = async (files, validExtensions = ['png', 'jpg', 'jpeg', 'gif'], folder = '') => {
   return new Promise((resolve, reject) => {
      const { file } = files;
      const cutName = file.name.split('.');
      const extension = cutName[cutName.length - 1];

      // Validate extension
      if (!validExtensions.includes(extension)) {
         return reject(`La extensión ${extension} no es permitida en "${validExtensions}"`);
      }

      const fileId = uuidv4() + '.' + extension;
      const uploadPath = path.join(__dirname, '../uploads/', folder, fileId);

      // Use the mv() method to place the file somewhere on your server
      file.mv(uploadPath, (err) => {
         if (err) return reject(err);

         resolve(fileId);
      });
   });
};

module.exports = { uploadFile };
