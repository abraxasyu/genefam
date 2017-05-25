var express = require("express");
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
app.use('/static', express.static('assets'));

var queryin="GCCAGGTGAGGTGGTGTGCCTGTAGTCCCAGCTACTCAGGAGGCTGAGGTGAGAGGATCACTTGAGCCTAGGCGTTCTGGGCTGTAGTGCACTGTGCTGATGAGATGTCCACATTAAGTTCAGCATCGATAATGGTGACCTCCTTGGAACAGGGGACCAACAGCTTGCCTAACGAGGGGTGAACCAGCCCAGGTTGGAAACAAAGCAGCTCAAAACTCCCATGGTGATCAGTAGTGGGATTGTGCCTATGAATAGCCACTGCACTCCAGCCAAGGCAACACAGTGAGACTCCATCTCT";
var finds="([ -f outgraph.json ] && echo PASSES) || echo FAILS\n";
var Client = require('ssh2').Client;

/*
function fup(jsonin){
  console.log(jsonin);
}
*/

function getjson(querystring,fup){
  var conn = new Client();
  var jsondata=null;
  conn.on('ready', function() {
    console.log('Client :: ready');
    conn.shell(function(err, stream) {
      if (err) throw err;
      stream.on('close', function() {
        console.log('Stream :: close');
        console.log(jsondata);
        fup(jsondata);
        conn.end();
      }).on('data', function(data) {
        datatostring=data.toString('utf8')
        //if failed
        if(datatostring.indexOf("([ -f outgraph.json ] && echo PASSES) || echo FAILS")>-1){
          datatostring=datatostring.replace("([ -f outgraph.json ] && echo PASSES) || echo FAILS","");
        }
        if(datatostring.indexOf("-f outgraph.json")==-1 && datatostring.indexOf("FAILS")>-1){
          console.log('-------------------------FAILS');
          setTimeout(function(){
            stream.write(finds);
          },5000);
        }
        //if succeeded
        else if(datatostring.indexOf("-f outgraph.json")==-1 && datatostring.indexOf("PASSES")>-1){
          console.log('-------------------------PASSES');
          stream.write('cat outgraph.json\n');
        }
        //json
        else if(datatostring.indexOf("{\"directed\":")>-1){
          datatostring=datatostring.slice(0,datatostring.lastIndexOf("}")+1)
          jsondata=JSON.parse(datatostring);
          //stream.end('exit\n');
          stream.end('rm input.fa\nrm outgraph.json\nexit\n');
        }
        else{console.log('STDOUT: ' + datatostring);}//else
      }).stderr.on('data', function(data) {
        console.log('STDERR: ' + data);
      });
      stream.write('cd website\n');
      stream.write('qsub -v QUERY='+querystring+' run_query.pbs'+'\n');
      stream.write(finds);
    });
  }).connect({
    host: ,
    port: ,
    username: ,
    password: 
  });
}

//getjson(queryin);



app.get('/', function(req, res){
  res.sendFile(__dirname+'/index.html');
});

io.on('connection', function(socket){
  socket.on('connect',function(msg){
    console.log('user connected');
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('fromclient',function(msg){
    console.log('data received: '+msg.msg);
    getjson(msg.msg,function(data){
      socket.emit('fromserver',{msg:data});
    });

    //get json via ssh2 from osc
    //return json
    //socket.emit('fromserver',{msg:retjson});
    /*
    fs.readFile(__dirname+'/assets/outgraph.json','utf8',function(err,data){
      if (err) throw err;
      socket.emit('fromserver',{msg:data});
    });
    */
  });
});



http.listen(33333, function(){
  console.log('listening on *:33333');
});
