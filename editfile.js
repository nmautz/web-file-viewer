




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




})