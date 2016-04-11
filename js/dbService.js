var Datastore = require('nedb'),   
    http = require('http'),
    fs = require('fs');
    
   

function load(db, query) {

    
    return new Promise(function(resolve) {

        db.find(query, function(err, steps) {
	    console.log(err,steps,db);
            if (steps.length == 0)
                return resolve('empty');
	    
            //console.log('DATA SERVICES:: LOADED ',steps.map(function(st){return st.name}));
            return resolve(steps);

        });
    });
}

function save(db, data) {
    
    
    
    db.insert(data, function(err, newDoc) { // Callback is optional
        // newDoc is the newly inserted document, including its _id
        // newDoc has no key called notToBeSaved since its value was undefined
        console.log('inserted');
    });


}

function remove(data) {
    db.steps.remove({
        name: 'checkTestTubes.json'
    }, {}, function(err, numRemoved) {
        // numRemoved = 1
        console.log('Number Removed::', numRemoved);
        console.log('removed')
    });
}

function removeById(db, id) {
    
    db.remove({
        _id: id
    }, {}, function(err, numRemoved) {
        // numRemoved = 1
        console.log('Number Removed::', numRemoved);
        console.log('removed')
    });
}

function updateByName(dbName,name,updateData){
    var d = db[dbName];
    d.update({ name: name }, { $set: updateData }, { multi: true }, function (err, numReplaced) {
	console.log('updated: ',numReplaced)
  // numReplaced = 3
  // Field 'system' on Mars, Earth, Jupiter now has value 'solar system'
});

}

// function server() {
    
//     http.createServer(function(request, response) {

//         var responseHeaders = {
//             "access-control-allow-origin": "*",

//             "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS, XMODIFY",
//             'Access-Control-Allow-Headers': 'Origin, X-Requested-With, X-HTTP-Method-Override, content-type, Accept, Key, Host',
//             'Access-Control-Allow-Headers': ' X-Requested-With, X-HTTP-Method-Override, content-type, Accept, Key,DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type',
//             'Access-Control-Allow-Credentials': true,
//             "Content-Type": "application/json"
//         };

//         response.writeHead(200, responseHeaders);
	
//         if (request.method === "OPTIONS") {
//             // Add headers to response and send
//             response.writeHead(200, responseHeaders);
//             response.end();
//         }

//         var path = url.parse(request.url).pathname;
//         var search = url.parse(request.url).search;
// 	search=decodeURI(search);
        
//         //console.log('path', path);
//         //console.log('search', search);
// 	if (path === '/favicon.ico') {
// 	    response.writeHead(200, {'Content-Type': 'image/x-icon'} );
// 	    response.end();
	    
// 	    return;
// 	}
// 	if(path=='/api/'){
	    
// 	    response.writeHead(200, responseHeaders);
// 	    response.write('hello');
//             response.end();
// 	}

	
	
// 	else {
//             fs.readFile('./index.html', function(err, file) {
//                 if (err) {
//                     // write an error response or nothing here  
//                     return;
//                 }
//                 response.writeHead(200, {
//                     'Content-Type': 'text/html'
//                 });
//                 response.end(file, "utf-8");
//             });
//         }
//     }).listen(8001);
//     console.log("server initialized");

// }
//server();

module.exports = {
    // server: server,
    load: load,
    save: save,
    remove: remove,
    removeById: removeById
};
