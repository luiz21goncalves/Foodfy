const User = require('../models/User');

module.exports = {
  async index(req, res) {
    const user = await User.findOne({ where: { id:req.session.userId } });
    const name = user.name.split(' ');
    user.firstName = name[0];

    return res.render('profile/index', { user });
  },

  async put(req, res) {
    try {
      const { name, email, id } = req.body;

      await User.update(id, { name, email });
  
      const user = await User.findOne({ where: { id } });
      const firstName = user.name.split(' ');
      user.firstName = firstName[0];
  
      return res.render('profile/index', {
        user,
        success: `${user.firstName} seu perfil foi atualizado com sucesso.`
      });
    } catch (err) {
      console.error(err);

      return res.render('profile/index', {
        user: req.body,
        error: 'Erro inesperado, por favor tente novamente. '
      })
    }
  },
};
