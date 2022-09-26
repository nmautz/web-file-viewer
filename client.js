var domain = window.location.origin; //http://someurl.com
var tmp = new URL(domain);
tmp.port = '';
domain = tmp.toString();
domain = domain.substring(0, domain.length-1);

let port = 3000;

var selected = null;

function addFileToDisplay(fileName, fileType){
  let parent = document.getElementById("main-display-container");
  

  var deletebtn = document.createElement("p");
  deletebtn.classList.add("delete-btn")
  deletebtn.appendChild(document.createTextNode("X"));

  var fileDiv = document.createElement("div");
  fileDiv.id = fileName;
  fileDiv.classList.add("file-display");
  var fileimg = document.createElement("img");
  fileimg.classList.add("file-icon-img");
  if(fileType == 'folder'){
    fileimg.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/OneDrive_Folder_Icon.svg/1200px-OneDrive_Folder_Icon.svg.png";
  }else{
    fileimg.src = "https://cdn-icons-png.flaticon.com/512/124/124837.png";

  }
  fileimg.alt = "Folder/File"
  var filetxt = document.createElement("p");
  filetxt.appendChild(document.createTextNode(fileName));
  filetxt.classList.add("file-txt");

  fileDiv.appendChild(deletebtn);
  fileDiv.appendChild(fileimg);
  fileDiv.appendChild(filetxt);

  if(fileType == "folder"){
    parent.insertBefore(fileDiv, parent.firstChild);
  }else{
    parent.appendChild(fileDiv);
  }


  deletebtn.addEventListener("click",()=>{

    deletefile(fileName);
  })


  fileDiv.addEventListener("click", function(){

    if(fileDiv == selected){
      selected = null;
      fileDiv.classList.remove("selected");
    }else if(selected!= null){
      selected.classList.remove("selected");
      selected = fileDiv;
      fileDiv.classList.add("selected");
    }else{
      selected = fileDiv;
      fileDiv.classList.add("selected");
    }

  })
  fileDiv.addEventListener("dblclick", function(){
    cd(fileName);

  })



}


function deletefile(fileName){
  let url = `${domain}:${port}/api/deletefile?path=${fileName}`;
  window.fetch(url, {
    method: 'GET'
  }).then(res => res.text()).then((data)=>{
    if(data == "OK"){
      displayFiles();
    }else{
      generate_alert(data);
    }
  })

}


function addFileStaging(){
  let parent = document.getElementById("main-display-container");

  var fileDiv = document.createElement("div");
  fileDiv.classList.add("file-display");
  var fileimg = document.createElement("img");
  fileimg.classList.add("file-icon-img");
  fileimg.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/OneDrive_Folder_Icon.svg/1200px-OneDrive_Folder_Icon.svg.png";
  fileimg.alt = "Folder"
  var filenameinput = document.createElement("input");
  filenameinput.classList.add("file-name-input");

  filenameinput.addEventListener("focusout", ()=>{

    addFile(filenameinput.value);

  })

  fileDiv.appendChild(fileimg);
  fileDiv.appendChild(filenameinput);

  parent.insertBefore(fileDiv, parent.firstChild);
}



function addFile(name){

  let url = `${domain}:${port}/api/addFile?name=${name}`;
  window.fetch(url, {
    method: 'GET'
  }).then(res=>res.text()).then((data)=>{
    if(data != "OK" && data != ""){
      console.log(data);
      generate_alert(data);

    }
    displayFiles();


  })
}

function cd(path){

  let url = `${domain}:${port}/api/cd?path=${path}`;
  window.fetch(url, {
    method: 'GET'
  }).then(res => res.text()).then((data)=>{
    if(data == "OK"){
      displayFiles();
    }else{
      generate_alert(data);
    }
  })
}

function openFileBrowser() {
  let input = document.createElement('input');
  input.type = 'file';
  input.onchange = _this => {
            let files =   Array.from(input.files);
            console.log(files);
        };
  input.click();
}


function download(path){

  openFileBrowser();

/*
  let url = `${domain}:${port}/api/cd?path=${path}`;
  window.fetch(url, {
    method: 'GET'
  }).then(res => res.text()).then((data)=>{
    if(data == "OK"){
      displayFiles();
    }else{
      generate_alert(data);
    }
  })*/
}

function generate_alert(data) {
  const alert = document.getElementById("error-alert");
  const alerttext = document.getElementById("error-text");
  alert.style.display = "flex";
  alerttext.innerHTML = data;
  setTimeout(() => {
    alert.style.display = "none";


  }, 1500);
  console.log(data);
}

function displayFiles(){

  var maindisplay = document.getElementById("main-display-container");
  while (maindisplay.firstChild){
    maindisplay.removeChild(maindisplay.lastChild);
    console.log("inf")
  }

  let url = `${domain}:${port}/api/getfiles`;
  window.fetch(url, {
    method: 'GET'
  }).then(res => res.json()).then((data)=>{


    for(i = 0; i < data.length; ++i){
      if(data[i].isDir){
        addFileToDisplay(data[i].path, "folder");
      }else{
        addFileToDisplay(data[i].path, "file");
      }

    }
    

  });
}





document.addEventListener("DOMContentLoaded", ()=>{


  downloadbtn = document.getElementById("download-button");
  addbtn = document.getElementById("add-file-button");

  addbtn.addEventListener("click", ()=>{

    addFileStaging();

  })

  backbtn = document.getElementById("back-button");
  backbtn.addEventListener("click", ()=>{


    cd("../.");

  })

  downloadbtn.addEventListener("click", ()=>{

    downloadWithProgress(selected.id);

  })


  displayFiles();
})




function downloadWithProgress(path) {
  //Function from Stan Georgian

  let IMG_URL = `${domain}:${port}/api/download?path=${path}`; //except this line 

  const startTime = new Date().getTime();

  request = new XMLHttpRequest();

  request.responseType = "blob";
  request.open("get", IMG_URL, true);
  request.send();

  request.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const imageURL = window.URL.createObjectURL(this.response);

      const anchor = document.createElement("a");
      anchor.href = imageURL;
      anchor.download = path;
      document.body.appendChild(anchor);
      anchor.click();
    }
  };

  request.onprogress = function (e) {
    const percent_complete = Math.floor((e.loaded / e.total) * 100);

    const duration = (new Date().getTime() - startTime) / 1000;
    const bps = e.loaded / duration;

    const kbps = Math.floor(bps / 1024);

    const time = (e.total - e.loaded) / bps;
    const seconds = Math.floor(time % 60);
    const minutes = Math.floor(time / 60);

    console.log(
      `${percent_complete}% - ${kbps} Kbps - ${minutes} min ${seconds} sec remaining`
    );
  };
}
