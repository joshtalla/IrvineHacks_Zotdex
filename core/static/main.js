var signInError = document.getElementById("error");

function capture(event){
    event.stopPropagation();
    let req = new XMLHttpRequest();
    req.onload = function(){
      if(req.status === 200){
        let resp = JSON.parse(req.response);
        if (resp.status){
          if (resp.capture===true){
            captureSuccess();
          }
          else if(resp.capture===false){
            captureFailure();

          }
          
        }
        }
        location.reload();
      }
    let formdata = new FormData(document.getElementById("mainForm"));
      
    req.open("POST", "api/capture", true);
    //req.setRequestHeader("Content-Type", "multipart/form-data");
    req.send(formdata);
    }
  document.getElementById("submit1").addEventListener("click", capture);
  document.getElementById("mainForm").addEventListener("submit", function(e){e.preventDefault();});

  function cloneDexTEST(){
    let req = new XMLHttpRequest();
    req.onload = function(){
      if (req.status === 200){
        let object = JSON.parse(req.response);
        document.getElementById("overallstats").innerHTML=object.dex.length+"/"+object.total+" of known UCI plant species found";
        document.getElementById("levels").innerHTML="Level: "+object.level+ ", XP: "+object.points+"/"+object.level*100;

        for(var index = 0; index < object.dex.length; index++){
          document.getElementById("grid-img").src = object.dex[index].picture;
          var rarity="("+object.dex[index].ranking+"/"+object.dex[index].total_ranking+")";
        
          document.getElementById('grid-text').innerHTML = object.dex[index].name + " " + rarity;
          document.getElementById("entry").style.display = "none";
          if(object.dex[index].ranking!=null){
            
            dexclone=document.getElementById("entry").cloneNode(true);
            dexclone.style.display="block";
            document.getElementById("grid-container").appendChild(dexclone);
          }
        
      }
    }
  }
  req.open("POST", "api/dex", true);
  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  req.send();
  }







  function captureSuccess(){
  
    signInError.innerHTML="GOOD JOB!";
    signInError.style.color="green";
    
    
    
  }
  
  function captureFailure(){
    signInError.innerHTML="FAILURE!";
    signInError.style.color="red";
    
  }

  

  function showPreview(event) {
    if (event.target.files.length > 0){
      var src = URL.createObjectURL(event.target.files[0]);
      var preview = document.getElementById("preview");
      preview.src=src;
      preview.style.display="block";
    }
    
    
  }
  