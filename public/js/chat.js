// HTML Ref
const txtUid = document.querySelector('#txtUid');
const txtMsg = document.querySelector('#txtMsg');
const ulUsers = document.querySelector('#ulUsers');
const ulMessages = document.querySelector('#ulMsgs');
const btnLogout = document.querySelector('#btnLogout');

let user = null;
let socket = null;

// Validate token from localstorage
const validateJWT = async () => {
   const token = localStorage.getItem('token') || '';

   if (token.length <= 10) throw new Error('No hay token en el servidor');

   const resp = await fetch('http://localhost:8081/api/auth', {
      headers: { 'x-token': token },
   });

   const { authUser: userDB, token: tokenDB } = await resp.json();

   localStorage.setItem('token', tokenDB);
   user = userDB;
   document.title = user.name;

   await connectSocket();
};

// Socket connection
const connectSocket = async () => {
   socket = io({
      extraHeaders: {
         'x-token': localStorage.getItem('token'),
      },
   });

   socket.on('connect', () => {
      console.log('Sockets online');
   });

   socket.on('disconnect', () => {
      console.log('Sockets offline');
   });

   socket.on('active-users', drawUsers);

   socket.on('receive-messages', drawMessages);

   socket.on('private-message', (payload) => {
      console.log('Privado:', payload);
   });
};

const drawUsers = (users = []) => {
   let usersHtml = '';

   users.forEach(({ name, uid }) => {
      usersHtml += `
         <li>
            <p>
               <h5 class="text-success">${name}</h5>
               <span class="fs-6 text-muted">${uid}</span>
            </p>
         </li>
      `;
   });

   ulUsers.innerHTML = usersHtml;
};

const drawMessages = (messages = []) => {
   let messagesHtml = '';

   messages.forEach(({ name, message }) => {
      messagesHtml += `
         <li>
            <p>
               <span class="text-primary">${name}: </span>
               <span>${message}</span>
            </p>
         </li>
      `;
   });

   ulMessages.innerHTML = messagesHtml;
};

// keyCode 13 = 'Enter'
txtMsg.addEventListener('keyup', ({ keyCode }) => {
   const uid = txtUid.value;
   const message = txtMsg.value;

   if (keyCode !== 13) return;
   if (message.length === 0) return;

   socket.emit('send-message', { uid, message });
   txtMsg.value = '';
});

const main = async () => {
   await validateJWT();
};

main();
