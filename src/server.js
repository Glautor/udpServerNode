var dgram = require('dgram');
var server = dgram.createSocket('udp4');

var port = 50000;
var host = 'localhost';
var count = 0;

var seconds = 0;
setInterval(() => {
  seconds++;
}, 1000);

server.on('listening', () => {
  var address = server.address();
  console.log('Servidor UDP ouvindo em ' + address.address + ":" +
  address.port);
});

server.on('message', (message, remote) => {
  message = message.toString();
  count++;
  if (message == 'REQNUM') {
    var res = `${count} REQNUM`;
    console.log("Número de conexões", count);
    reqnumRes(Buffer.from(res), remote)
  } else if (message == 'UPTIME') {
    var res = `${seconds} UPTIME`;
    console.log("Tempo no ar", res);
    uptimeRes(Buffer.from(res), remote);
  }
});

function uptimeRes(message, remote) {
  if (message) {
     server.send(message, 0, message.length, remote.port, remote.address, (err, bytes) => {
      if (err) throw err;
        console.log('Resposta ao UPTIME enviado para ' + remote.address + ':' + remote.port);
     });
  }
}

function reqnumRes(message, remote) {
  if (message) {
     server.send(message, 0, message.length, remote.port, remote.address, (err, bytes) => {
      if (err) throw err;
        console.log('Resposta ao REQNUM enviado para ' + remote.address + ':' + remote.port);
     });
  }
}

server.bind({
  address: host,
  port: port
}, (err) => {
  !!err && console.error(err);
});