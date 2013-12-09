// Generated by CoffeeScript 1.6.3
(function() {
  var broadcast, chatServer, clientList, net;

  net = require('net');

  chatServer = net.createServer();

  clientList = [];

  chatServer.on('connection', function(client) {
    client.name = "" + client.remoteAddress + " : " + client.remotePort;
    client.write("Hi " + client.name + "!\n");
    clientList.push(client);
    client.on('data', function(data) {
      broadcast(data, client);
    });
    client.on('end', function() {
      clientList.remove(client);
    });
  });

  broadcast = function(data, client) {
    var cleanup, _client, _i, _j, _len, _len1;
    cleanup = [];
    for (_i = 0, _len = clientList.length; _i < _len; _i++) {
      _client = clientList[_i];
      if (_client !== client) {
        if (_client.writable) {
          _client.write(client.name + ' says ' + data.toString());
        } else {
          cleanup.push(_client);
          _client.destroy();
        }
      }
    }
    for (_j = 0, _len1 = cleanup.length; _j < _len1; _j++) {
      _client = cleanup[_j];
      clientList.remove(_client);
    }
  };

  clientList.remove = function(client) {
    this.splice(this.indexOf(client), 1);
  };

  chatServer.listen(9090);

}).call(this);