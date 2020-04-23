const currentPage = location.pathname;
const menuItens = document.querySelectorAll('header nav a');
const filter = document.querySelector('#search');

for (item of menuItens) {
  if (currentPage.includes(item.getAttribute('href'))) {
    if (currentPage == '/recipes') {
      filter.classList.add('active')
    }
    item.classList.add('active')
  }
}

const ImagesUploadRecipes = {
  input: '',
  uploadLimit: 5,
  files: [],
  preview: document.querySelector('#images-preview'),
  handleFileInput(event) {
    const { files: fileList } = event.target;
    ImagesUploadRecipes.input = event.target;
    
    if (ImagesUploadRecipes.hasLimit(event)) return

    Array.from(fileList).forEach(file => {
      ImagesUploadRecipes.files.push(file);

      const reader = new FileReader();

      reader.onload = () => {
        const image = new Image();
        image.src = String(reader.result);

        const container = ImagesUploadRecipes.getContainer(image);
        ImagesUploadRecipes.preview.appendChild(container);
      }

      reader.readAsDataURL(file);
    });

    ImagesUploadRecipes.input.files = ImagesUploadRecipes.getAllFiles();
  },

  hasLimit(event) {
    const { uploadLimit, input, preview } = ImagesUploadRecipes;
    const { files: fileList } = input;

    if (fileList.length > uploadLimit) {
      alert(`Envie no máximo ${uploadLimit} imagens.`);
      event.prefentDefault();
      return true;
    }

    const imagesContainer = [];
    preview.childNodes.forEach(item => {
      if (item.classList && item.classList.value == 'image')
        imagesContainer.push(item)
    })

    const totalImages = fileList.length + imagesContainer.length;

    if (totalImages > uploadLimit) {
      alert('Você atingiu o limite máximo de imagens.')
      event.prefentDefault();
      return true;
    }

    return false;
  },

  getAllFiles() {
    const dataTransfer = new DataTransfer();

    ImagesUploadRecipes.files.forEach(file => dataTransfer.items.add(file));

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
      const removeImage = document.querySelector('input[name="removed_images"]');

      if(removeImage)
        removeImage.value += `${imageDiv.id},`
      
      
    }

    imageDiv.remove()
  }
};

const ImagesUploadChefs = {
  input: '',
  uploadLimit: 1,
  files: [],
  preview: document.querySelector('#images-preview'),
  handleFileInput(event) {
    const { files: fileList } = event.target;
    ImagesUploadChefs.input = event.target;
    
    if (ImagesUploadChefs.hasLimit(event)) return

    Array.from(fileList).forEach(file => {
      ImagesUploadChefs.files.push(file);

      const reader = new FileReader();

      reader.onload = () => {
        const image = new Image();
        image.src = String(reader.result);

        const container = ImagesUploadChefs.getContainer(image);
        ImagesUploadChefs.preview.appendChild(container);
      }

      reader.readAsDataURL(file);
    });

    ImagesUploadChefs.input.files = ImagesUploadChefs.getAllFiles();
  },

  hasLimit(event) {
    const { uploadLimit, input, preview } = ImagesUploadChefs;
    const { files: fileList } = input;

    if (fileList.length > uploadLimit) {
      alert(`Envie no máximo ${uploadLimit} imagens.`);
      event.prefentDefault();
      return true;
    }

    const imagesContainer = [];
    preview.childNodes.forEach(item => {
      if (item.classList && item.classList.value == 'image')
        imagesContainer.push(item)
    })

    const totalImages = fileList.length + imagesContainer.length;

    if (totalImages > uploadLimit) {
      alert('Você atingiu o limite máximo de imagens.')
      event.prefentDefault();
      return true;
    }

    return false;
  },

  getAllFiles() {
    const dataTransfer = new DataTransfer();

    ImagesUploadChefs.files.forEach(file => dataTransfer.items.add(file));

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
      const removeImage = document.querySelector('input[name="removed_images"]');

      if(removeImage)
        removeImage.value += `${imageDiv.id}`
    }

    imageDiv.remove()
  }
};

const ImageGallery = {
  highlight: document.querySelector('.highlight img'),
  previews: document.querySelectorAll('.gallery-preview img'),
  setImage(event) {
    const { target } = event;

    ImageGallery.previews.forEach(image => image.classList.remove('active'))
    target.classList.add('active');

    ImageGallery.highlight.src = target.src;
    ImageGallery.highlight.alt = target.alt;
  }
};