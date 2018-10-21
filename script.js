function startSurvey() {
  document.getElementById("section-profile").style.opacity = 0;
  document.getElementsByTagName("header")[0].style.opacity = 0;
  document.getElementsByTagName("footer")[0].style.opacity = 0;
  location.assign("https://picsoung.typeform.com/to/DBVdEq");
}

function login(name) {
  showDiet(name);
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

function showReceipt(id) {
  request(
    "https://0ii9putnfk.execute-api.eu-west-3.amazonaws.com/Pre/receipt-info",
    {"IdReceipt": id},
    "POST",
    (response) => {      
      document.getElementById('receipt-img').src = response.Image;
      document.getElementById('receipt-calories').textContent = response.Kcal;
      document.getElementById('receipt-time').textContent = response.Time;
      document.getElementById('receipt-name').textContent = response.IdReceipts;
      
      let ingr = "";
      for (let i in response.ingredients) {        
        let unit = "";
        let am = 0;
        if (response.mililiters[i] > 0) {
          unit = 'ml';
          am = response.mililiters[i];
        } else if (response.grams[i] > 0) {
          unit = 'g';
          am = response.grams[i];
        } else if (response.amounghts[i] > 0) {
          unit = 'u';
          am = response.amounghts[i];
        }

        ingr += `<li>${am + unit} - ${response.ingredients[i]}</li>`;
      }
      document.getElementById('receipt-list').innerHTML = ingr;

      showSection('receipt', true);
      history.pushState('receipt', id, "#receipt");
    });

  // showSpinner();
}

function showDiet(user) {
  request(
    "",
    {"user": user},
    "POST",
    (response) => {
      for (let rec of response) {
        
      }
      document.getElementById('receipt-img').src = response.Image;
      document.getElementById('receipt-calories').textContent = response.Kcal;
      document.getElementById('receipt-time').textContent = response.Time;
      document.getElementById('receipt-name').textContent = response.IdReceipts;


      document.getElementById('receipt-list').innerHTML = ingr;

      showSection('diet');
    });

}


var _scannerIsRunning = false;
var code = null;
startScanner();

function startScanner() {
  Quagga.init({
      inputStream: {
          name: "Live",
          type: "LiveStream",
          target: document.querySelector('#scanner-container'),
          constraints: {
              width: 480,
              height: 320,
              facingMode: "environment"
          },
      },
      decoder: {
          readers: [
              "ean_reader"
          ],
          debug: {
              showCanvas: true,
              showPatches: true,
              showFoundPatches: true,
              showSkeleton: true,
              showLabels: true,
              showPatchLabels: true,
              showRemainingPatchLabels: true,
              boxFromPatches: {
                  showTransformed: true,
                  showTransformedBox: true,
                  showBB: true
              }
          }
      },

  }, function (err) {
      if (err) {
          console.log(err);
          return
      }

      console.log("Initialization finished. Ready to start");
      Quagga.start();

      // Set flag to is running
      _scannerIsRunning = true;
  });
}

Quagga.onDetected(function (result) {
  code = result.codeResult.code;
  var url = "https://world.openfoodfacts.org/api/v0/product/"+code+".json";
  console.log("Barcode detected and processed : " + code);
  request(url, {}, "POST", (response) => {
      if(response.status_verbose == "product found"){
          console.log("In order: image, name, BieneScore, NovaScore, Ingredients from palm oil, nutrient levels(array), addtivie tags, ingredients");
          console.log(response.product.image_url);
          console.log(response.product.product_name);
          console.log(response.product.nutrition_grades);
          console.log(response.product.nova_groups);
          console.log(response.product.ingredients_that_may_be_from_palm_oil_tags);
          console.log(response.product.nutrient_levels);                        
          console.log(response.product.additives_tags);
          console.log(response.product.ingredients_text);          
      }
  });
});

Quagga.onProcessed(function (result) {
  var drawingCtx = Quagga.canvas.ctx.overlay,
  drawingCanvas = Quagga.canvas.dom.overlay;
  if (result) {
    if (result.boxes) {
      drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
      result.boxes.filter(function (box) {
        return box !== result.box;
      }).forEach(function (box) {
        Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 });
      });
    }
    if (result.box) {
      Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F", lineWidth: 2 });
    }
    if (result.codeResult && result.codeResult.code) {
      Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
    }
  }
});

function toggleBarCode() {
  if (_scannerIsRunning) {
    Quagga.stop();
  } else {
    startScanner();
  }
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