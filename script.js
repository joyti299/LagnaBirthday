const playBtn = document.querySelector(".play-btn");
const curtain = document.getElementById("curtain");

playBtn.addEventListener("click", () => {

  // open curtain
  curtain.classList.add("curtain-open");

  // go to cake page after animation
  setTimeout(() => {
    window.location.href = "cake.html";
  }, 1500);

});