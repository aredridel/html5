exports.readTestData = function(filename) { 
	var fs = require('fs');

	var lines = fs.readFileSync(filename).split("\n")

	var state;
	var output = []
	var current = {}
	var section;


	function readHeader(line) {
		if(line[0] != '#') throw ("Got " + line[0] + " but expected #");
		section = line.slice(1);
		if(section == 'document') {
			state = readDocument;
		} else if(section == 'errors') {
			state = readArray;
		} else {
			state = readString;
		}
	}

	function readArray(line) {
		if(!current[section]) {
			current[section] = [];
		}
		current[section].push(line);
	}

	function readString(line) {
		if(!current[section]) {
			current[section] = '';
		}
		current[section] += line + "\n";
	}

	function readDocument(line) {
		if(!current[section]) {
			current[section] = '';
		}
		current[section] += line.slice(2) + "\n";
	}

	state = readHeader;
	for(var l in lines) {
		if(lines[l][0] == '#') {
			state = readHeader;
		} else if(lines[l] == '') {
			output.push(current);
			current = {};
		}
		state(lines[l]);
	}

	if(current['data']) output.push(current);

	return output;
}
