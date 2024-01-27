

var signInError=document.getElementById("error");
var password = document.getElementById("myInput");
var username= document.getElementById("myUsername");
var dex; 

function get_dex(){
  const req = new XMLHttpRequest();
  response = req.open("GET", api/dex);
  json_text = JSON.parse(response)
  dex = json_text.compiled_rankings

}

function togglePassword() {
    var password = document.getElementById("myInput");
    if (password.type === "password") {
      password.type = "text";
    } else {
      password.type = "password";
    }
  }

function redirectLoginPage(){
    logInGet()
    location.replace("./loginPage.html");
}

function redirectMainPage(){
  password = document.getElementById("myInput");
  username = document.getElementById("myUsername");
  
  if(password.innerHTML!="" && username.innerHTML!=""){
    location.replace("./main.html");
  }else{
    signInError.innerHTML="Please input a valid input or username";
  }
  
}
function dud(event){event.preventDefault();}

function submitForm(event){
  document.getElementById("myUsername").submit();
  document.getElementById("myInput").submit();

}

function logInGet(event){
  event.preventDefault();
  submitForm(event);
  var xmlhttp = new XMLHttpRequest(); 
  xmlhttp.onreadystatechange = function(){
  if (this.readyState == 4 && this.status == 200){
    var myArr = JSON.parse(this.responseText);
    if (myArr['status_response'] == 'True'){
      location.replace("./main.html");
      }
    }
  }
  xmlhttp.open("GET", "/api/login", true);
  xmlhttp.send(); 
}




entry=document.getElementById("entry");
entry.style.display = "none";
x=1;

function cloneDex(){
  document.getElementById("grid-img").src="../assets/oqsdgp8y6y.jpg";
  document.getElementById('grid-text').innerHTML = x;
  
  dexclone=entry.cloneNode(true);
  dexclone.style.display="block";
  
  document.getElementById("grid-container").appendChild(dexclone);
  x = x + 1;
  
}

function cloneDexTEST(){
  

  var object = JSON.parse('{"status": true, "self": true, "dex": [{"hid": 1, "name": "Snapdragon", "description": "", "picture": "static/images/36c3aa048d72198261514faa755038c9e2e8e2a9c588f385e87335bcee458811.jpg", "grade": "C", "type": "P", "ranking": 0, "total_ranking": 1}, {"hid": 2, "name": "Baja fairy duster", "description": "", "picture": "static/images/420ccd1154752150593c15dbd035f852b4601d0fbe83e0434922ec554aec35ce.jpg", "grade": "R", "type": "P", "ranking": 0, "total_ranking": 1}, {"hid": 3, "name": "Date palm", "description": "", "picture": "static/images/8d9c2d4c70cb5f903a927f1e83abbb22fd47ae6e2ba1f22efa7b75917ee73dd3.jpg", "grade": "C", "type": "P", "ranking": 0, "total_ranking": 1}, {"hid": 4, "name": "New Zealand flax", "description": "", "picture": "static/images/13abf6fb4acc22bea79967ef07c852a07671bcf219e2dbb73c842710a1d050f6.jpg", "grade": "C", "type": "P", "ranking": 0, "total_ranking": 1}, {"hid": 5, "name": "Grahams sage", "description": "", "picture": "static/images/08282d0b2e37fdca30dc64255035eb8641e4ea8edf12dfc8421ebfbd09ec268c.jpg", "grade": "C", "type": "P", "ranking": 0, "total_ranking": 1}, {"hid": 6, "name": "Crane flower", "description": "", "picture": "static/images/a1026ae76996c0d10182024cdda99dfbeebc403ca56858bd325ab3a927a18008.jpg", "grade": "E", "type": "P", "ranking": 0, "total_ranking": 1}, {"hid": 7, "name": "Calla lily", "description": "", "picture": "static/images/6359a1bb75b10c551c322b5b24824f5ed1b6ea3d8e4849d86315798089d26487.jpg", "grade": "C", "type": "P", "ranking": 0, "total_ranking": 1}]}');
  
  
  for(var index = 0; index < object.dex.length; index++){
    document.getElementById("grid-img").src = object.dex[index].picture;
    var rarity="("+object.dex[index].ranking+"/"+object.dex[index].total_ranking+")";
  
    document.getElementById('grid-text').innerHTML = object.dex[index].name + " " + rarity;
  
    dexclone=entry.cloneNode(true);
    dexclone.style.display="block";
  
    document.getElementById("grid-container").appendChild(dexclone);
  }

  
  
  
}


function showPreview(event) {
  if (event.target.files.length > 0){
    var src = URL.createObjectURL(event.target.files[0]);
    var preview = document.getElementById("preview");
    preview.src=src;
    preview.style.display="block";
  }
  
}