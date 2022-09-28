// install
//npm install archiver --save
//Require
const fs = require("fs");
const cors = require("cors")
const process = require('process');
archiver = require('archiver');
var express = require('express');
const path = require("path");
var app = express();


app.use(express.json());


app.use(cors({
  methods: ["POST"]
}))

app.get('/api/getfiles', function(req, res){

  var filenames = []
  if(req.url === '/api/getfiles'){


    fs.readdirSync("./").forEach(file => {
      var isDir = false;
      try{
        if(fs.lstatSync(file).isDirectory()){
          isDir = true;
        }
      }catch(e){
        console.log(e);
      }
      
      filenames.push({path: file, isDir: isDir});
    });
    res.write(JSON.stringify(filenames));
    res.end();
  }

})

app.get('/api/addFile', function(req, res){


  if (fs.existsSync(req.query.name)){
    res.write("File \"" + req.query.name + "\" already exists!");
  }else{
    fs.writeFile(req.query.name, "", (err)=>{




      if (err) {
        res.write("ERROR: " + err);
      }else{
        res.write("OK");
      }
    }); 
  }


  res.end();
})


app.get('/api/addFolder', function(req,res){

  try{
    if (!fs.existsSync(req.query.path)){
      fs.mkdirSync(req.query.path);
      res.write("OK");

    }else{
      res.write("Folder \"" + req.query.path + "\" already exists!");
    }
  }catch(e){
    res.write("ERROR: " + e)
  }
  res.end();


})

app.get('/api/pwd', (req, res)=>{

  try{
    res.write(process.cwd());
  }catch(e){
    res.write("ERROR: " + e);
  }

  res.end();


})

app.get('/api/deletefile', function(req, res){

  try{

    if(req.query.type == 'folder'){
      fs.rmdirSync(req.query.path, {recursive: true});

    }else{
      fs.unlinkSync("./"+req.query.path);
    }
    res.write("OK");

 

  }catch(e){
    res.write("ERROR: " +e);
    console.log("ERROR: " +e);
  }

  res.end();

  

})

app.get('/api/cd', function(req,res){

  console.log("Old Dir: " + process.cwd());
  try{
    process.chdir(req.query.path);
    res.write("OK");
  }catch (e){
    res.write("ERROR: " + e);
  }

  console.log("Updated Dir: " + process.cwd());
  res.end();


})

app.get('/api/download', function(req,res){




  try{

      var file = fs.readFileSync(req.query.path, "binary");

    
      res.write(file, "binary");
      res.end();
    
  }catch (e){
    console.log("ERROR: " + e);
    res.write("ERROR: " + e);
  }

  res.end();


})

app.post("/api/updateFile", (req, res)=>{
  try{

    if(req.query.type == 'folder'){
      fs.rmdirSync(req.query.path);

    }else{
      fs.unlinkSync("./"+req.query.path);
    }
    res.write("OK");

 

  }catch(e){
    res.write("ERROR: " +e);
    console.log("ERROR: " +e);
  }



  fs.writeFile(req.query.path, req.body.contents, (err)=>{
    if (err) {
      res.write("ERROR: " + err);
    }else{
      res.write("OK");
    }
  }); 

  res.end();


})


app.get("/api/zip", (req,res)=>{

  console.log(req.query.path)
  try{
    zip(req.query.path, {"res": res});
  }catch (e){
    res.write("ERROR:" + e);
    res.end()

  }

 
  


})


function zip(path, resObj){
  // init
  var output = fs.createWriteStream(`${path}.zip`);
  var archive = archiver('zip', { zlib: { level: 9 } });
  archive.pipe(output);

  // callback
  output.on('close', () => {   
    resObj["res"].write("OK");
    resObj["res"].end()  
  });

  // append files / folders
  // append files from a sub-directory, putting its contents at the root of archive
  archive.directory(path, false);

// append files from a sub-directory and naming it `new-subdir` within the archive
  archive.directory('subdir/', 'new-subdir');

  archive.finalize();
}

app.listen(3000);

