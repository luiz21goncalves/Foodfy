const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const { hash } = require('bcryptjs');
const { randomBytes } = require('crypto');
const faker = require('faker');
const fs = require('fs');

faker.locale = 'pt_BR';

const User = require('./src/app/models/User');
const Chef = require('./src/app/models/Chef');
const Recipe = require('./src/app/models/Recipe');
const RecipeFile = require('./src/app/models/RecipeFile');
const File = require('./src/app/models/File');

const totalUsers = process.env.TOTAL_USERS;
const totalChefs = process.env.TOTAL_CHEFS;
const totalRecipes = process.env.TOTAL_RECIPES;
const totalImagePerRecipe = 2;
let usersIds;
let chefsIds;

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

  usersIds = await Promise.all(users.map((user) => User.create(user)));
}

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
    const fileLength = faker.random.number(filesName.length - 1);
    const origianalName = filesName[fileLength];
    const newName = `${randomBytes(14).toString('hex')}-${origianalName}`;

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

  chefsIds = await Promise.all(chefs.map((chef) => Chef.create(chef)));
}

async function createRecipes() {
  const recipes = [];
  const files = [];
  const recipeFiles = [];

  while (recipes.length < totalRecipes) {
    const max = 16;
    const min = 4;
    const ingredients = [];
    const preparation = [];

    while (ingredients.length < faker.random.number({ min, max })) {
      ingredients.push(faker.lorem.words(faker.random.number({ min, max })));
    }

    while (preparation.length < faker.random.number({ min, max })) {
      preparation.push(faker.lorem.lines(1));
    }

    recipes.push({
      chef_id: chefsIds[faker.random.number({ min: 0, max: totalChefs - 1 })],
      user_id: usersIds[faker.random.number({ min: 0, max: totalUsers - 1 })],
      title: faker.name.title(),
      ingredients: ingredients.join(','),
      preparation: preparation.join(','),
      information: faker.lorem.paragraphs(faker.random.number(2)),
    });
  }

  const recipesIds = await Promise.all(
    recipes.map((recipe) => Recipe.create(recipe))
  );

  const filesName = [
    'anastasia-zhenina.jpg',
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
  ];

  function copyFile() {
    const fileLength = faker.random.number(filesName.length - 1);
    const origianalName = filesName[fileLength];
    const newName = `${randomBytes(14).toString('hex')}-${origianalName}`;

    const pathIn = fs.createReadStream(
      path.resolve(__dirname, 'seeds', 'recipes', `${origianalName}`)
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

  while (files.length < totalRecipes * totalImagePerRecipe) {
    const file = copyFile();

    files.push({
      name: file.newName,
      original_name: file.origianalName,
      path: file.path,
    });
  }

  const filesIds = await Promise.all(files.map((file) => File.create(file)));

  while (recipeFiles.length < totalRecipes * totalImagePerRecipe) {
    if (recipeFiles.length < totalRecipes) {
      recipeFiles.push({
        recipe_id: recipesIds[recipeFiles.length],
        file_id: filesIds[recipeFiles.length],
      });
    } else {
      recipeFiles.push({
        recipe_id: recipesIds[recipeFiles.length - totalRecipes],
        file_id: filesIds[recipeFiles.length],
      });
    }
  }

  await Promise.all(
    recipeFiles.map((recipeFile) => RecipeFile.create(recipeFile))
  );
}

async function init() {
  await createUsers();
  await createChefs();
  await createRecipes();
}

init();
