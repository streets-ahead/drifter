var http = require('http'),
	url = require('url'),
	exec  = require('child_process').exec,
	queryString = require('querystring');
	
var apps = {
	"Chatter" : {
		"folder" : "~/Chatter/",
		"serverFile" : "server.js"
 	}
//,
	// "eventBum-Backend" : {
	// 		"folder" : "~/eB",
	// 		"serverFile" : "server.js"
	// 	}
};

	
function gitPull(name) {
	var folder = apps[name].folder;
	exec('cd ' + folder + ' && forever stop 'apps[name].serverFile, function(error, stdout, stderr) {
		console.log(stdout);
		exec('cd ' + folder + ' && git pull', function(error, stdout, stderr) {
			console.log(stdout);
			exec('cd ' + folder + ' && forever start ' apps[name].serverFile, function (error, stdout, stderr) {
				console.log(stdout);
			});
		});
	});

}
	
http.createServer(function (req, res) {
	var path = url.parse(req.url).pathname;
	console.log(path);
	
	if(path == "/install" && req.method == 'POST') {
		var payload, bodyStr = '';
		req.on('data', function(chunk) {
			bodyStr += chunk.toString();
		});
		
		req.on('end', function () {
			var payloadStr = queryString.parse(bodyStr).payload;
			console.log(payloadStr);
			payload = JSON.parse(payloadStr);
			console.log(payload.repository.name);
			gitPull(payload.repository.name);
			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.end('Success\n');
		});
	} else {
		res.writeHead(404, {'Content-Type': 'text/plain'});
 		res.end('Not Found\n');
	}
}).listen(8124);

console.log('Server running on 8124');