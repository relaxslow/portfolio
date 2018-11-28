let testContainer = document.getElementsByClassName("testContainer")[0];
let test = document.getElementsByClassName("test")[0];
let testBut = document.getElementsByClassName("testBut")[0];
testBut.addEventListener("click", clickTest, false);
test.parentNode.removeChild(test);
function clickTest(evt) {
    testContainer.append(test);
    test.style.tranform = "rotate( 7deg )";
    test.offsetWidth;
    test.style.tranform = "rotate( 50deg )"
}