const { request, response } = require('express');

const isAdminRole = (req = request, res = response, next) => {
   if (!req.authUser) {
      return res
         .status(500)
         .json({ msg: 'Se quiere verificar el rol sin válidar el token primero' });
   }

   const { role, name } = req.authUser; // Created in middleware/validate.roles.js

   if (role !== 'ADMIN_ROLE') return res.status(401).json({ msg: `El ${name} no es Admin` });

   next();
};

const hasRole = (...roles) => {
   return (req = request, res = response, next) => {
      if (!req.authUser) {
         return res
            .status(500)
            .json({ msg: 'Se quiere verificar el rol sin válidar el token primero' });
      }

      console.log(roles);
      console.log(req.authUser.role);

      if (!roles.includes(req.authUser.role)) {
         return res.status(401).json({ msg: `El servicio requiere uno de estos roles ${roles}` });
      }

      next();
   };
};

module.exports = { isAdminRole, hasRole };
