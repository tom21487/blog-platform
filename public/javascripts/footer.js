let url = window.location.pathname.split('/');
let currentLanguage = url[1];

/* Change highlighting on load */
const other = currentLanguage == "en" ? "cn" : "en";
document.getElementById(currentLanguage + "Btn").classList.add("selected");
document.getElementById(other + "Btn").classList.remove("selected");

function switchTo(newLanguage) {
  if (newLanguage !== "en" && newLanguage !== "cn") {
    alert("undefined language!")
    return;
  }

  /* Redirect webpage */
  url[1] = newLanguage;
  console.log(url.join('/'));
  window.location.href = url.join('/');
}