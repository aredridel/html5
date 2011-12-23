var Phase = require('./phase').Phase;

var p = exports.Phase = function InitialPhase(parser, tree) {
	Phase.call(this, parser, tree);
	this.name = 'initial_phase';
}

p.prototype = new Phase;

p.prototype.processEOF = function() {
	this.parse_error("expected-doctype-but-got-eof");
	this.parser.newPhase('beforeHTML');
	this.parser.phase.processEOF();
}

p.prototype.processComment = function(data) {
	this.tree.insert_comment(data, this.tree.document);
}

p.prototype.processDoctype = function(name, publicId, systemId, correct) {
	if(name.toLowerCase() != 'html' || publicId || systemId) {
		this.parse_error("unknown-doctype");
	}

	// XXX need to update DOCTYPE tokens
	this.tree.insert_doctype(name, publicId, systemId);

	publicId = (publicId || '').toString().toUpperCase();

	if(name.toLowerCase() != 'html') {
		// XXX quirks mode
	} else {
		if((["+//silmaril//dtd html pro v0r11 19970101//en",
			"-//advasoft ltd//dtd html 3.0 aswedit + extensions//en",
			"-//as//dtd html 3.0 aswedit + extensions//en",
			"-//ietf//dtd html 2.0 level 1//en",
			"-//ietf//dtd html 2.0 level 2//en",
			"-//ietf//dtd html 2.0 strict level 1//en",
			"-//ietf//dtd html 2.0 strict level 2//en",
			"-//ietf//dtd html 2.0 strict//en",
			"-//ietf//dtd html 2.0//en",
			"-//ietf//dtd html 2.1e//en",
			"-//ietf//dtd html 3.0//en",
			"-//ietf//dtd html 3.0//en//",
			"-//ietf//dtd html 3.2 final//en",
			"-//ietf//dtd html 3.2//en",
			"-//ietf//dtd html 3//en",
			"-//ietf//dtd html level 0//en",
			"-//ietf//dtd html level 0//en//2.0",
			"-//ietf//dtd html level 1//en",
			"-//ietf//dtd html level 1//en//2.0",
			"-//ietf//dtd html level 2//en",
			"-//ietf//dtd html level 2//en//2.0",
			"-//ietf//dtd html level 3//en",
			"-//ietf//dtd html level 3//en//3.0",
			"-//ietf//dtd html strict level 0//en",
			"-//ietf//dtd html strict level 0//en//2.0",
			"-//ietf//dtd html strict level 1//en",
			"-//ietf//dtd html strict level 1//en//2.0",
			"-//ietf//dtd html strict level 2//en",
			"-//ietf//dtd html strict level 2//en//2.0",
			"-//ietf//dtd html strict level 3//en",
			"-//ietf//dtd html strict level 3//en//3.0",
			"-//ietf//dtd html strict//en",
			"-//ietf//dtd html strict//en//2.0",
			"-//ietf//dtd html strict//en//3.0",
			"-//ietf//dtd html//en",
			"-//ietf//dtd html//en//2.0",
			"-//ietf//dtd html//en//3.0",
			"-//metrius//dtd metrius presentational//en",
			"-//microsoft//dtd internet explorer 2.0 html strict//en",
			"-//microsoft//dtd internet explorer 2.0 html//en",
			"-//microsoft//dtd internet explorer 2.0 tables//en",
			"-//microsoft//dtd internet explorer 3.0 html strict//en",
			"-//microsoft//dtd internet explorer 3.0 html//en",
			"-//microsoft//dtd internet explorer 3.0 tables//en",
			"-//netscape comm. corp.//dtd html//en",
			"-//netscape comm. corp.//dtd strict html//en",
			"-//o'reilly and associates//dtd html 2.0//en",
			"-//o'reilly and associates//dtd html extended 1.0//en",
			"-//spyglass//dtd html 2.0 extended//en",
			"-//sq//dtd html 2.0 hotmetal + extensions//en",
			"-//sun microsystems corp.//dtd hotjava html//en",
			"-//sun microsystems corp.//dtd hotjava strict html//en",
			"-//w3c//dtd html 3 1995-03-24//en",
			"-//w3c//dtd html 3.2 draft//en",
			"-//w3c//dtd html 3.2 final//en",
			"-//w3c//dtd html 3.2//en",
			"-//w3c//dtd html 3.2s draft//en",
			"-//w3c//dtd html 4.0 frameset//en",
			"-//w3c//dtd html 4.0 transitional//en",
			"-//w3c//dtd html experimental 19960712//en",
			"-//w3c//dtd html experimental 970421//en",
			"-//w3c//dtd w3 html//en",
			"-//w3o//dtd w3 html 3.0//en",
			"-//w3o//dtd w3 html 3.0//en//",
			"-//w3o//dtd w3 html strict 3.0//en//",
			"-//webtechs//dtd mozilla html 2.0//en",
			"-//webtechs//dtd mozilla html//en",
			"-/w3c/dtd html 4.0 transitional/en",
			"html"].indexOf(publicId) != -1) ||
		(systemId == null && ["-//w3c//dtd html 4.01 frameset//EN",
			"-//w3c//dtd html 4.01 transitional//EN"].indexOf(publicId) != -1) ||
		(systemId == 
			"http://www.ibm.com/data/dtd/v11/ibmxhtml1-transitional.dtd")) {
			// XXX quirks mode
		}
	}

	this.parser.newPhase('beforeHTML');
}

p.prototype.processSpaceCharacters = function(data) {

}

p.prototype.processCharacters = function(data) {
	this.parse_error('expected-doctype-but-got-chars');
	this.parser.newPhase('beforeHTML');
	this.parser.phase.processCharacters(data);
}

p.prototype.processStartTag = function(name, attributes, self_closing) {
	this.parse_error('expected-doctype-but-got-start-tag', {name: name});
	this.parser.newPhase('beforeHTML');
	this.parser.phase.processStartTag(name, attributes);
}

p.prototype.processEndTag = function(name) {
	this.parse_error('expected-doctype-but-got-end-tag', {name: name});
	this.parser.newPhase('beforeHTML');
	this.parser.phase.processEndTag(name);
}
