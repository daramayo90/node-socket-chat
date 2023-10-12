const { Socket } = require('socket.io');
const { checkJWT } = require('../helpers');
const { ChatMessages } = require('../models');

const chatMessages = new ChatMessages();

const socketController = async (socket = new Socket(), io) => {
   const token = socket.handshake.headers['x-token'];
   const user = await checkJWT(token);

   if (!user) return socket.disconnect();

   // Add the connected user
   chatMessages.connectUser(user);
   io.emit('active-users', chatMessages.arrayUsers);
   socket.emit('receive-messages', chatMessages.last10);

   // Connect it to a special/private room
   socket.join(user.id); // 3 rooms: global, socket.id, user.id

   // Clean when a user is disconnected
   socket.on('disconnect', () => {
      chatMessages.disconnectUser(user.id);
      io.emit('active-users', chatMessages.arrayUsers);
   });

   socket.on('send-message', ({ uid, message }) => {
      // Private message
      if (uid) {
         socket.to(uid).emit('private-message', { from: user.name, message });
      } else {
         chatMessages.sendMessage(user.id, user.name, message);
         io.emit('receive-messages', chatMessages.last10);
      }
   });
};

module.exports = { socketController };
