net = require 'net'

chatServer = net.createServer()
clientList = []

chatServer.on 'connection', (client) ->
	client.name = "#{client.remoteAddress} : #{client.remotePort}"
	client.write "Hi #{client.name}!\n"
	clientList.push(client)
	client.on 'data', (data) ->
		broadcast data, client
		return
	client.on 'end', () ->
		clientList.remove client
		return
	return

broadcast = (data, client) ->
	cleanup = []
	for _client in clientList when _client isnt client 
		if _client.writable 
			_client.write client.name + ' says ' + data.toString() 
		else 
			cleanup.push(_client)
			_client.destroy()
	clientList.remove _client for _client in cleanup
	return

clientList.remove = (client) ->
	@splice @indexOf(client), 1
	return

chatServer.listen 9090
