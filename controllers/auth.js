const { response } = require('express');

const User = require('../models/user');
const bcrypt = require('bcryptjs');

const { generateJWT } = require('../helpers/generate-jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req, res = response) => {
   const { mail, password } = req.body;

   try {
      // Check if email exists
      const user = await User.findOne({ mail });
      if (!user) {
         return res.status(400).json({ msg: 'Usuario / Contraseña no son correctos' });
      }

      // Check if user is active
      if (!user.state) {
         return res.status(400).json({ msg: 'Usuario / Contraseña no son correctos' });
      }

      // Check password
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
         return res.status(400).json({ msg: 'Usuario / Contraseña no son correctos' });
      }

      // Generate JWT
      const token = await generateJWT(user.id);

      res.json({ user, token });
   } catch (error) {
      console.log(error);
      res.status(500).json({ msg: 'Hablar con el admin' });
   }
};

const googleSignIn = async (req, res = response) => {
   const { id_token } = req.body;

   try {
      const { mail, name, img } = await googleVerify(id_token);

      let user = await User.findOne({ mail });

      if (!user) {
         const data = {
            name,
            mail,
            password: ':P',
            img,
            google: true,
         };

         user = new User(data);
         await user.save();
      }

      if (!user.state) return res.status(401).json({ msg: 'Usuario bloqueado' });

      // Generate JWT
      const token = await generateJWT(user.id);

      res.json({ user, token });
   } catch (error) {
      console.log(error);
      res.status(400).json({ msg: 'Token de Google no es válido' });
   }
};

const renewToken = async (req, res = response) => {
   const { authUser } = req;

   // Generate JWT
   const token = await generateJWT(authUser.id);

   res.json({ authUser, token });
};

module.exports = { login, googleSignIn, renewToken };
