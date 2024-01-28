

// notes : api/user for xp, id, nickname

function users(){
    let req = new XMLHTTPRequest();
    req.onload() = function(){
        if(req.status === 200){
            let obj = JSON.parse(req.response);

        }
    }
    req.open("POST", "api/users", true);
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    req.send();
}

function raids(){
  let req = new XMLHTTPRequest();
  req.onload() =function(){
    if(req.status === 200){
      
      plantname = document.getElementById("plant-name");
      plantimg= document.getElementById("plant-img");
      start = document.getElementById("start");
      end= document.getElementById("end");
      duration = document.getElementById("duration");
      playcomp= document.getElementById("playcomp");
      rewards=document.getElementById("rewards");
      
      for(let i=0;i<3;i++){
        plantname.innerHTML=object[i].objective.name;
        plantimg.src=object[i].objective.picture;
        start.innerHTML="Start: "+object[i].start;
        end.innerHTML="End: "+object[i].end;
        duration.innerHTML="Duration: "+object[i].duration_minutes;
        playcomp.innerHTML="Player Completions: "+object[i].objective.completions;
        rewards.innerHTML="Rewards: "+object[i].reward;
      }
    }
  }
  req.open('POST', "api/challenges/raids", true);
  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded" );
  req.send();

}
