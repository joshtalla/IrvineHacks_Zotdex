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
