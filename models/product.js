const { Schema, model } = require('mongoose');

const ProductSchema = Schema({
   name: { type: String, required: [true, 'El nombre es obligatorio'], unique: true },

   state: { type: Boolean, required: true, default: true },

   user: { type: Schema.Types.ObjectId, ref: 'User', required: true },

   price: { type: Number, default: 0 },

   category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },

   description: { type: String },

   stock: { type: Boolean, default: true },

   img: { type: String },
});

ProductSchema.methods.toJSON = function () {
   const { __v, state, ...data } = this.toObject();
   return data;
};

module.exports = model('Product', ProductSchema);
