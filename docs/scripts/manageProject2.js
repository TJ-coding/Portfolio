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

//extract url from format of "!!!FetchData!!!:URL"
function extractURL(dataString){
  lenToCut="!!!FetchData!!!:".length;
  var url= dataString.substring(lenToCut,dataString.length);
  return url
}

//CALLED BY DEAL WITH DATA
function findWhichDataToFetch(pageData){
  var description=pageData["description"];
  var subTitle=pageData["subTitle"];
  var whichDataToGet={"getDescription":false, "getSubTitle":false}
  whichDataToGet["getDescription"]=description.substring(0,16)=="!!!FetchData!!!:";
  whichDataToGet["getSubTitle"]=subTitle.substring(0,16)=="!!!FetchData!!!:";
  return whichDataToGet
}

//fetch both description and subtitle from URL then render the page
function fetchDescriptSubTitle(pageData){
    //extracting URL to fetch data from
    pageData.descriptionLocation=extractURL(pageData["description"])
    pageData.subTitleLocation=extractURL(pageData["subTitle"])
    //response function called after fetching description data
    var responseFunction=function(responseText,arrayArg){
      //responseText is the descriptionData
      arrayArg.description=responseText;
      //response function called after fetching subtitle data
      var secondResponseFunction=function(secondResponseText,arrayArg2){
        //secondResponseText is the innerHTML data
        arrayArg2.subTitle=secondResponseText;
        //send the paramters for page and render it
      renderPageObject.addPageToList(arrayArg2);
      }
      //fetch subtitle
      loadDoc(arrayArg["subTitleLocation"],secondResponseFunction,arrayArg)
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

  function fetchSubTitle(pageData){
  //fetch innerHTML
  pageData.subTitleLocation=extractURL(pageData["innerHTML"]);
  var responseFunction=function(responseText){
      //after fetching innerHTML
      arrayArg.subTitle=responseText;
      renderPageObject.addPageToList(arrayArg);
    }
    loadDoc(pageData["subTitleLocation"],responseFunction,pageData)
  }

  //called by the main response function
  //renders the data after recieving data from ajax
  function dealWithDatabase(dataBaseString,arrayArg){
  arrayArg="" //this method accept no array argument
  var dataBase=JSON.parse(dataBaseString)["projectDatabase"];
  var numberOfProjects=dataBase.length;
  //globalClass - setting up number of pageData to expect
  renderPageObject.numberOfPages=numberOfProjects;
  for (var i = 0; i < numberOfProjects; i++) {
    //BE VERY CAREFUL LET NO ONE EDIT THE DATA BASE HTML!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //IT IS VERY XSS ABLE AND IT IS INTEDED FOR IT TO BE POSSIBLE TO ALLOW FLEXIBILITY
    var pageData = {"title":dataBase[i]["Title"],"description":dataBase[i]["Description"],"subTitle":dataBase[i]["SubTitle"],"icon":dataBase[i]["Icon"],"renderOrder":i};
    var whichDataToGet = findWhichDataToFetch(pageData);
    //FETCH DESCRIPTION AND SUBTITLE
    if(whichDataToGet["getDescription"] && whichDataToGet["getSubTitle"]){
      fetchDescriptSubTitle(pageData);
  //FETCH DESCRIPTION ONLY
}else if(whichDataToGet["getDescription"]){
  fetchDescription(pageData)
  //FETCH subTitle ONLY
}else if(whichDataToGet["getSubTitle"]){
  fetchSubTitle(pageData)
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
      this.appendPage(thisPageData["title"],thisPageData["description"],thisPageData["subTitle"],thisPageData["icon"],i)
    }
  },

  //apend html to the horzontalPAgeWrapper
  appendPage(title,description,subTitle,icon,order){
 //BE VERY CAREFUL LET NO ONE EDIT THE DATA BASE HTML!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  //IT IS VERY XSS ABLE AND IT IS INTEDED FOR IT TO BE POSSIBLE TO ALLOW FLEXIBILITY
  var elementToWriteIn=document.getElementById("carouselContainer")
  carouselItem=`
      <div class="carousel-item" style="height: 100vh; width: 100vw">
        <div class="d-flex h-100 align-items-center justify-content-center projectSlide">
          <div class="container">
            <div class="row">
              <div class="col">
                <div class="container-fluid d-md-flex align-items-center" style="max-width: 80%;">
                    <div class="col-md-7 col-sm-12 text-md-right" style="text-align: center; height: 100%; ">
                      <h1>`+title+`</h1>
                    </div>
                    <div class="col-md-5 col-sm-12 text-md-left" style="align-items: center;  justify-content:center;align-items:center;">
                    <img src="resource/icons/`+icon+`"
                    height="70em"
                    width="70em"
                    style="transform: rotate(90deg); margin-top: 10px">
                  </div>
              </div>
            </div>
          </div><br>
          <hr>
          <div class="row">
            <div class="col">   
              <div class="container" style="width: 60vw">
                <div class="col-md-3 text-md-right">
                  `+subTitle+`
                </div>
                <div class="col-md-9 text-md-left">
                  <span>
                    `+description+`
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  `
  elementToWriteIn.innerHTML+=carouselItem
  indicatorElement=document.getElementById("carouselIndicator")
  dataToSlideTo=order+1
  indicatorListTag='<li data-target="#projectCarousel" data-slide-to="'+dataToSlideTo+'"></li>'
  indicatorElement.innerHTML+=indicatorListTag
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
function makeCarouselPages(){
  var DataUrl="https://tj-coding.github.io/Portfolio/projectDatabase/projectDatabase.html"
  //sending function dealWithData as response function
  loadDoc(DataUrl,dealWithDatabase,[])
}