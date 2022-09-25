
const fs = require("fs");
const cors = require("cors")
const process = require('process');

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
      if(fs.lstatSync(file).isDirectory()){
        isDir = true;
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

app.listen(3000);

