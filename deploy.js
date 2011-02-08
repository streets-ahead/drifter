var http = require('http'),
	url = require('url'),
	exec  = require('child_process').exec;
	
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
	console.log(req.body.payload);
	var payload = JSON.parse(req.body.payload);
	
	if(path == "/install") {
		try {
			gitPull(payload.repository.name);
		} catch(e) {
			
		}
			res.writeHead(200, {'Content-Type': 'text/plain'});
 			res.end('Success\n');
	} else {
		res.writeHead(404, {'Content-Type': 'text/plain'});
 		res.end('Not Found\n');
	}
}).listen(8124, "127.0.0.1");

console.log('Server running at http://127.0.0.1:8124/');