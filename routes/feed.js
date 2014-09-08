
/*
 * GET feeds
 */

var FeedParser = require('feedparser');
var http = require('http');


exports.getFeed = function(req, res){

  var serverRes = res;
  var feedName = req.params.feedName;
  var feedUrl = 'http://benjamin.smedbergs.us/weekly-updates.fcgi/project/' + feedName + '/feed';
  var items = [];
  http.get(feedUrl, function(res) {

          // Give the 'res' stream to FeedParser for processing
          res.pipe(new FeedParser({}))

              // Handle HTTP errors
              .on('error', function(error){
                  serverRes.status(500).json({
                      'message': 'HTTP failure while fetching feed'
                  });
              })

              // Every time a readable chunk arrives, add it to the array
              .on('readable', function(){
                  var stream = this, item;
                  while (item = stream.read()){
                      items.push(item);
                  }
              })

              // When everything completes, create a result JSON to hand back to the user
              .on('end', function(){
                  serverRes.jsonp(items);
              });
      });
};
