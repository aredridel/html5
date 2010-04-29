var HTML5 = require('html5');

var sys = require('sys');

var debugFlags = {any: true}

HTML5.debug = function(section, str) {
	if(section && !str) {
		str = section;
		section = 'any';
	}
	if(debugFlags[section]) sys.debug(str)
}

HTML5.enableDebug = function(section) {
	debugFlags[section] = true;
}

