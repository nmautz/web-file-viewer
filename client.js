var domain = window.location.origin; //http://someurl.com
var tmp = new URL(domain);
tmp.port = '';
domain = tmp.toString();
domain = domain.substring(0, domain.length-1);
console.log("DOmain:" + domain);

let port = 3000;
let url = `${domain}:${port}/api/getfiles`;
window.fetch(url, {
   method: 'GET'
}).then(res => res.json()).then((data)=>{

  console.log(data);

});

