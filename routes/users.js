const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields, validateJWT, isAdminRole, hasRole } = require('../middlewares');

const { isValidRole, existEmail, existUserById } = require('../helpers/db-validators');

const { getUser, putUser, postUser, deleteUser } = require('../controllers/users');

const router = Router();

router.get('/', getUser);

router.put(
   '/:id',
   [
      check('id', 'No es un ID válido').isMongoId(),
      check('id').custom(existUserById),
      check('role').custom(isValidRole),
      validateFields,
   ],
   putUser,
);

router.post(
   '/',
   [
      check('mail', 'El email no es válido').isEmail(),
      check('name', 'El nombre es obligatorio').not().isEmpty(),
      check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
      check('role').custom(isValidRole),
      check('mail').custom(existEmail),
      validateFields,
   ],
   postUser,
);

router.delete(
   '/:id',
   [
      validateJWT,
      // isAdminRole,
      hasRole('ADMIN_ROLE', 'SELL_ROLE'),
      check('id', 'No es un ID válido').isMongoId(),
      check('id').custom(existUserById),
      validateFields,
   ],
   deleteUser,
);

module.exports = router;
