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
<<<<<<< HEAD
    //debugging
    alert(renderPosition+ dataObject[i]["Title"]+ dataObject[i]["InnerText"])
=======
>>>>>>> parent of 577e77f... Added alert for debugging
    //BE VERY CAREFUL LET NO ONE EDIT THE DATA BASE HTML!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //IT IS VERY XSS ABLE AND IT IS INTEDED FOR IT TO BE POSSIBLE TO ALLOW FLEXIBILITY
    appendDrawLeaf(renderPosition, dataObject[i]["Title"], dataObject[i]["InnerText"]);
  }
}

function appendDrawLeaf(position,title,innterHtml){
  var divId
  if(position=="right"){
    divId="rightBranch"
  }else{
    divId="leftBranch"
  }
  //BE VERY CAREFUL LET NO ONE EDIT THE DATA BASE HTML!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  //IT IS VERY XSS ABLE AND IT IS INTEDED FOR IT TO BE POSSIBLE TO ALLOW FLEXIBILITY
<<<<<<< HEAD
<<<<<<< HEAD
  document.getElementById(divId).innterHtml+="\
  <div id='projectLeaf'>\
    <h2 id='projectLeafTitle'>"+title+"</h2>\
    <p>"+innerHtml+"</p>\
  </div>\
  <div id='projectLeafSpace+' >\
  </div>\
  ";
=======
  document.getElementById(divId).innterHtml+=`
  <div id="projectLeaf">
    <h2 id="projectLeafTitle">`+title+`</h2>
    <p>`+innterHtml+`</p>
=======
  document.getElementById(divId).innterHtml+=`
  <div id="projectLeaf">
    <h2 id="projectLeafTitle">`+title+`</h2>
    <p>`+innerHtml+`</p>
>>>>>>> parent of 65899d6... re wrote multi line string from ` to "\
  </div>
  <div id="projectLeafSpace" >
  </div>
  `;
<<<<<<< HEAD
>>>>>>> parent of 71a547a... Added more alert functions for debuging
=======
>>>>>>> parent of 65899d6... re wrote multi line string from ` to "\
}
//call flow
//makeLeaves->loadDoc->dealWithData->appendDrawLeaf
function makeLeaves(){
	loadDoc()
}