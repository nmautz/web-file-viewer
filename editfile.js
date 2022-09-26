




function downloadNoSave(path){

    const output = document.getElementById("edit-text-area");

    let url = `${domain}:${port}/api/download?path=${path}`;
    window.fetch(url, {
    method: 'GET'
    }).then(res => res.text()).then((data)=>{
        output.innerHTML = data;
    })
  }


function getFileContents(path){
    downloadNoSave(path);

}


document.addEventListener("DOMContentLoaded", ()=>{

    const urlparams = new URLSearchParams(window.location.search);
    path = urlparams.get("path");

    getFileContents(path);


    const backbtn = document.getElementById("back-to-explorer-button");
    const savebtn = document.getElementById("save-button");

    backbtn.addEventListener("click", ()=>{
        window.location.href="./index.html";
    })

    savebtn.addEventListener("click", ()=>{
        const tarea = document.getElementById("edit-text-area");

        updateFile(path, tarea.innerHTML)

    })

    


})