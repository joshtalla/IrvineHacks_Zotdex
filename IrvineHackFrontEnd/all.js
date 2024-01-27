

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

entry=document.getElementById("entry");
function cloneDex(){
  dexclone=entry.cloneNode(true)
  document.getElementById("grid-container").appendChild(dexclone);
}