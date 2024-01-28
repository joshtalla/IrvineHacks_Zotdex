var signInError = document.getElementById("error");
var password = document.getElementById("myInput");
var username = document.getElementById("myUsername");


function togglePassword() {
    var password = document.getElementById("myInput");
    if (password.type === "password") {
      password.type = "text";
    } else {
      password.type = "password";
    }
  }



function create_account(event){
    event.stopPropagation();
    _username = document.getElementById("myUsername").value
    _password = document.getElementById("myInput").value
    
    if (3<=_password.length <= 32){
      if (8<= _username.length <= 32){
        let req = new XMLHttpRequest();
        req.onload = function(){
          if(req.status === 200){
            let resp = JSON.parse(req.response);
            if(resp.status ){
              location.replace("profile");
            }else{
              signInError.innerHTML="Please input another password or username";
            }
          }
        }
      req.open("POST", "api/register", true);
      req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      req.send("name=" + document.getElementById("myUsername").value + "&password=" + document.getElementById("myInput").value);

      }else{
        signInError.innerHTML = "Pease input another username between 8-32"
      }
    }else{
      signInError.innerHTML = "Please input another password between 3-32"
    }
  }
  document.getElementById("submit0").addEventListener("click", create_account)



  function logInGet(event){
    event.stopPropagation();
    _username = document.getElementById("myUsername").value
    _password = document.getElementById("myInput").value
    console.log("DEBUG ckpt");
    let req = new XMLHttpRequest();
    req.onload = function(){
      if(req.status === 200){
        let resp = JSON.parse(req.response);
        if(resp.status && _username != "" && _password != ""){
          location.replace("profile");
        }else{
            signInError.innerHTML="Please input a valid password or username";
        }
      }
    }
    req.open("POST", "api/login", true);
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    req.send("name=" + _username + "&password=" + _password);
  }
  document.getElementById("submit").addEventListener("click", logInGet);
  document.getElementById("mainForm").addEventListener("submit", function(e){e.preventDefault();});