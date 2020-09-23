const axios = require("axios");

module.exports = async function (email, pass) {
  try {
    const htmlLogin = await axios({
      method: "post",
      url: "https://vk.com/login",
    });
    //сохраняем куки, для следующего запроса.
    const resCookie = htmlLogin.headers["set-cookie"].join(";");
    let useragent =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36";

    //динамичная проверка авторизации. Зависит от IP
    const ip_h = htmlLogin.data.match(/ip_h"\svalue="(.+?)"/s)[1];
    //динамичная проверка авторизации. Обновляется каждый раз при загрузке формы логина.
    const lg_h = htmlLogin.data.match(/lg_h"\svalue="(.+?)"/s)[1];

    const linkAutorized = `https://login.vk.com/?act=login&to=aW5kZXgucGhw$_origin=https://vk.com&role=al_frame&expire=&recaptcha=&captcha_sid=&captcha_key=&ul=&ip_h=${ip_h}&lg_h=${lg_h}&email=${email}&pass=${pass}`;
    const resultAutor = await axios.post(
      linkAutorized,
      {},
      { headers: { Cookie: resCookie, "User-Agent": useragent } }
    );
    //Обработка ошибок
    if (/onLoginDone/.test(resultAutor.data)) {
      console.log("Autorization is Done!");
    } else if (/onLoginFailed/.test(resultAutor.data)) {
      throw new Error(
        "Ошибка авторизации! Проверьте правильность логина и пароля."
      );
    } else if (/act=authcheck/.test(resultAutor.data)) {
      throw new Error(
        "Запрос кода авторизации! Пожалуйста, отключите двойную авторизацию на время работы скрипта."
      );
    } else {
      throw new Error("Неизвестная ошибка авторизации! Что-то пошло не так. ");
    }
    //возвращаем куки в виде строки
    return resultAutor.headers["set-cookie"].join(";");
  } catch (error) {
    if (error.code === "ERR_UNESCAPED_CHARACTERS") {
      throw new Error(
        "Недопустимые символы в имени логина и пароля. Только английские буквы"
      );
    } else throw new Error(error);
  }
};
