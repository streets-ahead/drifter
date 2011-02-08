var http = require('http'),
	url = require('url'),
	exec  = require('child_process').exec,
	queryString = require('querystring');
	
var apps = {
	"Chatter" : {
		"folder" : "~/Chatter",
		"serverFile" : "server.js"
 	}
//,
	// "eventBum-Backend" : {
	// 		"folder" : "~/eB",
	// 		"serverFile" : "server.js"
	// 	}
};

	
function gitPull(name) {
	exec('cd ' + apps[name].folder, function (error, stdout, stderr) {
		console.log(stdout);
		exec('forever stop ' + apps[name].serverFile, function(error, stdout, stderr) {
			console.log(stdout);
			exec('git pull', function(error, stdout, stderr) {
				console.log(stdout);
				exec('forever start ' + apps[name].serverFile, function (error, stdout, stderr) {
					console.log(stdout);
				});
			});
		});
	});
}
	
http.createServer(function (req, res) {
	var path = url.parse(req.url).pathname;
	console.log(path);
	
	if(path == "/install" && req.method == 'POST') {
		req.on('data', function(chunk) {
			var payloadStr = queryString.parse(chunk.toString()).payload;
			console.log(payloadStr);
			var payload = JSON.parse(payloadStr);
			console.log(payload.repository.name);
		});
		
		try {
			gitPull(payload.repository.name);
		} catch(e) {
			console.log("an error occurred");
			console.log(e);
		}
			res.writeHead(200, {'Content-Type': 'text/plain'});
 			res.end('Success\n');
	} else {
		res.writeHead(404, {'Content-Type': 'text/plain'});
 		res.end('Not Found\n');
	}
}).listen(8124);

console.log('Server running on 8124');