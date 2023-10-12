const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { response } = require('express');
const { uploadFile } = require('../helpers');

const { User, Product } = require('../models');

const uploadFiles = async (req, res = response) => {
   try {
      // txt, md
      const name = await uploadFile(req.files, ['txt', 'md']);
      res.json({ name });
   } catch (msg) {
      res.status(400).json({ msg });
   }
};

// File System - Depcreated
// const updateImage = async (req, res = response) => {
//    const { collection, id } = req.params;

//    let model;

//    switch (collection) {
//       case 'users':
//          model = await User.findById(id);

//          if (!model) return res.status(400).json({ msg: `No existe un usuario con el id ${id}` });

//          break;

//       case 'products':
//          model = await Product.findById(id);

//          if (!model) return res.status(400).json({ msg: `No existe un producto con el id ${id}` });

//          break;

//       default:
//          return res.status(500).json({ msg: 'Se me olvidó validar esto' });
//    }

//    // Clean previous images
//    try {
//       if (model.img) {
//          const pathImg = path.join(__dirname, '../uploads', collection, model.img);
//          console.log(pathImg);

//          if (fs.existsSync(pathImg)) fs.unlinkSync(pathImg);
//       }
//    } catch (error) {
//       console.log(error);
//       return res.status(500).json({ msg: error });
//    }

//    const fileName = await uploadFile(req.files, ['jpg', 'jpeg'], collection);
//    model.img = fileName;
//    await model.save();

//    res.json(model);
// };

// Cloudinary
const updateImageCloudinary = async (req, res = response) => {
   const { collection, id } = req.params;

   let model;

   switch (collection) {
      case 'users':
         model = await User.findById(id);

         if (!model) return res.status(400).json({ msg: `No existe un usuario con el id ${id}` });

         break;

      case 'products':
         model = await Product.findById(id);

         if (!model) return res.status(400).json({ msg: `No existe un producto con el id ${id}` });

         break;

      default:
         return res.status(500).json({ msg: 'Se me olvidó validar esto' });
   }

   // Clean previous images from Cloudinary
   if (model.img) {
      const arrayName = model.img.split('/');
      const name = arrayName[arrayName.length - 1];
      const [public_id] = name.split('.');

      await cloudinary.uploader.destroy(public_id);
   }

   const { tempFilePath } = req.files.file;
   const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

   model.img = secure_url;
   await model.save();

   res.json(model);
};

const showImage = async (req, res = response) => {
   const { collection, id } = req.params;

   let model;

   switch (collection) {
      case 'users':
         model = await User.findById(id);

         if (!model) return res.status(400).json({ msg: `No existe un usuario con el id ${id}` });

         break;

      case 'products':
         model = await Product.findById(id);

         if (!model) return res.status(400).json({ msg: `No existe un producto con el id ${id}` });

         break;

      default:
         return res.status(500).json({ msg: 'Se me olvidó validar esto' });
   }

   // Clean previous images
   try {
      if (model.img) {
         const pathImg = path.join(__dirname, '../uploads', collection, model.img);
         console.log(pathImg);

         if (fs.existsSync(pathImg)) return res.sendFile(pathImg);
      }
   } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: error });
   }

   const pathImg = path.join(__dirname, '../assets/noimage.jpg');

   res.sendFile(pathImg);
};

module.exports = { uploadFiles, updateImageCloudinary, showImage };
