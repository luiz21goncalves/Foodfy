const currentPage = location.pathname;
const menuItens = document.querySelectorAll('header nav a');
const filter = document.querySelector('#search')

for (item of menuItens) {
  if (currentPage.includes(item.getAttribute('href'))) {
    if (currentPage == '/recipes') {
      filter.classList.add('active')
    }
    item.classList.add('active')
  }
}

const ImagesUpload = {
  input: '',
  uploadLimit: 5,
  files: [],
  preview: document.querySelector('#images-preview'),
  handleFileInput(event) {
    const { files: fileList } = event.target;
    ImagesUpload.input = event.target;
    
    if (ImagesUpload.hasLimit(event)) return

    Array.from(fileList).forEach(file => {
      ImagesUpload.files.push(file);

      const reader = new FileReader();

      reader.onload = () => {
        const image = new Image();
        image.src = String(reader.result);

        const container = ImagesUpload.getContainer(image);
        ImagesUpload.preview.appendChild(container);
      }

      reader.readAsDataURL(file);
    });

    ImagesUpload.input.files = ImagesUpload.getAllFiles();
  },

  hasLimit(event) {
    const { uploadLimit, input, preview } = ImagesUpload;
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

    ImagesUpload.files.forEach(file => dataTransfer.items.add(file));

    return dataTransfer.files;
  },

  getContainer(image) {
    const container = document.createElement('div');
    
    container.classList.add('image');

    container.onclick = ImagesUpload.removeImage;
    
    container.appendChild(image);
    container.appendChild(ImagesUpload.getButtonClose());

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
    const imagesArray = Array.from(ImagesUpload.preview.children);
    const index = imagesArray.indexOf(imageContainer);

    ImagesUpload.files.splice(index, 1);
    ImagesUpload.input = ImagesUpload.getAllFiles();

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
}