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
    //BE VERY CAREFUL LET NO ONE EDIT THE DATA BASE HTML!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //IT IS VERY XSS ABLE AND IT IS INTEDED FOR IT TO BE POSSIBLE TO ALLOW FLEXIBILITY
    appendDrawLeaf(renderPosition, dataObject[i]["Title"], dataObject[i]["Description"],dataObject[i]["InnerHtml"],dataObject[i]["Icon"]);
  }
}

function appendDrawLeaf(position,title,description,innerHtml,icon){
  //BE VERY CAREFUL LET NO ONE EDIT THE DATA BASE HTML!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  //IT IS VERY XSS ABLE AND IT IS INTEDED FOR IT TO BE POSSIBLE TO ALLOW FLEXIBILITY
  document.getElementById("horizontalPageWrapper").innerHTML+=`
  <div class="horiontalPageElement">

  <table>
  <td >
  <!--LeftHalf-->
  <div style="padding-left:10vw;padding-top: 25vh;">
  <table class="mainTitle" id="titleTable">
  <tr><td width=30%"><img src="resource/icons/`+icon+`"
  height="70em"
  width="70em"></td>
  <td width="70%"><h1>`+title+`</h1></td><tr>
  <tr><td colspan="2">
  <p>`+description+`
  </p>
  </td></tr>
  </table>
  </div>
  </div>
  </td>
  <!--RightHalf-->
  <td style"padding-left: 7vw;vertical-align: top;padding-top: 10vh">
  `+
  innerHtml+`
  </td>
  </table>
  </div>

  `
}
//call flow
//makeLeaves->loadDoc->dealWithData->appendDrawLeaf
function makeLeaves(){
  loadDoc()
}