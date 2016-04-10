var Datastore = require('nedb'),
    fs = require('fs'),
    db = {};



function dbService (cfg){
    if (!(this instanceof dbService)) {
    return new dbService(cfg);
    }
    
    this.dbPath=cfg.path;
    
    /*
     Constructor:
     */
    console.log(this.dbPath)
    this.db=new Datastore({filename:this.dbPath, autoload: true });
    this.db.loadDatabase(function(err){
	console.log(err)
    });
    
};

dbService.prototype.load=function(query){
    var self=this;
    return new Promise(function(resolve) {
        self.db.find(query, function(err, result) {
            if (result.length == 0){
		console.log('empty')
                return resolve('empty');
	    }
	    console.log('data Fetched',result);
	    resolve('done');
        });
    });
}

dbService.prototype.save=function (data) {
    
    this.db.insert(data, function(err, newData) { // Callback is optional
	        // newDoc is the newly inserted document, including its _id
	        // newDoc has no key called notToBeSaved since its value was undefined
	console.log('inserted');
	    });

};

dbService.prototype.update=function(data,options){

};

dbService.prototype.updateByKey=function (existing,updateData){
    /*
     inserts or updates existing fields:
     first argument is the existing data the second is the one to be updated or to be inserted 
     */
    this.db.update(existing, { $set: updateData }, { multi: true }, function (err, numReplaced) {
	console.log('updated: ',numReplaced);
	// numReplaced = 3
	// Field 'system' on Mars, Earth, Jupiter now has value 'solar system'
    });

};

dbService.prototype.removeByKey=function(data){
    this.db.remove(data, {}, function(err, numRemoved) {
        console.log('Number Removed::', numRemoved);
        console.log('removed');
    });
};


//console.log(testDB);
// testDB.save({'name':'test'});
// testDB.load();
// //testDB.updateByKey({name:'test'},{name:'Hello',test:'Blah'});
// testDB.removeByKey({name:'Hello'});

function load(dbName, query) {
    // query={name:'checkTestTubes.json' };
    var d = db[dbName];
    return new Promise(function(resolve) {


        d.find(query, function(err, steps) {
            if (steps.length == 0)
                return resolve('empty');
	    var data=[];
	    steps.map(function(st) {
                return data.push(st)
            })
	    for(var i=0;i<data.length;i++){
		console.log('-------------------------------'+i+'\n\r',data[i] );

	    }
	    
            return resolve(steps);

        });
    });
}

function existsInDB(dbName, name) {
    return new Promise(function(resolve){
	var d = db[dbName];
	var query={name:name};
	d.find(query, function(err, steps) {
            if (steps.length == 0)
		return resolve(false)
	    else
		return resolve(true)
	    
            

	});
    })
    
}

function updateByName(name,updateData){
    
    db.steps.update({ name: name }, { $set: updateData }, { multi: true }, function (err, numReplaced) {
	console.log('updated: ',numReplaced)
  // numReplaced = 3
  // Field 'system' on Mars, Earth, Jupiter now has value 'solar system'
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

function removeById(dbName, id) {
    var d = db[dbName];
    d.remove({
        _id: id
    }, {}, function(err, numRemoved) {
        // numRemoved = 1
        console.log('Number Removed::', numRemoved);
        console.log('removed')
    });
}

function loadFromFile(file) {

    var content = fs.readFileSync('./' + file, 'utf8', function(err, data) {
        return data;
    });

    var testSteps = JSON.parse(content);
    console.log('FileLoader:: ', testSteps[0].description);
    return testSteps;

};

function dataBuilder(content,fileName){
    
    var data= { name: fileName
            , dataStore:'data/steps.db'
            , content: content
	    , categoery:'products'
            , infos: { cretaedBy: 'pharzan',
	    	       time: new Date()
	    	     }
               };
    console.log('DataBuilder:: DataCreated');
    return data;
};




exports.init=dbService
