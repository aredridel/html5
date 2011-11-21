exports.readTestData = function(filename) { 
	var fs = require('fs');

	var lines = fs.readFileSync(filename, 'utf-8').split("\n")

	var state;
	var output = []
	var current = {}
	var section;


	function readHeader(line) {
		if(line[0] != '#') throw ("Got " + line[0] + " but expected #");
		section = line.slice(1);
		if(section == 'document') {
			current[section] = '';
			state = readDocument;
		} else if(section == 'errors') {
			current[section] = [];
			state = readArray;
		} else {
			current[section] = '';
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
		current[section] += line + "\n";
	}

	function readDocument(line) {
		if(line[0] == '|') line = line.slice(2);
		current[section] += line + "\n";
	}

	state = readHeader;
	for(var l in lines) {
		if(lines[l][0] == '#') {
			state = readHeader;
		} else if(lines[l] == '' && section !== 'data') {
			output.push(current);
			current = {};
			continue;
		}
		state(lines[l]);
	}

	if(Object.keys(current).length > 0) output.push(current);

	return output;
}
