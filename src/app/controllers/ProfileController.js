const User = require('../models/User');

module.exports = {
  async index(req, res) {
    try {
      const user = await User.findOne({ where: { id: req.session.userId } });
      const [name] = user.name.split(' ');
      user.firstName = name;

      return res.render('profile/index', { user });
    } catch (err) {
      console.error(err);

      return res.render('profile/index', {
        error: 'Desculpe ocorreu um erro, por favor tente novamente',
      });
    }
  },

  async put(req, res) {
    const { name, email, id } = req.body;

    try {
      await User.update(id, { name, email });

      const user = await User.findOne({ where: { id } });
      const [firstName] = user.name.split(' ');
      user.firstName = firstName;

      return res.render('profile/index', {
        user,
        success: `${user.firstName} seu perfil foi atualizado com sucesso.`,
      });
    } catch (err) {
      console.error(err);

      return res.render('profile/index', {
        user: req.body,
        error: 'Desculpe ocorreu um erro, por favor tente novamente',
      });
    }
  },
};
