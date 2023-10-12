const { response } = require('express');
const { findCategories, findProducts, findUsers } = require('../helpers/find-collections');

const allowedCollections = ['categories', 'products', 'users'];

const find = (req, res = response) => {
   const { collection, searchTerm } = req.params;

   if (!allowedCollections.includes(collection)) {
      return res.status(404).json({ msg: `Las colecciones permitidas son ${allowedCollections}` });
   }

   switch (collection) {
      case 'categories':
         findCategories(searchTerm, res);
         break;

      case 'products':
         findProducts(searchTerm, res);
         break;

      case 'users':
         findUsers(searchTerm, res);
         break;

      default:
         res.status(500).json({ msg: 'Se me olvido hacer esta búsqueda' });
         break;
   }
};

module.exports = { find };
