/**
 * Module dependencies.
 */

var express = require('express');
var app = module.exports = express.createServer();
var io = require('socket.io').listen(app);
var fs = require('fs');

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'Real-time Bus Location System'
  });
});

app.listen(3000);

var stoppos = '';
function setBusStop(id) {
    var stationList = './public/data/busstop/busStop'+id+'.json';
    stoppos = JSON.parse(fs.readFileSync(stationList));
    stoppos.id = id;
    io.sockets.emit('postBusStop', stoppos);
}

function setBusPosition(id) {
    var filepath = './public/data/busposition/busPosition'+id+'.json';
    var master = JSON.parse(fs.readFileSync(filepath));
    var current = 0;
    var last = master.item.length - 1;
    setInterval(function(){
        //console.log(last, current);
        io.sockets.emit('postLatLon', { pos: master.item[current], id: id, num: current, last: last });
        if(++current > last) {
            current = 0;
        }
    }, 1000);
    //}, 1000+id*1000);
}

//var ids = [0, 1];
var ids = [0, 1, 2, 3, 4, 5];
ids.forEach(function(id){
    setBusPosition(id);
});

// event handler
io.sockets.on('connection', function (socket) {
    socket.on('startBus', function (id) {
        setBusStop(id);
        //setBusPosition(id);
        //console.log(id)
    });
    /*
    socket.emit('postBusStop', stoppos);
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
    */
});

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
