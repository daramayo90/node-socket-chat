const myForm = document.querySelector('form');

myForm.addEventListener('submit', (event) => {
   event.preventDefault();
   const formData = {};

   for (let element of myForm.elements) {
      if (element.name.length > 0) formData[element.name] = element.value;

      fetch('http://localhost:8081/api/auth/login', {
         method: 'POST',
         body: JSON.stringify(formData),
         headers: { 'Content-Type': 'application/json' },
      })
         .then((resp) => resp.json())
         .then(({ msg, token }) => {
            if (msg) return console.log(msg);

            console.log('EL TOKEN', token);

            localStorage.setItem('token', token);

            if (localStorage.getItem('token').length > 10) window.location = 'chat.html';
         })
         .catch((err) => console.log(err));
   }
});

function handleCredentialResponse(response) {
   // Google Token: ID_TOKEN
   const body = { id_token: response.credential };

   fetch('http://localhost:8081/api/auth/google', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
   })
      .then((resp) => resp.json())
      .then(({ token }) => {
         localStorage.setItem('token', token);
         window.location = 'chat.html';
      })
      .catch(console.wran);
}

const button = document.getElementById('google_signout');
button.onclick = () => {
   console.log(google.accounts);
   google.accounts.id.disableAutoSelect();
   google.accounts.id.revoke(
      localStorage.getItem('token', (done) => {
         localStorage.clear();
         location.reload();
      }),
   );
};
