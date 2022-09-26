var domain = window.location.origin; //http://someurl.com
var tmp = new URL(domain);
tmp.port = '';
domain = tmp.toString();
domain = domain.substring(0, domain.length-1);

let port = 3000;


function addFileToDisplay(fileName, fileType){
  let parent = document.getElementById("main-display-container");

  var fileDiv = document.createElement("div");
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

  fileDiv.appendChild(fileimg);
  fileDiv.appendChild(filetxt);

  if(fileType == "folder"){
    parent.insertBefore(fileDiv, parent.firstChild);
  }else{
    parent.appendChild(fileDiv);
  }
  

  fileDiv.addEventListener("click", function(){

    cd(fileName);

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
      const alert = document.getElementById("error-alert");
      const alerttext = document.getElementById("error-text");
      alert.style.display = "flex";
      alerttext.innerHTML = data;
      setTimeout(()=>{
        alert.style.display= "none";


      }, 1500);
      console.log(data);
    }
  })
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


  addbtn = document.getElementById("add-file-button");

  addbtn.addEventListener("click", ()=>{

    addFileStaging();

  })

  backbtn = document.getElementById("back-button");
  backbtn.addEventListener("click", ()=>{


    cd("../.");

  })


  displayFiles();
})




