

// notes : api/user for xp, id, nickname
function raids(){
    let req = new XMLHTTPRequest();
    req.onload() =function(){
      if(req.status === 200){
        let obj = JSON.parse(req.response);

      }
    }
    req.open('POST', "api/challenges/raids", true);
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded" );
    req.send();

  }

function users(){
    let req = new XMLHTTPRequest();
    req.onload() = function(){
        if(req.status === 200){
            let obj = JSON.parse(req.response);

        }
    }
    req.open("POST", "api/users", true);
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
}
