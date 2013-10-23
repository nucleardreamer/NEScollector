var http = require('http'),
	Stream = require('stream'),
	streamify = require('streamify'),
	fs = require('fs'),
	qs = require('querystring'),
	_ = require('underscore'),
	color = require('colors');

var outputFile = __dirname + '/NESmore.json',
	inputFile = __dirname + '/nes.json';

var all = [];

fs.readFile(inputFile, function(err, d){
	var raw = JSON.parse(d);
	_.each(raw, function(e,i,a){
		var id = e[4];
		if(id){
			http.get("http://open.api.ebay.com/shopping?callname=FindProducts&responseencoding=JSON&appid=flynnjof-e64a-4fac-b9a5-63d1e94bd821&siteid=0&version=525&ProductID.type=Reference&ProductID.Value=" + id, function(res) {
				var data = '';
			    res.on('data', function (chunk){
			        data += chunk;
			    });

			    res.on('end',function(){
			        var obj = JSON.parse(data);
			        if(obj.Ack !== 'Failure'){
				        fs.appendFile(outputFile, JSON.stringify(obj.Product) + ',\n', function(err){
				        	if (err) throw err;
	  						console.log(i + ' of ' + raw.length);
				        })
			    	} else {
			    		console.log(obj)
			    	}
			    })
			});
		}

	});

})