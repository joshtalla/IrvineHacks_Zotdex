function raids(){
  let req = new XMLHttpRequest();
  req.onload = function(){
    let object = JSON.parse(req.response);
    if(req.status === 200){
      for(let i = 0; i < object.data.length; i++){
        let raidContainer = document.createElement("div");
        raidContainer.classList.add("raid-box");
        let raidImage = document.createElement("img");
        raidImage.src = object.data[i].objective.picture;
        raidContainer.appendChild(raidImage);
        let raidContainerInner = document.createElement("div");
        raidContainerInner.classList.add("adjust");
        let label1 = document.createElement("h2");
        label1.textContent = object.data[i].objective.name;
        let label2 = document.createElement("p");
        let startDate = new Date(object.data[i].start * 1000).toTimeString();
        startDate = startDate.substring(0, startDate.indexOf("(") - 1);
        label2.textContent = "Start: "+startDate;
        let label3 = document.createElement("p");
        let endDate = new Date(object.data[i].end * 1000).toTimeString();
        endDate = endDate.substring(0, endDate.indexOf("(") - 1);
        label3.textContent = "End: "+endDate;
        let label4 = document.createElement("p");
        label4.textContent = "Duration: "+String(object.data[i].duration_minutes) + " minutes";
        let label5 = document.createElement("p");
        label5.textContent = "Rewards: " + String(object.data[i].reward) + " XP";
        let label6 = document.createElement("p");
        label6.textContent = "Completed By " + String(object.data[i].completions) + " Players";
        raidContainerInner.appendChild(label1);
        raidContainerInner.appendChild(label2);
        raidContainerInner.appendChild(label3);
        raidContainerInner.appendChild(label4);
        raidContainerInner.appendChild(label5);
        raidContainerInner.appendChild(label6);
        raidContainer.appendChild(raidContainerInner);
        document.getElementById("challenge-list").appendChild(raidContainer);
      }
    }
  }
  req.open('POST', "api/raids", true);
  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded" );
  req.send();

}
