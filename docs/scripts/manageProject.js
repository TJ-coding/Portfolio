//ajaxing
//accept url to sendd ajax to, response function that is called on ready and array argument that is attached to the response function
function loadDoc(DataUrl,responseFunction,arrayArg) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

      funcString=JSON.stringify(responseFunction(this.responseText,arrayArg));
          // alert(funcString)
        }
      };
      xhttp.open("GET", DataUrl, true);
      xhttp.send();
    }

//extract url from format of "!!!FetchData!!!:URL"
function extractURL(dataString){
  lenToCut="!!!FetchData!!!:".length;
  var url= dataString.substring(lenToCut,dataString.length);
  return url
}

//CALLED BY DEAL WITH DATA
function findWhichDataToFetch(pageData){
  var description=pageData["description"];
  var innerHTML=pageData["innerHTML"];
  var whichDataToGet={"getDescription":false, "getInnerHTML":false}
  whichDataToGet["getDescription"]=description.substring(0,16)=="!!!FetchData!!!:";
  whichDataToGet["getInnerHTML"]=innerHTML.substring(0,16)=="!!!FetchData!!!:";
  return whichDataToGet
}

//fetch both description and innerHTML from URL then render the page
function fetchDescriptInnerHTML(pageData){
    //extracting URL to fetch data from
    pageData.descriptionLocation=extractURL(pageData["description"])
    pageData.innerHTMLLocation=extractURL(pageData["innerHTML"])
    //response function called after fetching description data
    var responseFunction=function(responseText,arrayArg){
      //responseText is the descriptionData
      arrayArg.description=responseText;
      //response function called after fetching innerHTML data
      var secondResponseFunction=function(secondResponseText,arrayArg2){
        //secondResponseText is the innerHTML data
        arrayArg2.innerHTML=secondResponseText;
        //send the paramters for page and render it
      renderPageObject.addPageToList(arrayArg2);
      }
      //fetch InnerHTML
      loadDoc(arrayArg2["innerHTMLLocation"],secondResponseFunction,arrayArg)
    }
    //fetch Description
    loadDoc(pageData["descriptionLocation"],responseFunction,pageData)
  }
//fetch both description  from URL then render the page
function fetchDescription(pageData){
   //fetch description
   pageData.descriptionLocation=extractURL(pageData["description"]);
   var responseFunction=function(responseText,arrayArg){
      //after fetching description
      arrayArg.description=responseText;
      renderPageObject.addPageToList(arrayArg);
    }
    loadDoc(pageData["descriptionLocation"],responseFunction,pageData)

  }

  function fetchInnerHTML(pageData){
  //fetch innerHTML
  pageData.innerHTMLLocation=extractURL(pageData["innerHTML"]);
  var responseFunction=function(responseText){
      //after fetching innerHTML
      arrayArg.innerHTML=responseText;
      renderPageObject.addPageToList(arrayArg);
    }
    loadDoc(pageData["innerHTMLLocation"],responseFunction,pageData)
  }

  //called by the main response function
  function dealWithDatabase(dataBaseString,arrayArg){
  arrayArg="" //this method accept no array argument
  var dataBase=JSON.parse(dataBaseString)["projectDatabase"];
  var numberOfProjects=dataBase.length;
  //globalClass - setting up number of pageData to expect
  renderPageObject.numberOfPages=numberOfProjects;
  for (var i = 0; i < numberOfProjects; i++) {
    //BE VERY CAREFUL LET NO ONE EDIT THE DATA BASE HTML!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //IT IS VERY XSS ABLE AND IT IS INTEDED FOR IT TO BE POSSIBLE TO ALLOW FLEXIBILITY
    var pageData = {"title":dataBase[i]["Title"],"description":dataBase[i]["Description"],"innerHTML":dataBase[i]["InnerHtml"],"icon":dataBase[i]["Icon"],"renderOrder":i};
    alert(dataBase[i]["Title"]);
    var whichDataToGet = findWhichDataToFetch(pageData);
    //FETCH DESCRIPTION AND INNERHTML
    if(whichDataToGet["getDescription"] && whichDataToGet["getInnerHTML"]){
      fetchDescriptInnerHTML(pageData);
  //FETCH DESCRIPTION ONLY
}else if(whichDataToGet["getDescription"]){
  fetchDescription(pageData)
  //FETCH INNERHTML ONLY
}else if(whichDataToGet["getInnerHTML"]){
  fetchInnerHTML(pageData)
  //FETCH NOTHING
}else{
    //don't fetch anything
    renderPageObject.addPageToList(pageData);
  }
}
}

renderPageObject = {
  pageDataList: [],
  numberOfPages:0,
  //maps render order with pageDatList index
  renderOrder:{},
  renderPages () {
    for (var i = 0; i<this.numberOfPages ; i++) {
      indexToRender=this.renderOrder[i];
      thisPageData=this.pageDataList[indexToRender];
      this.appendPage(thisPageData["title"],thisPageData["description"],thisPageData["innerHTML"],thisPageData["icon"])
    }
  },

  //apend html to the horzontalPAgeWrapper
  appendPage(title,description,innerHtml,icon){
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
  },
  //add page data to attribute
  addPageToList(pageData){
    this.pageDataList.push(pageData);
    //set up render order table, to show which pageData should be rendered at which order
    var order=pageData["renderOrder"];
    this.renderOrder[order]=this.pageDataList.length-1;
    //check if the list of data have reached the expected number, when so start renderig
    if(this.pageDataList.length==this.numberOfPages){
      this.renderPages();
    }
  }
}


//call flow
//makeLeaves->loadDoc->dealWithData->appendDrawLeaf
function makeLeaves(){
  var DataUrl="https://tj-coding.github.io/Portfolio/projectDatabase/projectDatabase.html"
  //sending function dealWithData as response function
  loadDoc(DataUrl,dealWithDatabase,[])
}