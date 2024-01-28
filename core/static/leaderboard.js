placement = document.getElementById("leaderboard").lastChild;
const obj= JSON.parse('{"status": true, "self": true, "dex": [{"hid": 1, "name": "Snapdragon", "description": "", "picture": "static/images/36c3aa048d72198261514faa755038c9e2e8e2a9c588f385e87335bcee458811.jpg", "grade": "C", "type": "P", "ranking": 0, "total_ranking": 1}, {"hid": 2, "name": "Baja fairy duster", "description": "", "picture": "static/images/420ccd1154752150593c15dbd035f852b4601d0fbe83e0434922ec554aec35ce.jpg", "grade": "R", "type": "P", "ranking": 0, "total_ranking": 1}, {"hid": 3, "name": "Date palm", "description": "", "picture": "static/images/8d9c2d4c70cb5f903a927f1e83abbb22fd47ae6e2ba1f22efa7b75917ee73dd3.jpg", "grade": "C", "type": "P", "ranking": 0, "total_ranking": 1}, {"hid": 4, "name": "New Zealand flax", "description": "", "picture": "static/images/13abf6fb4acc22bea79967ef07c852a07671bcf219e2dbb73c842710a1d050f6.jpg", "grade": "C", "type": "P", "ranking": 0, "total_ranking": 1}, {"hid": 5, "name": "Graham\'s sage", "description": "", "picture": "static/images/08282d0b2e37fdca30dc64255035eb8641e4ea8edf12dfc8421ebfbd09ec268c.jpg", "grade": "C", "type": "P", "ranking": 0, "total_ranking": 1}, {"hid": 6, "name": "Crane flower", "description": "", "picture": "static/images/a1026ae76996c0d10182024cdda99dfbeebc403ca56858bd325ab3a927a18008.jpg", "grade": "E", "type": "P", "ranking": 0, "total_ranking": 1}, {"hid": 7, "name": "Calla lily", "description": "", "picture": "static/images/6359a1bb75b10c551c322b5b24824f5ed1b6ea3d8e4849d86315798089d26487.jpg", "grade": "C", "type": "P", "ranking": 0, "total_ranking": 1}]}')


/*
function myFunction() {
    for(var i=0;i<obj.user.length;i++){
        placeclone = placement.cloneNode(true);
        placeclone.innerHTML=obj.user[i].nickname;
        placeclone.style.visibility="block";
        document.getElementById("leaderboard").appendChild(placeclone);
    }
    placement.remove();
}
*/


function leaderboard(){
    let req = new XMLHttpRequest();

    req.onload = function(){
      if (req.status === 200){
        let obj = JSON.parse(req.response)
          for(var i=0;i<obj.table.length && i<10;i++){
            placeclone = placement.cloneNode(true);
            placeclone.innerHTML=obj.table[i].user + " (" +obj.table[i].count+" catches)";
            placeclone.style.visibility="block";
            document.getElementById("leaderboard").appendChild(placeclone);
        }
        if(obj.self.place>10){
          document.getElementById('userplace').setAttribute('start', obj.self.place);
          document.getElementById('userplace').firstChild.innerHTML=obj.self.name+"(You) "+obj.self.count;
        }else{
          document.getElementById("dots").style.display = "none";
          document.getElementById('userplace').style.display = "none";
        }
       

        placement.remove();
            
        }
      }
    req.open("POST", "api/leaderboard/count", true);
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    req.send()
    }
document.getElementById("ld").addEventListener("click", leaderboard);