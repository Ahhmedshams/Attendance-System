window.addEventListener("load", function () {
  setTimeout(() => {
    location.href =
      "http://127.0.0.1:5500/home.html";
  }, 5000);

  setInterval(()=>{
    let width = document.querySelector('.progress-bar').style.width.split('%')[0];
    document.querySelector('.progress-bar').style.width = `${parseInt(width)+2}%`;
    },100)
});
