//submit check
// let normalBoxs = document.querySelectorAll(".normalBox");
// for (let i = 0; i < normalBoxs.length; i++) {
//     const normalBox = normalBoxs[i];
//     let inputs = normalBox.querySelectorAll("input");
//     for (let j = 0; j < inputs.length; j++) {
//         const input = inputs[j];
//         input.normalBox = normalBox;
//     }

// }
let inputs = document.querySelectorAll("input");

function validate() {
    let mistake = 0;
    for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        if (input.value === "") {
            input.parentNode.classList.add("alertBox");
            mistake++;
        } else {
            input.parentNode.classList.remove("alertBox");
        }

    }
    if (mistake == 0)
        return true;
    else
        return false;
}
