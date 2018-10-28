//ajaxing
//accept url to sendd ajax to, response function that is called on ready and array argument that is attached to the response function
function loadDoc(DataUrl,responseFunction,arrayArg) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
     responseFunction(this.responseText,arrayArg);
   }
 };
 xhttp.open("GET", DataUrl, true);
 xhttp.send();
}

function dealWithData(dataString,arrayArg){
  arrayArg="" //this method accept no array argument
  var dataObject=JSON.parse(dataString)["projectDatabase"];
  var numberOfProjects=dataObject.length;
  for (var i = 0; i < numberOfProjects; i++) {
    //BE VERY CAREFUL LET NO ONE EDIT THE DATA BASE HTML!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //IT IS VERY XSS ABLE AND IT IS INTEDED FOR IT TO BE POSSIBLE TO ALLOW FLEXIBILITY

    var description=dataObject[i]["Description"];
    var innerHTML=dataObject[i]["InnerHtml"];
    var responseArg = {"title":dataObject[i]["Title"],"description":dataObject[i]["Description"],"innerHTML":dataObject[i]["innerHTML"],"icon":dataObject[i]["icon"]};
    if(description.substring(0,16)=="!!!FetchData!!!:" && innerHTML.substring(0,16)=="!!!FetchData!!!:"){
    //fetch both description and innerHTML
    //appending description url to array
    responseArg.descriptionLocation=description.substring(16,description.length);
    responseArg.innerHTMLLocation=innerHTML.substring(16,innerHTML.length);
    var responseFunction=function(responseText,arrayArg){
      //after fetching description
      arrayArg.description=responseText;
      var secondResponseFunction=function(secondResponseText,arrayArg2){
        //after fetching  innerHTML
        arrayArg2.innerHTML=secondResponseText;
        appendDrawLeaf(arrayArg2["title"], arrayArg2["description"],arrayArg2["innerHTML"],arrayArg2["Icon"]);
      }
      loadDoc(arrayArg2["innerHTMLLocation"],secondResponseFunction,arrayArg)
    }
    loadDoc(responseArg["descriptionLocation"],responseFunction,responseArg)
  }else if(description.substring(0,16)=="!!!FetchData!!!:"){
    //fetch description
    responseArg.descriptionLocation=description.substring(16,description.length);
    var responseFunction=function(responseText,arrayArg){
      //after fetching description
      arrayArg.description=responseText;
      appendDrawLeaf(arrayArg["title"], arrayArg["description"],arrayArg["innerHTML"],arrayArg["Icon"]);
    }
    loadDoc(responseArg["descriptionLocation"],responseArg)


  }else if(innerHTML.substring(0,16)=="!!!FetchData!!!:"){
    //fetch innerHTML
    responseArg.innerHTMLLocation=innerHTML.substring(16,innerHTML.length);
    var responseFunction=function(responseText){
      //after fetching innerHTML
      arrayArg.innerHTML=responseText;
      appendDrawLeaf(arrayArg["title"], arrayArg["description"],arrayArg["innerHTML"],arrayArg["Icon"]);
    }
        loadDoc(arrayArg["innerHTMLLocation"],responseFunction,responseArg)

  }else{
    //don't fetch anything
    appendDrawLeaf(dataObject[i]["Title"], description,innerHTML,dataObject[i]["Icon"]);
  }
}
}

function appendDrawLeaf(title,description,innerHtml,icon){
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
  loadDoc(DataUrl,dealWithData,[])
}