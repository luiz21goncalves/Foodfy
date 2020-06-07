const { randomBytes } = require('crypto');
const { hash } = require('bcryptjs');
const faker = require('faker');

const User = require('./src/app/models/User');
const Chef = require('./src/app/models/Chef');
const Recipe = require('./src/app/models/Recipe');

const mailer = require('./src/lib/mailer');

const totalUsers = 6;
let usersIds = [];

/**
 * "id" serial PRIMARY KEY,
  "name" text NOT NULL,
  "email" text UNIQUE NOT NULL,
  "password" text NOT NULL,
  "reset_token" text,
  "reset_token_expires" text,
  "is_admin" boolean DEFAULT false,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
 */

async function createUser() {
  const users = [];
  const password = await hash('123456', 8);

  while (users.length < totalUsers) {
    users.push({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password,
      is_admin: faker.random.boolean(),
    });
  }

  const usersPromise = users.map((user) => User.create(user));
  usersIds = await Promise.all(usersPromise);
}

async function init() {
  await createUser();
}

init();
// module.exports = {
//   async post(req, res) {
//     try {
//       const  name = 'Admin Foodfy',
//         email = 'admin@foodfy.com.br';

//       const user = await User.findOne({ where: { email } });

//       if (user)
//         return res.render('home/create-admin', {
//           error: 'Usuário  já cadastrado, <a href="/login">faça login</a> ou <a href="/forgot-password">recupere sua senha</a>.'
//         });

//       const password = crypto.randomBytes(4).toString('hex');
//       const passwordHash = await bcrypt.hash(password, 8);

//       const data = { name, email, password: passwordHash, isAdmin: true }

//       await User.create(data);

//       await mailer.sendMail({
//         to: email,
//         from: 'no-replay@foodfy.com.br',
//         subject: 'Bem-vindo ao  Foodfy',
//         html:`
//           <h2>${name} seja bem-vindo.</h2>
//           <p>Seu acesso ao <b>Foodfy</b> está aqui.</p>
//           <p>
//             Faça seu login <a href="${req.protocol}://localhost:3000/login" target="_blank">clicando aqui</a>.
//           </p>
//           <p>
//             Essa é sua senha <b>${password}</b> de acesso.
//           </p>
//         `,
//       });

//       return res.render('home/create-admin', {
//         success: `Usuário ${name} criado com sucesso. Acesse o email ${email} para acessar o sistema.`,
//       });
//     } catch (err) {
//       console.error(err);

//       return res.render('home/create-admin', {
//         error: 'Desculpe, não foi possível criar esse usuário.'
//       });
//     }
//   },
// };
