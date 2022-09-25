
const fs = require("fs");
const cors = require("cors")


var express = require('express');
var app = express();

app.use(cors({
  methods: ["POST"]
}))

app.get('/api/getfiles', function(req, res){

  var filenames = [];
  if(req.url === '/api/getfiles'){

    fs.readdirSync("./").forEach(file => {
      filenames.push(file);
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

app.listen(3000);

