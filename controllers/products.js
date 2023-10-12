const { response } = require('express');
const { Product } = require('../models');

const getProducts = async (req, res = response) => {
   const { limit = 5 } = req.query;
   const query = { state: true };

   const [total, products] = await Promise.all([
      Product.countDocuments(query),
      Product.find(query)
         .limit(Number(limit))
         .populate('category', 'name')
         .populate('user', 'name'),
   ]);

   return res.status(200).json({ total, products });
};

const getProductById = async (req, res = response) => {
   const { id } = req.params;

   const product = await Product.findById(id).populate('category', 'name').populate('user', 'name');

   return res.status(200).json(product);
};

const createProduct = async (req, res = response) => {
   const { state, user, ...body } = req.body;

   const productDB = await Product.findOne({ name: body.name.toUpperCase() });

   if (productDB) {
      return res.status(400).json({ msg: `El producto ${productDB.name} ya existe` });
   }

   const data = {
      ...body,
      name: body.name.toUpperCase(),
      user: req.authUser._id,
   };

   const product = new Product(data);
   await product.save();

   return res.status(201).json(product);
};

const updateProduct = async (req, res = response) => {
   const { id } = req.params;
   const { state, user, ...data } = req.body;

   if (data.name) data.name = req.body.name.toUpperCase();

   data.authUser = req.authUser._id;

   const product = await Product.findByIdAndUpdate(id, data, { new: true });

   res.status(200).json(product);
};

const deleteProduct = async (req, res = response) => {
   const { id } = req.params;

   const product = await Product.findByIdAndUpdate(id, { state: false }, { new: true });

   res.status(200).json(product);
};

module.exports = {
   getProducts,
   getProductById,
   createProduct,
   updateProduct,
   deleteProduct,
};
