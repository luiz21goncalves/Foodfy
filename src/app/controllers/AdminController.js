const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const mailer = require('../../lib/mailer');
const User = require('../models/User');

module.exports = {
  async post(req, res) {
    try {
      const  name = 'Admin Foodfy',
        email = 'admin@foodfy.com.br';
      
      const user = await User.findOne({ where: { email } });

      if (user)
        return res.render('home/create-admin', {
          error: 'Usuário  já cadastrado, <a href="/login">faça login</a> ou <a href="/forgot-password">recupere sua senha</a>.'
        });
  
      const password = crypto.randomBytes(4).toString('hex');
      const passwordHash = await bcrypt.hash(password, 8);

      const data = { name, email, password: passwordHash, isAdmin: true }

      await User.create(data);

      await mailer.sendMail({
        to: email,
        from: 'no-replay@foodfy.com.br',
        subject: 'Bem-vindo ao  Foodfy',
        html:`
          <h2>${name} seja bem-vindo.</h2>
          <p>Seu acesso ao <b>Foodfy</b> está aqui.</p>
          <p>
            Faça seu login <a href="${req.protocol}://localhost:3000/login" target="_blank">clicando aqui</a>.
          </p>
          <p>
            Essa é sua senha <b>${password}</b> de acesso.
          </p>
        `,
      });

      return res.render('home/create-admin', {
        success: `Usuário ${name} criado com sucesso. Acesse o email ${email} para acessar o sistema.`,
      });
    } catch (err) {
      console.error(err);

      return res.render('home/create-admin', {
        error: 'Desculpe, não foi possível criar esse usuário.'
      });
    }
  },
};
