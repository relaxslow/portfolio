
let game = document.querySelector(".game");
function loadGameScene() {
    game.style.visibility = "hidden";
    game.src = "/works/lastbattle/scene/game.html"
    game.onload = finishLoad;
}
function finishLoad(evt) {
    let game = evt.currentTarget;
    game.style.visibility = "visible";

}