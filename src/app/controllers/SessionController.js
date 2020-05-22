const crypto = require('crypto');
const mailer = require('../../lib/mailer');
const User = require('../models/User');

module.exports = {
  formLogin(req, res) {
    return res.render('session/login');
  },

  login(req, res) {
    const user = req.user;
    req.session.userId = user.id;

    if (user.is_admin) {
      return res.redirect('/admin/profile');
    }

    return res.redirect('/admin/users');
  },

  logout(req, res) {
    req.session.destroy();

    return res.redirect('/');
  },

  formForgot(req, res) {
    return res.render('session/forgot');
  },

  async forgot(req, res) {
    const user = req.user;

    try {
      const token = crypto.randomBytes(20).toString('hex');

      let expiresToken = new Date();
      expiresToken = expiresToken.setHours(expiresToken.getHours() + 1);

      await User.update(user.id, {
        reset_token: token,
        reset_token_expires: expiresToken,
      });

      await mailer.sendMail({
        to: user.email,
        from: 'no-replay@foodfy.com.br',
        subject: 'Recuperação de senha',
        html: `
          <h2>Esqueceu a senha?</h2>
          <p>Não se preocupe, clique no link mágico abaixo.</p>
          <p>
            <a href="${req.protocol}://localhost:3000/reset-password?token=${token}" target="_blank">
              Recuperar senha.
            </a>
          </p>
        `,
      });
      
      return res.render('session/forgot', {
        success: 'Verifique seu email para recuperar sua senha.'
      });
    } catch (err) {
      console.error(err);

      return res.render('session/forgot', {
        error: 'Erro inesperado, por favor tente novamente.'
      });
    }
  },

  formReset(req, res) {
    return res.render('session/reset', { token: req.query.token });
  },
};