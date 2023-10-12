const { response } = require('express');
const { Category } = require('../models');

const getCategories = async (req, res = response) => {
   const { limit = 5 } = req.query;
   const query = { state: true };

   const [total, categories] = await Promise.all([
      Category.countDocuments(query),
      Category.find(query).limit(Number(limit)).populate('user', 'name'),
   ]);

   return res.status(200).json({ total, categories });
};

const getCategoryById = async (req, res = response) => {
   const { id } = req.params;

   const category = await Category.findById(id).populate('user', 'name');

   return res.status(200).json(category);
};

const createCategory = async (req, res = response) => {
   const name = req.body.name.toUpperCase();

   const categoryDB = await Category.findOne({ name });

   if (categoryDB) {
      return res.status(400).json({ msg: `La categoría ${categoryDB.name} ya existe` });
   }

   const data = {
      name,
      user: req.authUser._id,
   };

   const category = new Category(data);
   await category.save();

   return res.status(201).json(category);
};

const updateCategory = async (req, res = response) => {
   const { id } = req.params;
   const { state, user, ...data } = req.body;

   data.name = req.body.name.toUpperCase();
   data.authUser = req.authUser._id;

   const category = await Category.findByIdAndUpdate(id, data, { new: true });

   res.status(200).json(category);
};

const deleteCategory = async (req, res = response) => {
   const { id } = req.params;

   const category = await Category.findByIdAndUpdate(id, { state: false }, { new: true });

   res.status(200).json(category);
};

module.exports = {
   getCategories,
   getCategoryById,
   createCategory,
   updateCategory,
   deleteCategory,
};
