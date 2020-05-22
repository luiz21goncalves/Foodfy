const User = require('../models/User');

module.exports = {
  async index(req, res) {
    const user = await User.findOne({ where: { id:req.session.userId } });
    const name = user.name.split(' ');
    user.firtName = name[0];

    return res.render('profile/index', { user });
  },
};
