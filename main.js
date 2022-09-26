
var firstTime = true

document.addEventListener("DOMContentLoaded", ()=>{


  downloadbtn = document.getElementById("download-button");
  addbtn = document.getElementById("add-file-button");

  addbtn.addEventListener("click", ()=>{

    addFileStaging(file_icon);

  })

  backbtn = document.getElementById("back-button");
  backbtn.addEventListener("click", ()=>{


    cd("../.");

  })




  downloadbtn.addEventListener("click", ()=>{


    var isDir = false;
    if(selected.children[1].src == folder_icon){
      
      isDir = true;
      zipFolder(selected.id);
      displayFiles();
    }else{
      downloadWithProgress(selected.id, isDir);
    }
   

  })

  addFolderbtn = document.getElementById("add-folder-button");
  addFolderbtn.addEventListener("click", ()=>{
    addFileStaging(folder_icon);


  })


  pathinput = document.getElementById("path");
  pathinput.addEventListener('focusout', ()=>{

    cd(pathinput.value);

  })


  if(firstTime){
    displayFiles();
    firstTime = false;
  }


})
