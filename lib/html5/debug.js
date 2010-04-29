var HTML5 = require('html5');

var sys = require('sys');

var debugFlags = {any: true}

HTML5.debug = function(section, str) {
	if(section && !str) {
		str = section;
		section = 'any';
	}
	if(debugFlags[section]) { 
		sys.debug(str)
	} else if(debugFlags[section.split('.')[0]]) {
		sys.debug(str)
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
