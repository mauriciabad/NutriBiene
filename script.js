function startSurvey() {
  document.getElementById("section-profile").style.opacity = 0;
  document.getElementsByTagName("header")[0].style.opacity = 0;
  document.getElementsByTagName("footer")[0].style.opacity = 0;
  location.assign("https://picsoung.typeform.com/to/DBVdEq");
}

function login(name) {
  showSection('diet');
  getMenuFromUser(name);
}

function showSection(name) {
  for (let section of document.getElementsByClassName('section-active')) {    
    section.classList.remove('section-active');
    section.classList.add('section-hidden');  
  }
  document.getElementById("section-"+name).classList.remove('section-hidden');  
  document.getElementById("section-"+name).classList.add('section-active');  

  for (let footer of document.getElementsByClassName('footer-active')) {    
    footer.classList.remove('footer-active');
  }
  document.getElementById("footer-"+name).classList.add('footer-active');  
}
function getMenuFromUser(name) {
  //TODO ajax
}