const recipes = document.querySelectorAll("article");

for (let i = 0; i < recipes.length; i++) {
  recipes[i].addEventListener("click", function() {
    window.location.href = `/recipe/${ i }`
  });
};
