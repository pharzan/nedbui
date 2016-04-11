var Datastore = require('nedb');
     
// var socket = io('http://dev.nedbui:8000');
 var socket;
var firstconnect = true;

        function connect() {
          if(firstconnect) {
            socket = io.connect('http://dev.nedbui:8000');

            socket.on('serverMessage', function(data){ message(data); });
            socket.on('connect', function(){ console.log("Connected to Server"); });
            socket.on('disconnect', function(){ console.log("Disconnected from Server"); });
            socket.on('reconnect', function(){ console.log("Reconnected to Server"); });
            socket.on('reconnecting', function( nextRetry ){ console.log("Reconnecting in " 
              + nextRetry + " seconds"); });
            socket.on('reconnect_failed', function(){ console.log("Reconnect Failed"); });

            firstconnect = false;
          }
          else {
            socket.socket.reconnect();
          }
        }
connect();
console.log('here');

socket.on('data',function(data){
    console.log(data)
})
//dbService.save(db,{name:'saman'});
setInterval(function(){
    console.log('sent');
    socket.emit('command',{a:'bye'});
    
},1500);

function Cell() {
    if (!(this instanceof Cell)) return new Cell();
    this.value=0;
    this.type=10;
    
};;

Cell.prototype = function() {
    function view(){
	return m('', 'Hello');
    };
    
    return{
	view:view
    };
}();

var main = {
    controller:function(){
	
    },
    array:[],
    view: function() {
	var self=this;
        return m('',
		 m('button',
		   {onclick:function(){
		       self.array.push(new Cell())
		       
		   }
		   },'Test!'),
		 this.array.map(function(a){return m.component(a);}
				
			       ));
    },
    test:function(){return new Cell();}
};


m.mount(document.body, main);
