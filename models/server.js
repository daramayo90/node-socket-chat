const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { createServer } = require('http');

const { dbConnection } = require('../database/config');
const { socketController } = require('../sockets/controller');

class Server {
   constructor() {
      this.app = express();
      this.port = process.env.PORT;
      this.server = createServer(this.app);
      this.io = require('socket.io')(this.server);

      this.paths = {
         auth: '/api/auth',
         categories: '/api/categories',
         find: '/api/find',
         products: '/api/products',
         uploads: '/api/uploads',
         users: '/api/users',
      };

      // DB Connection
      this.dbConnection();

      // Middlewares
      this.middlewares();

      // App Routes
      this.routes();

      // Sockets
      this.sockets();
   }

   async dbConnection() {
      await dbConnection();
   }

   middlewares() {
      // CORS
      this.app.use(cors());

      // Parse of body data
      this.app.use(express.json());

      // Public directory
      this.app.use(express.static('public'));

      // Files upload
      this.app.use(
         fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true,
         }),
      );
   }

   routes() {
      this.app.use(this.paths.auth, require('../routes/auth'));
      this.app.use(this.paths.categories, require('../routes/categories'));
      this.app.use(this.paths.find, require('../routes/find'));
      this.app.use(this.paths.products, require('../routes/products'));
      this.app.use(this.paths.uploads, require('../routes/uploads'));
      this.app.use(this.paths.users, require('../routes/users'));
   }

   sockets() {
      this.io.on('connection', (socket) => socketController(socket, this.io));
   }

   listen() {
      this.server.listen(this.port, () => {
         console.log('server running on port', this.port);
      });
   }
}

module.exports = Server;
