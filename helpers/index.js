const dbValidators = require('./db-validators');
const findCollection = require('./find-collections');
const generateJWT = require('./generate-jwt');
const googleVerify = require('./google-verify');
const uploadFile = require('./upload-file');

module.exports = {
   ...dbValidators,
   ...findCollection,
   ...generateJWT,
   ...googleVerify,
   ...uploadFile,
};
