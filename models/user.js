const { Schema, model } = require('mongoose');

const UserSchema = Schema({
   name: { type: String, required: [true, 'El nombre es obligatorio'] },

   mail: { type: String, required: [true, 'El correo es obligatorio'], unique: true },

   password: { type: String, required: [true, 'La contraseña es obligatorio'] },

   img: { type: String },

   role: { type: String, enum: ['ADMIN_ROLE', 'USER_ROLE', 'SELL_ROLE'] },

   state: { type: Boolean, default: true },

   google: { type: Boolean, default: false },

   img: { type: String },
});

UserSchema.methods.toJSON = function () {
   const { __v, password, _id, ...user } = this.toObject();
   user.uid = _id;
   return user;
};

module.exports = model('User', UserSchema);
