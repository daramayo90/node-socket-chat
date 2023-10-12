const { Router } = require('express');
const { check } = require('express-validator');

const { existProductById, existCategoryById } = require('../helpers/db-validators');
const { validateFields, validateJWT, isAdminRole } = require('../middlewares');

const {
   getProducts,
   getProductById,
   createProduct,
   updateProduct,
   deleteProduct,
} = require('../controllers/products');

const router = Router();

// Obtain all products - public
router.get('/', getProducts);

// Obtain one product by id - public
router.get(
   '/:id',
   [
      check('id', 'No es un ID válido').isMongoId(),
      check('id').custom(existProductById),
      validateFields,
   ],
   getProductById,
);

// Create product - private with valid token
router.post(
   '/',
   [
      validateJWT,
      check('name', 'El nombre es obligatorio').not().isEmpty(),
      check('category', 'No es un ID válido').isMongoId(),
      validateFields,
      check('category').custom(existCategoryById),
      validateFields,
   ],
   createProduct,
);

// Update product by id - private with valid token
router.put(
   '/:id',
   [
      validateJWT,
      // check('id', 'No es un ID válido').isMongoId(),
      check('id').custom(existProductById),
      validateFields,
   ],
   updateProduct,
);

// Delete product by id - private with valid token
router.delete(
   '/:id',
   [
      validateJWT,
      isAdminRole,
      check('id', 'No es un ID válido').isMongoId(),
      check('id').custom(existProductById),
      validateFields,
   ],
   deleteProduct,
);

module.exports = router;
