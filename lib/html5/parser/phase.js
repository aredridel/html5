var HTML5 = require('../parser').HTML5;
var assert = require('assert');

exports.Phase = function Phase(parser, tree) {
	this.tree = tree;
	this.parser = parser;
	this.end_tag_handlers = {"-default": 'endTagOther'};
	this.start_tag_handlers = {"-default": 'startTagOther'};
}

exports.Phase.prototype = {
	parse_error: function(code, options) {
		this.parser.parse_error(code, options);
	},
	processEOF: function() {
		this.tree.generateImpliedEndTags();
		if(this.tree.open_elements.length > 2) {
			this.parse_error('expected-closing-tag-but-got-eof');
		} else if(this.tree.open_elements.length == 2
			&& this.tree.open_elements[1].tagName.toLowerCase() != 'body') {
			// This happens for framesets or something?
			this.parse_error('expected-closing-tag-but-got-eof');
		} else if(this.parser.inner_html && this.tree.open_elements.length > 1) {
			// XXX This is not what the specification says. Not sure what to do here.
			this.parse_error('eof-in-innerhtml');
		}
	},
	processComment: function(data) {
		// For most phases the following is correct. Where it's not it will be 
		// overridden.
		this.tree.insert_comment(data, this.tree.open_elements.last());
	},
	processDoctype: function(name, publicId, systemId, correct) {
		this.parse_error('unexpected-doctype');
	},
	processSpaceCharacters: function(data) {
		this.tree.insert_text(data);
	},
	processStartTag: function(name, attributes, self_closing) {
		if(this[this.start_tag_handlers[name]]) {
			this[this.start_tag_handlers[name]](name, attributes, self_closing);
		} else if(this[this.start_tag_handlers["-default"]]) {
			this[this.start_tag_handlers["-default"]](name, attributes, self_closing);
		} else {
			throw(new Error("No handler found for "+name));
		}
	},
	processEndTag: function(name) {
		if(this[this.end_tag_handlers[name]]) {
			this[this.end_tag_handlers[name]](name);
		} else if(this[this.end_tag_handlers["-default"]]) {
			this[this.end_tag_handlers["-default"]](name);
		} else {
			throw(new Error("No handler found for "+name));
		}
	},
	inScope: function(name, scopingElements) {
		var tree = this.tree;
		if(!scopingElements) scopingElements = HTML5.SCOPING_ELEMENTS;
		if(tree.open_elements.length == 0) return false
		for(var i = tree.open_elements.length - 1; i >= 0; i--) {
			if (tree.open_elements[i].tagName == undefined) return false;
			if(tree.open_elements[i].tagName.toLowerCase() == name) return true;
			if(scopingElements.indexOf(tree.open_elements[i].tagName.toLowerCase()) != -1) return false;
		}
		return false; 
	},
	startTagHtml: function(name, attributes) {
		if(this.parser.first_start_tag == false && name == 'html') {
			this.parse_error('non-html-root')
		}
		// XXX Need a check here to see if the first start tag token emitted is this token. . . if it's not, invoke parse_error.
		for(var i = 0; i < attributes.length; i++) {
			if(!this.tree.open_elements[0].getAttribute(attributes[i].nodeName)) {
				this.tree.open_elements[0].setAttribute(attributes[i].nodeName, attributes[i].nodeValue)
			}
		}
		this.parser.first_start_tag = false;
	},
	adjust_mathml_attributes: function(attributes) {
		return attributes.map(function(a) {
			if(a[0] =='definitionurl') {
				return ['definitionURL', a[1]]
			} else {
				return a;
			}
		});
	},
	adjust_svg_attributes: function(attributes) {
		return attributes.map(function(a) {
			return SVGAttributeMap[a] ? SVGAttributeMap[a] : a;
		});
	},
	adjust_foreign_attributes: function (attributes) {
		for(var i = 0; i < attributes.length; i++) {
			if(attributes[i].nodeName.indexOf(':') != -1) {
				var t = attributes[i].nodeName.split(/:/);
				attributes[i].namespace = t[0];
				attributes[i].nodeName = t[1];
			}
		}
		return attributes;
	}
}

var SVGAttributeMap = {
	attributename:	'attributeName',
	attributetype:	'attributeType',
	basefrequency:	'baseFrequency',
	baseprofile:	'baseProfile',
	calcmode:	'calcMode',
	clippathunits:	'clipPathUnits',
	contentscripttype:	'contentScriptType',
	contentstyletype:	'contentStyleType',
	diffuseconstant:	'diffuseConstant',
	edgemode:	'edgeMode',
	externalresourcesrequired:	'externalResourcesRequired',
	filterres:	'filterRes',
	filterunits:	'filterUnits',
	glyphref:	'glyphRef',
	gradienttransform:	'gradientTransform',
	gradientunits:	'gradientUnits',
	kernelmatrix:	'kernelMatrix',
	kernelunitlength:	'kernelUnitLength',
	keypoints:	'keyPoints',
	keysplines:	'keySplines',
	keytimes:	'keyTimes',
	lengthadjust:	'lengthAdjust',
	limitingconeangle:	'limitingConeAngle',
	markerheight:	'markerHeight',
	markerunits:	'markerUnits',
	markerwidth:	'markerWidth',
	maskcontentunits:	'maskContentUnits',
	maskunits:	'maskUnits',
	numoctaves:	'numOctaves',
	pathlength:	'pathLength',
	patterncontentunits:	'patternContentUnits',
	patterntransform:	'patternTransform',
	patternunits:	'patternUnits',
	pointsatx:	'pointsAtX',
	pointsaty:	'pointsAtY',
	pointsatz:	'pointsAtZ',
	preservealpha:	'preserveAlpha',
	preserveaspectratio:	'preserveAspectRatio',
	primitiveunits:	'primitiveUnits',
	refx:	'refX',
	refy:	'refY',
	repeatcount:	'repeatCount',
	repeatdur:	'repeatDur',
	requiredextensions:	'requiredExtensions',
	requiredfeatures:	'requiredFeatures',
	specularconstant:	'specularConstant',
	specularexponent:	'specularExponent',
	spreadmethod:	'spreadMethod',
	startoffset:	'startOffset',
	stddeviation:	'stdDeviation',
	stitchtiles:	'stitchTiles',
	surfacescale:	'surfaceScale',
	systemlanguage:	'systemLanguage',
	tablevalues:	'tableValues',
	targetx:	'targetX',
	targety:	'targetY',
	textlength:	'textLength',
	viewbox:	'viewBox',
	viewtarget:	'viewTarget',
	xchannelselector:	'xChannelSelector',
	ychannelselector:	'yChannelSelector',
	zoomandpan:	'zoomAndPan'
};
