const Role = require('../models/role');
const User = require('../models/user');
const Category = require('../models/category');
const Product = require('../models/product');

/**
 * Users
 */
const isValidRole = async (role = '') => {
   const existRole = await Role.findOne({ role });

   if (!existRole) {
      throw new Error(`El rol ${role} no está registrado en la base de datos`);
   }
};

const existEmail = async (mail = '') => {
   const existMail = await User.findOne({ mail });

   if (existMail) {
      throw new Error(`El email ${mail} ya existe`);
   }
};

const existUserById = async (id = '') => {
   const existUser = await User.findById({ _id: id });

   if (!existUser) {
      throw new Error(`El id: ${id} no existe`);
   }
};

/**
 * Categories
 */
const existCategoryById = async (id = '') => {
   const existCategory = await Category.findById({ _id: id });

   if (!existCategory) {
      throw new Error(`El id: ${id} no existe`);
   }
};

/**
 * Products
 */
const existProductById = async (id = '') => {
   const existProduct = await Product.findById(id);

   if (!existProduct) {
      throw new Error(`El id: ${id} no existe`);
   }
};

/**
 * Validate allowed collections
 */
const allowedCollections = (collection = '', collections = []) => {
   const isInclude = collections.includes(collection);

   if (!isInclude) {
      throw new Error(`La colección ${collection} no es permitida en "${collections}"`);
   }

   return true;
};

module.exports = {
   isValidRole,
   existEmail,
   existUserById,
   existCategoryById,
   existProductById,
   allowedCollections,
};
