//ajaxing
DataUrl="https://tj-coding.github.io/Portfolio/projectDatabase.html"

function loadDoc() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
     dealWithData(this.responseText);
    }
  };
  xhttp.open("GET", DataUrl, true);
  xhttp.send();
}

function dealWithData(dataString){
	var dataObject=JSON.parse(dataString)["projectDatabase"];
  var numberOfProjects=dataObject.length;
  var renderPosition
  for (var i = 0; i < numberOfProjects; i++) {
    if(i%2==0){
      renderPosition="right";
    }else{
      renderPosition="left";
    }
    //debugging
    alert(renderPosition+ dataObject[i]["Title"]+ dataObject[i]["InnerText"])
    //BE VERY CAREFUL LET NO ONE EDIT THE DATA BASE HTML!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //IT IS VERY XSS ABLE AND IT IS INTEDED FOR IT TO BE POSSIBLE TO ALLOW FLEXIBILITY
    appendDrawLeaf(renderPosition, dataObject[i]["Title"], dataObject[i]["InnerText"]);
  }
}

function appendDrawLeaf(position,title,innerHtml){
  var divId
  if(position=="right"){
    divId="rightBranch";
  }else{
    divId="leftBranch";
  }
  alert(position+title+innerHtml);
  alert(document.getElementById(divId))
  //BE VERY CAREFUL LET NO ONE EDIT THE DATA BASE HTML!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  //IT IS VERY XSS ABLE AND IT IS INTEDED FOR IT TO BE POSSIBLE TO ALLOW FLEXIBILITY
  document.getElementById(divId).innterHtml+=`
  <div id="projectLeaf">
    <h2 id="projectLeafTitle">`+title+`</h2>
    <p>`+innerHtml+`</p>
  </div>
  <div id="projectLeafSpace" >
  </div>
  `;
}
//call flow
//makeLeaves->loadDoc->dealWithData->appendDrawLeaf
function makeLeaves(){
	loadDoc()
}