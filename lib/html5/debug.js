var HTML5 = require('../html5');

var sys = require('sys');

var debugFlags = {any: true}

HTML5.debug = function() {
	section = arguments[0];
	if(debugFlags[section] || debugFlags[section.split('.')[0]]) {
		var str = [];
		for(var i in arguments) {
			str.push(sys.inspect(arguments[i]))
		}
		sys.debug(str.join(' '))
	}
}

HTML5.enableDebug = function(section) {
	debugFlags[section] = true;
}

HTML5.disableDebug = function(section) {
	debugFlags[section] = false;
}

HTML5.dumpTagStack = function(tags) {
	var r = [];
	for(i in tags) {
		r.push(tags[i].tagName);
	}
	return r.join(', ');
}
