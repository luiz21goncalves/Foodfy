const currentPage = location.pathname;
const menuItems = document.querySelectorAll('header nav a');

for (const item of menuItems) {
  if (currentPage.includes(item.getAttribute('href'))) {
    if (currentPage.includes('search') || currentPage == '/recipes') {
      const form = document.querySelector('header .content div #search');
      form.classList.add('active');
    }

    if (currentPage.includes('profile')) {
      menuItems[3].classList.add('active');
    }

    item.classList.add('active');
  }
}

const HiddenDiv = {
  hidden: false,
  apply(button) {
    const div = button.parentNode.parentNode.querySelector('.hide');
    this.hidden ? this.remove(div, button) : this.add(div, button);
  },
  add(div, button) {
    div.classList.add('active');
    button.innerHTML = 'mostrar';
    this.hidden = true;
  },
  remove(div, button) {
    div.classList.remove('active');
    button.innerHTML = 'esconder';
    this.hidden = false;
  },
};

function addInput(button) {
  const divItem = button.parentNode;
  const div = divItem.querySelector('div');
  const fieldContainer = divItem.querySelectorAll('.copy');

  const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);

  if (newField.children[0].value === '') return false;

  newField.children[0].value = '';
  div.appendChild(newField);
}

const ImagesUploadRecipes = {
  input: '',
  uploadLimit: 5,
  files: [],
  preview: document.querySelector('#images-preview'),
  handleFileInput(event) {
    const { files: fileList } = event.target;
    ImagesUploadRecipes.input = event.target;

    if (ImagesUploadRecipes.hasLimit(event)) return;

    Array.from(fileList).forEach((file) => {
      ImagesUploadRecipes.files.push(file);

      const reader = new FileReader();

      reader.onload = () => {
        const image = new Image();
        image.src = String(reader.result);

        const container = ImagesUploadRecipes.getContainer(image);
        ImagesUploadRecipes.preview.appendChild(container);
      };

      reader.readAsDataURL(file);
    });

    ImagesUploadRecipes.input.files = ImagesUploadRecipes.getAllFiles();
  },

  hasLimit(event) {
    const { uploadLimit, input, preview } = ImagesUploadRecipes;
    const { files: fileList } = input;

    if (fileList.length > uploadLimit) {
      alert(`Envie no máximo ${uploadLimit} imagens.`);
      event.preventDefault();
      return true;
    }

    const imagesContainer = [];
    preview.childNodes.forEach((item) => {
      if (item.classList && item.classList.value == 'image')
        imagesContainer.push(item);
    });

    const totalImages = fileList.length + imagesContainer.length;

    if (totalImages > uploadLimit) {
      alert('Você atingiu o limite máximo de imagens.');
      event.preventDefault();
      return true;
    }

    return false;
  },

  getAllFiles() {
    const dataTransfer = new DataTransfer();

    ImagesUploadRecipes.files.forEach((file) => dataTransfer.items.add(file));

    return dataTransfer.files;
  },

  getContainer(image) {
    const container = document.createElement('div');
    container.classList.add('image');

    container.onclick = ImagesUploadRecipes.removeImage;

    container.appendChild(image);
    container.appendChild(ImagesUploadRecipes.getButtonClose());

    return container;
  },

  getButtonClose() {
    const button = document.createElement('i');
    button.classList.add('material-icons');
    button.innerHTML = 'close';

    return button;
  },

  removeImage(event) {
    const imageContainer = event.target.parentNode;
    const imagesArray = Array.from(ImagesUploadRecipes.preview.children);
    const index = imagesArray.indexOf(imageContainer);

    ImagesUploadRecipes.files.splice(index, 1);
    ImagesUploadRecipes.input = ImagesUploadRecipes.getAllFiles();

    imageContainer.remove();
  },

  removeOldImage(evet) {
    const imageDiv = event.target.parentNode;

    if (imageDiv.id) {
      const removeImage = document.querySelector(
        'input[name="removed_images"]'
      );

      if (removeImage) removeImage.value += `${imageDiv.id},`;
    }

    imageDiv.remove();
  },
};

