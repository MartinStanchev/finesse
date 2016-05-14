var http = require('http');
var fs = require('fs');
var stream = require('./');
var path = require('path');
// var express = require('express');
// var app = express();
var async = require('async');

// app.use(express.static(path.join(__dirname, '/public')));

http.createServer(function(req, res) {
  if (req.url === '/') {
    return fs.createReadStream(path.join(__dirname, '/server.html')).pipe(res);
  }
  if (/youtube/.test(req.url)) {
    stream(req.url.slice(1)).pipe(res);
  }


  if(req.url.indexOf('.css') != -1 || req.url.indexOf('.min.css') != -1) {
    css(res);
  }

}).listen(3000)

function css(res) {
  res.writeHead(200, {"Content-Type": "text/css"});

  async.eachSeries(
    ['public/css/style.css','public/css/bootstrap.css', 'public/css/bootstrap.min.css',
    'public/css/simple-sidebar.css', 'public/css/bootstrap.min.css.map'],
    function(filename, cb) {
      fs.readFile(filename, function(err, content) {
        if (!err) {
          res.write(content);
        }

      cb(err);
      });
    },

    function(err) {
      res.end()
    }
  );
}

console.log('server created on http://localhost:3000');
