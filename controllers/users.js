const { request, response } = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

const getUser = async (req = request, res = response) => {
   const { limit = 5, from = 0 } = req.query;
   const query = { state: true };

   const [total, users] = await Promise.all([
      User.countDocuments(query),
      User.find(query).skip(Number(from)).limit(Number(limit)),
   ]);

   res.status(200).json({ total, users });
};

const putUser = async (req, res = response) => {
   const { id } = req.params;
   const { _id, password, google, mail, ...rest } = req.body;

   if (password) {
      rest.password = bcrypt.hashSync(password, 10);
   }

   const user = await User.findByIdAndUpdate(id, rest);

   res.status(200).json({ user });
};

const postUser = async (req, res = response) => {
   const { name, mail, password, role } = req.body;

   const user = new User({ name, mail, password, role });

   user.password = bcrypt.hashSync(password, 10);

   await user.save();

   res.status(200).json({ user });
};

const deleteUser = async (req, res = response) => {
   // const authUser = req.authUser;  Created in middleware/validate-jwt.js
   // const user = await User.findByIdAndDelete(id);   Best practice: Do not remove user from db
   const { id } = req.params;

   const user = await User.findByIdAndUpdate(id, { state: false });

   res.status(200).json({ user });
};

module.exports = { getUser, putUser, postUser, deleteUser };