const ImagesUploadChefs = {
  input: '',
  uploadLimit: 1,
  files: [],
  preview: document.querySelector('#images-preview'),
  handleFileInput(event) {
    const { files: fileList } = event.target;
    ImagesUploadChefs.input = event.target;

    if (ImagesUploadChefs.hasLimit(event)) return;

    Array.from(fileList).forEach((file) => {
      ImagesUploadChefs.files.push(file);

      const reader = new FileReader();

      reader.onload = () => {
        const image = new Image();
        image.src = String(reader.result);

        const container = ImagesUploadChefs.getContainer(image);
        ImagesUploadChefs.preview.appendChild(container);
      };

      reader.readAsDataURL(file);
    });

    ImagesUploadChefs.input.files = ImagesUploadChefs.getAllFiles();
  },

  hasLimit(event) {
    const { uploadLimit, input, preview } = ImagesUploadChefs;
    const { files: fileList } = input;

    if (fileList.length > uploadLimit) {
      alert(`Envie no máximo ${uploadLimit} imagem.`);
      event.preventDefault();
      return true;
    }

    const imagesContainer = [];
    preview.childNodes.forEach((item) => {
      if (item.classList && item.classList.value == 'image')
        imagesContainer.push(item);
    });

    const totalImages = fileList.length + imagesContainer.length;

    if (totalImages > uploadLimit) {
      alert('Você atingiu o limite máximo de imagens.');
      event.preventDefault();
      return true;
    }

    return false;
  },

  getAllFiles() {
    const dataTransfer = new DataTransfer();

    ImagesUploadChefs.files.forEach((file) => dataTransfer.items.add(file));

    return dataTransfer.files;
  },

  getContainer(image) {
    const container = document.createElement('div');

    container.classList.add('image');

    container.onclick = ImagesUploadChefs.removeImage;

    container.appendChild(image);
    container.appendChild(ImagesUploadChefs.getButtonClose());

    return container;
  },

  getButtonClose() {
    const button = document.createElement('i');
    button.classList.add('material-icons');
    button.innerHTML = 'close';

    return button;
  },

  removeImage(event) {
    const imageContainer = event.target.parentNode;
    const imagesArray = Array.from(ImagesUploadChefs.preview.children);
    const index = imagesArray.indexOf(imageContainer);

    ImagesUploadChefs.files.splice(index, 1);
    ImagesUploadChefs.input = ImagesUploadChefs.getAllFiles();

    imageContainer.remove();
  },

  removeOldImage(evet) {
    const imageDiv = event.target.parentNode;

    if (imageDiv.id) {
      const removeImage = document.querySelector(
        'input[name="removed_images"]'
      );

      if (removeImage) removeImage.value += `${imageDiv.id}`;
    }

    imageDiv.remove();
  },
};

const Gallery = {
  highlight: document.querySelector('.highlight img'),
  images: document.querySelectorAll('.gallery-preview img'),
  setImage(event) {
    const { target } = event;

    Gallery.images.forEach((image) => image.classList.remove('active'));
    target.classList.add('active');

    Gallery.highlight.src = target.src;
    Gallery.highlight.alt = target.alt;
  },
};

const Validate = {
  apply(input, func) {
    Validate.clearErrors(input);

    const results = Validate[func](input.value);
    input.value = results.value;

    if (results.error) return Validate.displayError(input, results.error);
  },

  clearErrors(input) {
    const messageError = document.querySelector('body .message.error');

    if (messageError) {
      messageError.remove();
      input.removeAttribute('id');
    }
  },

  displayError(input, error) {
    const messageError = document.createElement('div');
    messageError.classList.add('message');
    messageError.classList.add('error');

    const p = document.createElement('p');
    p.innerHTML = error;

    messageError.appendChild(p);
    document.querySelector('body').appendChild(messageError);

    input.setAttribute('id', 'error');
  },

  isEmail(value) {
    let error = null;
    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!value.match(mailFormat)) error = 'Email inválido';

    return { error, value };
  },
  allFields(event) {
    const items = document.querySelectorAll(
      '.item input[type=text], .item input[type=email], .item select, .item textarea'
    );

    for (const item of items) {
      if (item.value == '' && item.name != 'information') {
        const message = document.createElement('div');
        message.classList.add('message');
        message.classList.add('error');

        const messageContent = document.createElement('p');
        messageContent.innerText = 'Por favor, preencha todos os campos.';
        message.appendChild(messageContent);

        document.querySelector('body').append(message);

        event.preventDefault();
      }
    }
  },
  allFieldsChefs(event) {
    const imagesPreview = document.querySelectorAll('#images-preview .image');

    if (imagesPreview.length == 0 && ImagesUploadChefs.files.length == 0) {
      const message = document.createElement('div');
      message.classList.add('message');
      message.classList.add('error');

      const messageContent = document.createElement('p');
      messageContent.innerText = 'Por favor, envie pelo menos uma image.';
      message.appendChild(messageContent);

      document.querySelector('body').append(message);
      event.preventDefault();
    }

    this.allFields(event);
  },
  allFieldsRecipes(event) {
    const imagesPreview = document.querySelectorAll('#images-preview .image');

    if (imagesPreview.length == 0 && ImagesUploadRecipes.files.length == 0) {
      const message = document.createElement('div');
      message.classList.add('message');
      message.classList.add('error');

      const messageContent = document.createElement('p');
      messageContent.innerText = 'Por favor, envie pelo menos uma image.';
      message.appendChild(messageContent);

      document.querySelector('body').append(message);
      event.preventDefault();
    }

    this.allFields(event);
  },
};
