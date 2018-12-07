// setInterval(function() {
//     // first parameter is the message to be passed
//     // second paramter is the domain of the parent 
//     // in this case "*" has been used for demo sake (denoting no preference)
//     // in production always pass the target domain for which the message is intended 
//     window.top.postMessage(document.body.scrollHeight, "*");
// }, 500); 