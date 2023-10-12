const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields, validateJWT } = require('../middlewares');

const { login, googleSignIn, renewToken } = require('../controllers/auth');

const router = Router();

router.post(
   '/login',
   [
      check('mail', 'El correo es obligatorio').isEmail(),
      check('password', 'La contraseña es obligatoria').not().isEmpty(),
      validateFields,
   ],
   login,
);

router.post(
   '/google',
   [check('id_token', 'El id_token es necesario').not().isEmpty(), validateFields],
   googleSignIn,
);

router.get('/', validateJWT, renewToken);

module.exports = router;
