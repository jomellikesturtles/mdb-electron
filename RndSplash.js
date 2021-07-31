
// window.onerror = function (msg, url, lineNo, columnNo, error) {
//     ipcRenderer.send('logger', '[SPLASH]' + error.stack);
// }; // Send window errors to Main process

// ipcRenderer.on('fade', function () {
//     document.body.style.opacity = '1';
// });
// alert(document.getElementById("message").innerHTML);
document.getElementById("message").innerHTML = "CHANGED...";

window.ipcRenderer.on("message", function (event, msg) {
  document.getElementById("message").innerHTML = msg;
  console.log("MSG:", msg);
});
