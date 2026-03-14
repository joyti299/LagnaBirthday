const playBtn = document.querySelector(".play-btn");

playBtn.addEventListener("click", () => {
  setTimeout(() => {
    window.location.href = "cake.html";
  }, 500);
});