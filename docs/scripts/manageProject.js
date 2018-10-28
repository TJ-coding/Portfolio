//ajaxing
function loadDoc(DataUrl,responseFunction) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
     responseFunction(this.responseText);
   }
 };
 xhttp.open("GET", DataUrl, true);
 xhttp.send();
}

function dealWithData(dataString){
  var dataObject=JSON.parse(dataString)["projectDatabase"];
  var numberOfProjects=dataObject.length;
  for (var i = 0; i < numberOfProjects; i++) {
    //BE VERY CAREFUL LET NO ONE EDIT THE DATA BASE HTML!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //IT IS VERY XSS ABLE AND IT IS INTEDED FOR IT TO BE POSSIBLE TO ALLOW FLEXIBILITY

    var description=dataObject[i]["Description"];
    var innerHTML=dataObject[i]["InnerHtml"];
    if(description.substring(0,16)=="!!!FetchData!!!:" && innerHTML.substring(0,16)=="!!!FetchData!!!:"){
    //fetch both description and innerHTML
    var responseFunction=function(responseText){
      //after fetching description
      var secondResponseFunction=function(secondResponseText){
        //after fetching  innerHTML
        appendDrawLeaf(renderPosition, dataObject[i]["Title"], responseText,secondResponseText,dataObject[i]["Icon"]);
      }
      loadDoc(description.substring(16,description.length),secondResponseFunction)
    }
    loadDoc(innerHTML.substring(16,innerHTML.length),responseFunction)
  }else if(description.substring(0,16)=="!!!FetchData!!!:"){
    //fetch description
    var responseFunction=function(responseText){
      //after fetching description
      appendDrawLeaf(renderPosition, dataObject[i]["Title"], responseText,innerHTML,dataObject[i]["Icon"]);
    }
    loadDoc(description.substring(16,description.length),responseFunction)


  }else if(innerHTML.substring(0,16)=="!!!FetchData!!!:"){
    //fetch innerHTML
    var responseFunction=function(responseText){
      //after fetching innerHTML
      appendDrawLeaf(renderPosition, dataObject[i]["Title"], description,responseText,dataObject[i]["Icon"]);

    }
        loadDoc(innerHTML.substring(16,innerHTML.length),responseFunction)

  }else{
    //don't fetch anything
    appendDrawLeaf(renderPosition, dataObject[i]["Title"], description,innerHTML,dataObject[i]["Icon"]);
  }
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
  var DataUrl="https://tj-coding.github.io/Portfolio/projectDatabase/projectDatabase.html"
  //sending function dealWithData as response function
  loadDoc(DataUrl,dealWithData)
}