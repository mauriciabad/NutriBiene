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

function showSection(name, activity=false) {
  for (let section of document.getElementsByClassName('section-active')) {    
    section.classList.remove('section-active');
    section.classList.add('section-hidden');  
  }
  document.getElementById("section-"+name).classList.remove('section-hidden');  
  document.getElementById("section-"+name).classList.add('section-active');  

  if (!activity) {
    for (let footer of document.getElementsByClassName('footer-active')) {    
      footer.classList.remove('footer-active');
    }
    document.getElementById("footer-"+name).classList.add('footer-active');  
  }
}
function getMenuFromUser(name) {
  //TODO ajax
}

function showReceipt(id) {
  request(
    "https://0ii9putnfk.execute-api.eu-west-3.amazonaws.com/Pre/receipt-info",
    {"IdReceipt": id},
    "POST",
    (response) => {
      console.log(response);
      
    });
    showSection('receipt', true);
    history.pushState('receipt', id, "#receipt");

  // showSpinner();
}

window.onpopstate = (event) => {
  if (event.state != 'receipt') {
    showSection('diet');
  }
};




function request(url, data, method, callback) {
  var xhttp = new XMLHttpRequest();
  xhttp.overrideMimeType('application/json');
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      let response = {};
      try{
        response = JSON.parse(xhttp.responseText)
      }catch(e){
        response = {"error": 'Unable to parse this response: \n'+xhttp.responseText};
      }
      if (response.error != undefined) {
        console.error(response.error);
      }else{
        callback(response);
      }
    }
  }

  if(method == 'GET'){
    xhttp.open('GET', url+'?'+urlQueryEncode(data), true);
    xhttp.send();
  }
  else if(method == 'POST'){
    xhttp.open('POST', url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(data));
  }
}

function urlQueryEncode(data={}) {  
  return (data === null) ? '' : Object.keys(data)
  .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
  .join('&');
}