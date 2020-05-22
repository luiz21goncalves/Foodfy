const { compare } = require('bcryptjs');

const User = require('../models/User');

async function login(req, res, next) {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  
  if (!user)
    return res.render('session/login', {
      user: req.body,
      error: 'Usuário não cadastrado.',
    });

  const passed = await compare(password, user.password);

  if (!passed)
    return res.render('session/login', {
      user: req.body,
      error: 'Senha incorreta.'
    })

  req.user = user;

  next();
};

async function forgot(req, res, next) {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user)
      return res.render('session/forgot', {
        user: req.body,
        error: 'Usuário não cadastrdo.'
      });

    req.user = user;

    next();
  } catch (err) {
    console.error(err);

    return res.render('sessio/forgot', {
      user: req.body,
      error: 'Erro inesperado, por favor tente novamente.'
    });
  }
};

async function reset(req, res, next) {
  try {
    const { email, password, passwordRepeat, token } = req.body;

    const user = await User.findOne({ where: { email } });
  
    if (!user)
      return res.render('session/reset', {
        user: req.body,
        token,
        error: 'Usuário não cadastrado.'
      });
  
    if (password != passwordRepeat)
      return res.render('session/reset', {
        user: req.body,
        token,
        error: 'Senhas não conferem.'
      });
  
    if (token != user.reset_token)
      return res.render('session/reset', {
        user: req.body,
        token,
        error: `
          Token inválido! Solicite uma nova 
          <a href="/forgot-password">recuperação de senha</a>.
        `
      });
    
    let tokenExpires = new Date();
    tokenExpires = tokenExpires.setHours(tokenExpires.getHours);

    if (tokenExpires > user.reset_token_expires)
      return res.render('session/reset', {
        user: req.body,
        token,
        error: `
          Token expirado! Solicite uma nova 
          <a href="/forgot-password">recuperação de senha</a>.
        `
      });
  
    req.user = user;
  
    next();
  } catch (err) {
    console.error(err);

    return res.render('session/reset', {
      user: req.body,
      token,
      error: 'Erro inesperado, por favor tente  novamente.'
    });
  }
};

module.exports = {
  login,
  forgot,
  reset,
};