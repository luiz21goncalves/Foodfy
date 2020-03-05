const modalOverlay = document.querySelector(".modal-overlay");
const recipes = document.querySelectorAll("article");

for (let recipe of recipes) {

  recipe.addEventListener("click", function() {
    modalOverlay.classList.add("active");
    modalOverlay.querySelector("img").src = recipe.querySelector("img").src;
    modalOverlay.querySelector("p").innerHTML = recipe.querySelector("p").innerHTML;
    modalOverlay.querySelector("span").innerHTML = recipe.querySelector("span").innerHTML;
  });
};

modalOverlay.querySelector("a").addEventListener("click", function() {
  modalOverlay.classList.remove("active");
});