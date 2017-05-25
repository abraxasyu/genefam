var submitform;
$(function(){
  var socket=io();
  submitform = function(){
    socket.emit('fromclient',{'msg':$('input').val()});
    console.log('client sent message to server');
  };
  socket.on('fromserver',function(msgin){
      console.log('client received message from server');
      //console.log(msgin);
      graph=msgin.msg//graph=JSON.parse(msgin.msg);
      console.log(graph);
      genfdgraph(graph);
    });
});
