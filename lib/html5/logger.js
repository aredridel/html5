var util = require('util');

var debugFlags = {any: true};

exports.log = function(section) {
	if(debugFlags[section] || debugFlags[section.split('.')[0]]) {
		var out = [];
		for(var i in arguments) {
			out.push(arguments[i])
		}
		console.log(util.inspect(out, false, 3))
	}
};

exports.enableDebug = function(section) {
	debugFlags[section] = true;
};

exports.disableDebug = function(section) {
	debugFlags[section] = false;
};

exports.dumpTagStack = function(tags) {
	var r = [];
	for(var i in tags) {
		r.push(tags[i].tagName);
	}
	return r.join(', ');
};
