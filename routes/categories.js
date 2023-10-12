const { Router } = require('express');
const { check } = require('express-validator');

const { existCategoryById } = require('../helpers/db-validators');
const { validateFields, validateJWT, isAdminRole } = require('../middlewares');

const {
   createCategory,
   getCategories,
   getCategoryById,
   updateCategory,
   deleteCategory,
} = require('../controllers/categories');

const router = Router();

// Obtain all categories - public
router.get('/', getCategories);

// Obtain one category by id - public
router.get(
   '/:id',
   [
      check('id', 'No es un ID válido').isMongoId(),
      check('id').custom(existCategoryById),
      validateFields,
   ],
   getCategoryById,
);

// Create category - private with valid token
router.post(
   '/',
   [validateJWT, check('name', 'El nombre es obligatorio').not().isEmpty(), validateFields],
   createCategory,
);

// Update category by id - private with valid token
router.put(
   '/:id',
   [
      validateJWT,
      check('id', 'No es un ID válido').isMongoId(),
      check('id').custom(existCategoryById),
      check('name', 'El nombre es obligatorio').not().isEmpty(),
      validateFields,
   ],
   updateCategory,
);

// Delete category by id - private with valid token
router.delete(
   '/:id',
   [
      validateJWT,
      isAdminRole,
      check('id', 'No es un ID válido').isMongoId(),
      check('id').custom(existCategoryById),
      validateFields,
   ],
   deleteCategory,
);

module.exports = router;
