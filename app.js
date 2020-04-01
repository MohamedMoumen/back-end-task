var express = require('express');
var app = express();
var request = require("request");
var bodyParser = require("body-parser")
var Fuse = require("fuse.js");
//App config    
app.use(bodyParser.urlencoded({ extended: true }));

// Search options
// The options variable has many options which could be found at fusejs.io
// This search includes shouldSort option which sorts the data after filtering.
var options =  {
    includeScore: true,
    isCaseSensitive: false,
    shouldSort: true,
    findAllMatches: true,
    keys: []
}
// The main route that will be handling the searching
app.post("/", function(req,res) {
    var method = req.body.method;
    // The external api url that the data will be fetched from and handled through the next callback function.
    request("https://api.myjson.com/bins/tl0bp", function(error, response, body){
        if(!error && response.statusCode == 200) {  // The error handling mentioned earlier 

            var data = JSON.parse(body) // Parsing string data to JSON
            
            ////// IMPORTANT ///////
            // Each of the following conditions is responsible for a search type(name, city, range, and price)
            // The options variable takes a key by which the search will be done
            // Then the data from the external api will be passed through using {data.hotels} and given the options object
            // The second to last line takes the data from the {req.body} and searches through the data from the api 
            if(method == "name") { 
                options.keys = ['name'];
                const fuse = new Fuse(data.hotels, options);
                const result = fuse.search(req.body.name);
                res.send(result);
            } 
            
            else if(method == "city") { 
                options.keys = ['city'];
                const fuse = new Fuse(data.hotels, options);
                const result = fuse.search(req.body.city);
                res.send(result);
            } 
            
            else if(method == "range") {
                options.keys = ['availability.from', 'availability.to'];
                const fuse = new Fuse(data.hotels, options);
                const result = fuse.search(req.body.range);
                res.send(result);
                
            } 
            
            else if(method == "price") {
                options.keys = ['price'];
                const fuse = new Fuse(data.hotels, options);
                const result = fuse.search(req.body.price);
                res.send(result);
            }
        }
    })
})

app.listen(3000,function(){console.log("Server started")});