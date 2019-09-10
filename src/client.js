var readline = require('readline');

var dgram = require('dgram');
var client = dgram.createSocket('udp4');

var sequence = 0;

client.bind({
  address: 'localhost'
}, (err) => {
  !!err && console.error(err);
});

// PODE ESCOLHER A QUAL SERVIDOR SE CONECTAR
var port = 50000;
var host = 'localhost';
var command = 'REQNUM';

var leitor = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function clientServer() {
  sendMessage(command);

  async function sendMessage(message) {
    if(message == 'CLOSE') {
      client.close();
      leitor.close();
      setInterval(() => {
          process.exit(0);
      }, 1000);
    }
    if (message) {
      client.send(message, 0, message.length, port, host, (err, bytes) => {
        if (err) throw err;
      });
    }
  }

  client.on('listening', () => {
    var address = client.address();
    console.log('Server UDP ouvindo em ' + address.address + ":" + address.port);
  });

  client.on('message', (message, remote) => {
    message = String(message).split(' ');
    if (message[1] == 'UPTIME') {
      if(sequence == 0){
        console.log(`O server está rodando à ${message[0]} segundos`);
        sequence++;
      }
    } else if (message[1] == 'REQNUM') {
      if(sequence == 0){
        console.log(`o server já teve ${message[0]} conexões`);
        sequence++;
      }
    }
    setCommand();
  });
}

function questions() {
  leitor.question('Selecione a porta para se conectar: ', (portReceived) => {
      port = portReceived;
      leitor.question('Selecione o host para se conectar: ', (hostReceived) => {
          host = hostReceived;
          setCommand();
      })
  })
}

async function setCommand() {
  await setInterval(() => {}, 1000);
  leitor.question('Digite REQNUM, UPTIME ou CLOSE: ', (commandReceived) => {
      sequence = 0;
      command = commandReceived;
      clientServer();
  })
}

questions();