import {
  solveRegistrationChallenge,
  solveLoginChallenge,
} from '@webauthn/client';

const SERVER = 'https://localhost:8000';

const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');

const requestDefaults = {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
};

registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const [regEmailElem] = event.target;

  console.log('registering:', regEmailElem.value);

  const challenge = await fetch(`${SERVER}/request-register`, {
    method: 'POST',
    ...requestDefaults,
    body: JSON.stringify({ email: regEmailElem.value }),
  }).then(resp => resp.json());

  const credentials = await solveRegistrationChallenge(challenge);

  const { loggedIn } = await fetch(`${SERVER}/register`, {
    method: 'POST',
    ...requestDefaults,
    body: JSON.stringify(credentials),
  }).then(resp => resp.json());

  console.log('is logged in:', loggedIn);
});

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const [loginEmailElem] = event.target;

  console.log('logging in:', loginEmailElem.value);

  const challenge = await fetch(`${SERVER}/login`, {
    method: 'POST',
    ...requestDefaults,
    body: JSON.stringify({ email: loginEmailElem.value }),
  }).then(resp => resp.json());

  const credentials = await solveLoginChallenge(challenge);

  console.log('credentials:', credentials);

  const { loggedIn } = await fetch(`${SERVER}/login-challenge`, {
    method: 'POST',
    ...requestDefaults,
    body: JSON.stringify(credentials),
  }).then(resp => resp.json());

  console.log('is logged in:', loggedIn);
});
