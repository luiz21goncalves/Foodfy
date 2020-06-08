const { hash } = require('bcryptjs');
const faker = require('faker');
const fs = require('fs');
const path = require('path');

const User = require('./src/app/models/User');
const Chef = require('./src/app/models/Chef');
const Recipe = require('./src/app/models/Recipe');
const File = require('./src/app/models/File');

const totalUsers = 4;
const totalChefs = 8;
const usersIds = [];
const chefsIds = [];

async function createUsers() {
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

  usersIds.push(await Promise.all(users.map((user) => User.create(user))));
}

/**
 * recipes  
 * 
 * 'anastasia-zhenina.jpg',
'asinhas.png',
'burger.png',
'doce.png',
'espaguete.png',
'izzah.jpg',
'kiser-taylor.jpg',
'lasanha.png',
'mathilda-khoo.jpg',
'nick-bratanek.jpg',
'pizza.png',
'praise-adesina.jpg',
'stacey-doyle.jpg',
'taylor-kiser.jpg',
 */

async function createChefs() {
  const chefs = [];
  const files = [];

  const filesName = [
    'andre-noboa.jpg',
    'conor-samuel.jpg',
    'jeff-siepman.jpg',
    'jose-antonio-gallego-vazquez.jpg',
    'louis-hansel.jpg',
    'redcharlie.jpg',
    'ross-sneddon.jpg',
    'stefan-c-asafti.jpg',
  ];

  function copyFile() {
    const fileLength = faker.random.number({
      min: 0,
      max: filesName.length - 1,
    });
    const origianalName = filesName[fileLength];
    const newName = `${faker.random.number(9999999999)}-${origianalName}`;

    const pathIn = fs.createReadStream(
      path.resolve(__dirname, 'seeds', 'chefs', `${origianalName}`)
    );
    const pathOut = fs.createWriteStream(
      path.resolve(__dirname, 'public', 'images', `${newName}`)
    );

    const WriteStream = pathIn.pipe(pathOut);

    return {
      path: WriteStream.path.replace(`${path.resolve(__dirname)}/`, ''),
      origianalName,
      newName,
    };
  }

  while (files.length < totalChefs) {
    const file = copyFile();

    files.push({
      name: file.newName,
      original_name: file.origianalName,
      path: file.path,
    });
  }

  const filesIds = await Promise.all(files.map((file) => File.create(file)));

  while (chefs.length < totalChefs) {
    chefs.push({
      name: faker.name.findName(),
      file_id: filesIds[chefs.length],
    });
  }

  chefsIds.push(await Promise.all(chefs.map((chef) => Chef.create(chef))));
}

async function init() {
  await createUsers();
  await createChefs();
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
