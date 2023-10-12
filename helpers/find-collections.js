const { ObjectId } = require('mongoose').Types;
const { Category, Product, User } = require('../models');

const findCategories = async (term = '', res = response) => {
   const isMongoId = ObjectId.isValid(term);

   if (isMongoId) {
      const category = await Category.findById(term);
      return res.json({ results: category ? [category] : [] });
   }

   const regex = new RegExp(term, 'i'); // insensitive case

   const categories = await Category.find({ name: regex, state: true });

   res.json({ results: categories ? [categories] : [] });
};

const findProducts = async (term = '', res = response) => {
   const isMongoId = ObjectId.isValid(term);

   if (isMongoId) {
      const product = await Product.findById(term).populate('category', 'name');
      return res.json({ results: product ? [product] : [] });
   }

   const regex = new RegExp(term, 'i'); // insensitive case

   const products = await Product.find({ name: regex, state: true }).populate('category', 'name');

   res.json({ results: products ? [products] : [] });
};

const findUsers = async (term = '', res = response) => {
   const isMongoId = ObjectId.isValid(term);

   if (isMongoId) {
      const user = await User.findById(term);
      return res.json({ results: user ? [user] : [] });
   }

   const regex = new RegExp(term, 'i'); // insensitive case

   const users = await User.find({
      $or: [{ name: regex }, { mail: regex }],
      $and: [{ state: true }],
   });

   res.json({ results: users ? [users] : [] });
};

module.exports = {
   findCategories,
   findProducts,
   findUsers,
};
