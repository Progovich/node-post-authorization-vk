const dotenv = require('dotenv');
const axios = require('axios');

const authVk = require('./utils/authVk');
dotenv.config({ path: './.env' });

async function start() {
  const login = process.env.LOGIN;
  const password = process.env.PASSWORD;
  const cookies = await authVk(login, password);

  const htmlMessage = await axios({
    method: 'GET',
    url: 'https://vk.com/mail',
    headers: {
      Cookie: cookies,
    },
  });

  const listMessage = htmlMessage.data
    .match(/mi_author">.+?</g)
    .map((elem) => elem.match(/>(.+?)</)[1]);

  console.log(listMessage);
}

start();
