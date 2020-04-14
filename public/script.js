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
  uploadLimit: 5,
  preview: document.querySelector('#images-preview'),
  handleFileInput(event) {
    const { files: fileList } = event.target;
    
    if (ImagesUpload.hasLimit(event)) return

    Array.from(fileList).forEach(file => {
      const reader = new FileReader();

      reader.onload = () => {
        const image = new Image();
        image.src = String(reader.result);

        const container = ImagesUpload.getContainer(image);
        ImagesUpload.preview.appendChild(container);
      }

      reader.readAsDataURL(file);
    })
  },
  hasLimit(event) {
    const { uploadLimit } = ImagesUpload;

    if (fileList.length > uploadLimit) {
      alert(`Envie no máximo ${uploadLimit} imagens`)
      event.prefentDefault()
      return true;
    }

    return false;
  },
  getContainer(image) {
    const container = document.createElement('div');
    container.classList.add('image');
    container.onclick = () => alert('removido');
    container.appendChild(image);
    return container;
  }
}