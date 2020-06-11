<h1 align="center">
  <img src="public/assets/apresentacao.gif">
</h1>

<blockquote align="center">“Sua única limitação é você mesmo!”</blockquote>

---

## Sobre

O **Foodfy** é um site de receitas que foi criado dentro do curso **Bootcamp LaunchBase** com o intuito de colocarmos em prática todo conteúdo estudado durante o curso. Esse site é dividido em duas partes, uma aberta e a outra administrativa.

---

## Tecnologias utilizadas

O projeto foi desenvolvido utilizando as seguintes tecnologias

- **Express**
- **Multer**
- **Nodemailer**
- **Nunjucks**
- **postgresSQL**

---

## Como rodar o projeto

- [ ] Instale o [node](https://nodejs.org/en/download/).
- [ ] Instale o [postegresSQL](https://www.postgresql.org/download/).
- [ ] Instale o [postbird](https://www.electronjs.org/apps/postbird) ou qualquer outro cliente GUI para postgresSQL.

```bash

  # Clonar o repositório
  $ git clone https://github.com/luiz21goncalves/Foodfy.git foodfy

  # Entrar no diretório
  $ cd foodfy

  # Instalar as dependências
  $ npm i ou npm install

```

- [ ] faça uma cópia do arquivo **.env.example**, renomeie para **.env** e preencha com todas as variáveis de ambiente.

- [ ] abra o arquivo **database.sql** e copie todo seu conteúdo.

- [ ] abra seu **postbird** clique em **Query** cole e todo o conteúdo copiado anteriormente, siga as instruções do arquivo.

```bash

  # Popule o banco de dados
  $ npm run seed

  # Iniciar o projeto
  $ npm start
  
```

---
