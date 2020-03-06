const recipes = document.querySelectorAll("article");
const paragraphs = document.querySelectorAll(".paragraphs");

for (let i = 0; i < recipes.length; i++) {
  recipes[i].addEventListener("click", function() {
    window.location.href = `/recipe/${ i }`
  });
};

for (let paragraph of paragraphs) {
  let hidden = false
  
  paragraph.querySelector(".btn-hidden").addEventListener("click", function () {
    
    if (hidden) {
      paragraph.querySelector(".recipe-hidden").classList.remove("active");
      paragraph.querySelector(".btn-hidden").innerHTML = "ESCONDER";
      hidden = false;

    } else {
      paragraph.querySelector(".recipe-hidden").classList.add("active");
      paragraph.querySelector(".btn-hidden").innerHTML = "MOSTRAR";
      hidden = true;
    }
  });
}
