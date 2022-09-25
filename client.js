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
  fileimg.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/OneDrive_Folder_Icon.svg/1200px-OneDrive_Folder_Icon.svg.png";
  fileimg.alt = "Folder"
  var filetxt = document.createElement("p");
  filetxt.appendChild(document.createTextNode(fileName));
  filetxt.classList.add("file-txt");

  fileDiv.appendChild(fileimg);
  fileDiv.appendChild(filetxt);

  parent.appendChild(fileDiv);


}



function addFile(name){

  let url = `${domain}:${port}/api/addFile?name=${name}`;
  window.fetch(url, {
    method: 'GET'
  })
}

function displayFiles(){

  let url = `${domain}:${port}/api/getfiles`;
  window.fetch(url, {
    method: 'GET'
  }).then(res => res.json()).then((data)=>{


    for(i = 0; i < data.length; ++i){
      addFileToDisplay(data[i], "folder")

    }
    

  });
}

document.addEventListener("DOMContentLoaded", ()=>{


  addbtn = document.getElementById("add-file-button");

  addbtn.addEventListener("click", ()=>{

    addFile('test');

  })


  displayFiles();
})




