const currentPage = location.pathname;
const menuItems = document.querySelectorAll('header nav a');

for (item of menuItems) {
  if (currentPage.includes(item.getAttribute('href'))) {
    if (currentPage.includes('search') || currentPage == '/recipes') {
      const form = document.querySelector('header .content div #search');
      form.classList.add('active');
    }

    item.classList.add('active');
  }
}

const HiddenDiv = {
  hidden: false,
  apply(button) {
    const div = button.parentNode.parentNode.querySelector('.hide')
    HiddenDiv.hidden ? HiddenDiv.remove(div, button) : HiddenDiv.add(div, button)
  },
  add(div, button) {
    div.classList.add('active');
    button.innerHTML = 'mostrar';
    HiddenDiv.hidden = true;
  },
  remove(div, button) {
    div.classList.remove('active');
    button.innerHTML = 'esconder';
    HiddenDiv.hidden = false;
  }
};

function addInput(button) {
  const divItem = button.parentNode;
  const div = divItem.querySelector('div')
  const fieldContainer = divItem.querySelectorAll('.copy');

  const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);

  if (newField.children[0].value == '') return false;

  newField.children[0].value = "";
  div.appendChild(newField);
}