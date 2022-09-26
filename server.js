// install
//npm install archiver --save
//Require
const fs = require("fs");
const cors = require("cors")
const process = require('process');
archiver = require('archiver');
var express = require('express');
var app = express();

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


  fs.writeFile(req.query.name, "", (err)=>{
    if (err) {
      res.write("ERROR: " + err);
    }else{
      res.write("OK");
    }
  }); 

  res.end();

  

})

app.get('/api/deletefile', function(req, res){

  try{
    fs.unlinkSync("./"+req.query.path);
    res.write("OK");

  }catch(e){
    res.write("ERROR: " +e);
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

  var isDir = false;
  try{
    if(fs.lstatSync(req.query.path).isDirectory()){
      isDir = true;
    }
  }catch(e){
    console.log(e);
  }


  path = req.query.path;
  console.log(path)
  try{
    if(isDir){
      zip(path)
      path = path + `/${path}.zip`
    }
    //req.query.path
    console.log(path)
    var data =null
    var file = fs.readFileSync(path, "binary");

   
    res.write(file, "binary");
    res.end();


  }catch (e){
    console.log("ERROR: " + e);
    res.write("ERROR: " + e);
  }

  res.end();


})

function zip(path){
  // init
  var output = fs.createWriteStream(path + `/${path}.zip`);
  var archive = archiver('zip', { zlib: { level: 9 } });
  archive.pipe(output);

  // callback
  output.on('close', () => { console.log('callback when everything is finished'); });

  // append files / folders
  // append files from a sub-directory, putting its contents at the root of archive
  archive.directory(path, false);

// append files from a sub-directory and naming it `new-subdir` within the archive
  archive.directory('subdir/', 'new-subdir');

  archive.finalize();
}

app.listen(3000);

