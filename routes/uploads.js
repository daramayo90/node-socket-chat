const { Router } = require('express');
const { check } = require('express-validator');

const { allowedCollections } = require('../helpers');
const { validateFields, validateFile } = require('../middlewares');

const { uploadFiles, updateImageCloudinary, showImage } = require('../controllers/uploads');

const router = Router();

router.post('/', validateFile, uploadFiles);

router.put(
   '/:collection/:id',
   [
      validateFile,
      check('id', 'El id debe ser un ID de mongo').isMongoId(),
      check('collection').custom((c) => allowedCollections(c, ['users', 'products'])),
      validateFields,
   ],
   updateImageCloudinary,
);

router.get(
   '/:collection/:id',
   [
      check('id', 'El id debe ser un ID de mongo').isMongoId(),
      check('collection').custom((c) => allowedCollections(c, ['users', 'products'])),
      validateFields,
   ],
   showImage,
);

module.exports = router;
