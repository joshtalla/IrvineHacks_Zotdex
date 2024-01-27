

var signInError=document.getElementById("error");
var password = document.getElementById("myInput");
var username= document.getElementById("myUsername");

function get_dex(){
  const req = new XMLHttpRequest();
  req.open("GET", api/dex);
  
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