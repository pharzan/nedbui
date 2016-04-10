var Datastore = require('nedb'),
    fs = require('fs'),
    db = {};


var cfg={
	 path:'data/test00.db'
}
function dbService(cfg){
    if (!(this instanceof dbService)) {
    return new dbService();
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

}
var testDB=new dbService(cfg);
//console.log(testDB);

//testDB.save({'name':'test'});
testDB.load();
testDB.updateByKey({name:''},{name:'Hello',test:'Blah'})

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

function batchFileRead(){

    var files = [
    'urlHistory/checkUrlFoString.json', 'urlHistory/getUrlContent.json',
    'urlHistory/getUrlResponse.json', 'urlHistory/goBackOne.json',
    'urlHistory/goForwardOne.json', 'urlHistory/reload.json',

    'urlCheck/urlCheck_az.json',  'urlCheck/urlCheck_Green.json',
    'urlCheck/urlCheck_Red.json',  'urlCheck/urlCheck_Yellow.json',

    'products/greenClick.json',  'products/productsClick.json',  'products/redClick.json',  'products/yellowClick.json',

    'playCycleActions/01_waitForSubtitleButtons.json',
    'playCycleActions/02_leftOptionClick.json',
    'playCycleActions/02_rightOptionClick.json',
    'playCycleActions/03_clickNext.json',

    'lang/azeri.json',
    
    'checkTestTubesFalse.json',
    'correctAnswerClick.json',
    'infopanelClick.json',
    'login.json',
    'subtitlesShownCheck.json',
    'wrongAnswerCycle.json',
    'checkTestTubes.json',
    'correctAnswerCycle.json',
    'infopanel.json',
    'network_answerCheck.json',
    'timeOutWait.json',
    'checkTitleBarComponents.json',
    'getSessionCorrect.json', 'languageChangeAlbenian.json', 'network_timerCheck.json', 't.json',
    'checkViewsIncrease.json', 'getSessionFail.json', 'leftCycle_2.json', 'playVideo.json', 'wrongAnswer_checkGreens.json',
    'clickVoscreenIcon.json', 'incorrectAnswerClick.json', 'leftCycle.json', 'rightCycle.json', 'wrongAnswer_checkReds.json'
];

    files.forEach(function(file){
	console.log('loading file:',file);
	var testSteps=loadFromFile('jsons/'+file);
	var stepsData=dataBuilder(testSteps,file);
	save('steps',stepsData);
    });
}

function createDB(name,path){
    db[name] = new Datastore(path);
}

function loadDB(name,path){
    db[name].loadDatabase();
}
