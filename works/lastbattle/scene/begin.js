let start = document.querySelector(".start");
start.addEventListener("click", beginGame);
function beginGame(evt) {
    window.parent.loadGameScene();
}
