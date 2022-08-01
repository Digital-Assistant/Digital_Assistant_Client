const http = require('http');
http.createServer(function (req, res) {
    console.log(req);
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write('Hello World!');
  res.end();
}).listen(3000);