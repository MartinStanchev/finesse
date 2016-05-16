var http = require('http');
var fs = require('fs');
var stream = require('./');
var path = require('path');
var async = require('async');
var YouTube = require('youtube-node');
var Q = require('q');

http.createServer(function(req, res) {

  if (req.url === '/') {
    return fs.createReadStream(path.join(__dirname, '/server.html')).pipe(res);
  }

  if (/youtube/.test(req.url)) {
    stream(req.url.slice(1)).pipe(res);
  }
  else if(req.url.indexOf('.css') != -1 || req.url.indexOf('.min.css') != -1) {
    css(res);
  }
  else {
    youtube_search(req.url.slice(1)).then(function(items) {
      console.log(items);
      //trqbva da se pratqt tiq itemi kum html-a za da se napravi mesto v koeto da se izbira ot rezultata
      // v items[i].title == imeto na klipa, items[i].id == id-to na klipa toest chasta sled youtube.com/?watch=.. , items[i].thumb == link kum thumbnaila na klipa
      //tova trqbva da se predade kum html-a
    });
  }
}).listen(3000);

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

function youtube_search(search_string) {
  var deffered = Q.defer();
  var items = [];

  var youTube = new YouTube();

  youTube.setKey('AIzaSyA47VOhrCdx1kua5MB2XHbOoD0qTKSClS8');

  youTube.search(search_string, 2, function(error, result) {
    if (error) {
      deffered.reject(new Error(error));
    }
    else {
      for (var i = 0, len = result.items.length; i < len; ++i) {
        items.push({
          id: result.items[i].id.videoId,
          thumb: result.items[i].snippet.thumbnails.default.url,
          title: result.items[i].snippet.title
        });
      }
      deffered.resolve(items);
    }
  });
  return deffered.promise;
}



console.log('server created on http://localhost:3000');
