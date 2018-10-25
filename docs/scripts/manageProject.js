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
	alert(dataString);
	var dataObject=JSON.parse(dataString);
	makeLeaves(dataObject);
}

function makeLeaves(){
	loadDoc()
	alert(JSON.stringify(dataObject))
}