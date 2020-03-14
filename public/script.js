const currentPage = location.pathname;
const menuItens = document.querySelectorAll("header nav a");

for (item of menuItens) {
  if (currentPage.includes(item.getAttribute("href"))) {
    item.classList.add("active")
  }
}
