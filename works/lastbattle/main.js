
let game = document.querySelector(".game");
window.game = game;//focus when click game in iframe 
function loadGameScene() {
    game.style.visibility = "hidden";
    game.src = "/works/lastbattle/scene/game.html"
    game.onload = finishLoad;
}
function finishLoad(evt) {
    let game = evt.currentTarget;
    game.style.visibility = "visible";

}