let navbar = document.getElementById('navbar');
  
// Selection logic
const tabs = {
  "home": 1,
  "about": 2,
  "projects": 3,
  "blog": 4,
  "contact": 5
}
const selectedID = tabs[navbar.dataset.select];
navbar.childNodes[selectedID].classList.add("selected");

// Hamburger logic
function toggleHamburger() {
  if (navbar.className) {
    navbar.classList.remove("expanded");
  } 
  else {
    navbar.classList.add("expanded");
  }
}