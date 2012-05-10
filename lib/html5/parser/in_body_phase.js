var HTML5 = require('../../html5');
var Phase = require('./phase').Phase;
var assert = require('assert')

var start_tag_handlers = {
	html: 'startTagHtml',
	head: 'startTagHead',
	base: 'startTagProcessInHead',
	link: 'startTagProcessInHead',
	meta: 'startTagProcessInHead',
	script: 'startTagProcessInHead',
	style: 'startTagProcessInHead',
	title: 'startTagTitle',
	body: 'startTagBody',
	form: 'startTagForm',
	plaintext: 'startTagPlaintext',
	a: 'startTagA',
	button: 'startTagButton',
	xmp: 'startTagXmp',
	table: 'startTagTable',
	hr: 'startTagHr',
	image: 'startTagImage',
	input: 'startTagInput',
	textarea: 'startTagTextarea',
	select: 'startTagSelect',
	isindex: 'startTagIsindex',
	applet:	'startTagAppletMarqueeObject',
	marquee:	'startTagAppletMarqueeObject',
	object:	'startTagAppletMarqueeObject',
	li: 'startTagListItem',
	dd: 'startTagListItem',
	dt: 'startTagListItem',
	address: 'startTagCloseP',
	blockquote: 'startTagCloseP',
	center: 'startTagCloseP',
	dir: 'startTagCloseP',
	div: 'startTagCloseP',
	dl: 'startTagCloseP',
	fieldset: 'startTagCloseP',
	listing: 'startTagCloseP',
	menu: 'startTagCloseP',
	ol: 'startTagCloseP',
	p: 'startTagCloseP',
	pre: 'startTagCloseP', /// @todo: Handle <pre> and <listing> specially with regards to newlines
	ul: 'startTagCloseP',
	b: 'startTagFormatting',
	big: 'startTagFormatting',
	em: 'startTagFormatting',
	font: 'startTagFormatting',
	i: 'startTagFormatting',
	s: 'startTagFormatting',
	small: 'startTagFormatting',
	strike: 'startTagFormatting',
	strong: 'startTagFormatting',
	tt: 'startTagFormatting',
	u: 'startTagFormatting',
	nobr: 'startTagNobr',
	area: 'startTagVoidFormatting',
	basefont: 'startTagVoidFormatting',
	bgsound: 'startTagVoidFormatting',
	br: 'startTagVoidFormatting',
	embed: 'startTagVoidFormatting',
	img: 'startTagVoidFormatting',
	param: 'startTagVoidFormatting',
	spacer: 'startTagVoidFormatting',
	wbr: 'startTagVoidFormatting',
	iframe: 'startTagCdata',
	noembed: 'startTagCdata',
	noframes: 'startTagCdata',
	noscript: 'startTagCdata',
	h1: 'startTagHeading',
	h2: 'startTagHeading',
	h3: 'startTagHeading',
	h4: 'startTagHeading',
	h5: 'startTagHeading',
	h6: 'startTagHeading',
	caption: 'startTagMisplaced',
	col: 'startTagMisplaced',
	colgroup: 'startTagMisplaced',
	frame: 'startTagMisplaced',
	frameset: 'startTagMisplaced',
	head: 'startTagMisplaced',
	tbody: 'startTagMisplaced',
	td: 'startTagMisplaced',
	tfoot: 'startTagMisplaced',
	th: 'startTagMisplaced',
	thead: 'startTagMisplaced',
	tr: 'startTagMisplaced',
	option: 'startTagMisplaced',
	optgroup: 'startTagMisplaced',
	'event-source': 'startTagNew',
	section: 'startTagNew',
	nav: 'startTagNew',
	article: 'startTagNew',
	aside: 'startTagNew',
	header: 'startTagNew',
	footer: 'startTagNew',
	datagrid: 'startTagNew',
	command: 'startTagNew',
	math: 'startTagMath',
	svg: 'startTagSVG',
    rt: 'startTagRpRt',
    rp: 'startTagRpRt',
	"-default": 'startTagOther',
}

var end_tag_handlers = {
	p: 'endTagP',
	body: 'endTagBody',
	html: 'endTagHtml',
	form: 'endTagForm',
	applet: 'endTagAppletButtonMarqueeObject',
	button: 'endTagAppletButtonMarqueeObject',
	marquee: 'endTagAppletButtonMarqueeObject',
	object: 'endTagAppletButtonMarqueeObject',
	dd: 'endTagListItem',
	dt: 'endTagListItem',
	li: 'endTagListItem',
	address: 'endTagBlock',
	blockquote: 'endTagBlock',
	center: 'endTagBlock',
	div: 'endTagBlock',
	dl: 'endTagBlock',
	fieldset: 'endTagBlock',
	listing: 'endTagBlock',
	menu: 'endTagBlock',
	ol: 'endTagBlock',
	pre: 'endTagBlock',
	ul: 'endTagBlock',
	h1: 'endTagHeading',
	h2: 'endTagHeading',
	h3: 'endTagHeading',
	h4: 'endTagHeading',
	h5: 'endTagHeading',
	h6: 'endTagHeading',
	a: 'endTagFormatting',
	b: 'endTagFormatting',
	big: 'endTagFormatting',
	em: 'endTagFormatting',
	font: 'endTagFormatting',
	i: 'endTagFormatting',
	nobr: 'endTagFormatting',
	s: 'endTagFormatting',
	small: 'endTagFormatting',
	strike: 'endTagFormatting',
	strong: 'endTagFormatting',
	tt: 'endTagFormatting',
	u: 'endTagFormatting',
	head: 'endTagMisplaced',
	frameset: 'endTagMisplaced',
	select: 'endTagMisplaced',
	optgroup: 'endTagMisplaced',
	option: 'endTagMisplaced',
	table: 'endTagMisplaced',
	caption: 'endTagMisplaced',
	colgroup: 'endTagMisplaced',
	col: 'endTagMisplaced',
	thead: 'endTagMisplaced',
	tfoot: 'endTagMisplaced',
	tbody: 'endTagMisplaced',
	tr: 'endTagMisplaced',
	td: 'endTagMisplaced',
	th: 'endTagMisplaced',
	br: 'endTagBr',
	area: 'endTagNone',
	basefont: 'endTagNone',
	bgsound: 'endTagNone',
	embed: 'endTagNone',
	hr: 'endTagNone',
	image: 'endTagNone',
	img: 'endTagNone',
	input: 'endTagNone',
	isindex: 'endTagNone',
	param: 'endTagNone',
	spacer: 'endTagNone',
	wbr: 'endTagNone',
	frame: 'endTagNone',
	noframes:	'endTagCdataTextAreaXmp',
	noscript:	'endTagCdataTextAreaXmp',
	noembed:	'endTagCdataTextAreaXmp',
	textarea:	'endTagCdataTextAreaXmp',
	xmp:	'endTagCdataTextAreaXmp',
	iframe:	'endTagCdataTextAreaXmp',
	'event-source': 'endTagNew',
	section: 'endTagNew',
	nav: 'endTagNew',
	article: 'endTagNew',
	aside: 'endTagNew',
	header: 'endTagNew',
	footer: 'endTagNew',
	datagrid: 'endTagNew',
	command: 'endTagNew',
    title: 'endTagTitle',
	"-default": 'endTagOther',
}

var p = exports.Phase = function InBodyPhase(parser, tree) {
	Phase.call(this, parser, tree);
	this.start_tag_handlers = start_tag_handlers;
	this.end_tag_handlers = end_tag_handlers;
	this.name = 'in_body_phase';
}

p.prototype = new Phase;

p.prototype.processSpaceCharactersDropNewline = function(data) {
	this.dropNewline = false
	var lastTag = this.tree.open_elements.last().tagName.toLowerCase()
	if(data.length > 0 && data[0] == "\n" && ('pre' == lastTag || 'textarea' == lastTag) && !this.tree.open_elements.last().hasChildNodes()) {
		data = data.slice(1)
	}

	if(data.length > 0) {
		this.tree.reconstructActiveFormattingElements()
		this.tree.insert_text(data)
	}
}

p.prototype.processSpaceCharacters = function(data) {
	if(this.dropNewline) {
		this.processSpaceCharactersDropNewline(data)
	} else {
		this.processSpaceCharactersNonPre(data)
	}
}

p.prototype.processSpaceCharactersNonPre = function(data) {
	this.tree.reconstructActiveFormattingElements();
	this.tree.insert_text(data);
}

p.prototype.processCharacters = function(data) {
	// XXX The specification says to do this for every character at the moment,
	// but apparently that doesn't match the real world so we don't do it for
	// space characters.
	this.tree.reconstructActiveFormattingElements();
	this.tree.insert_text(data);
}

p.prototype.startTagProcessInHead = function(name, attributes) {
	new HTML5.PHASES.inHead(this.parser, this.tree).processStartTag(name, attributes);
}

p.prototype.startTagBody = function(name, attributes) {
	this.parse_error('unexpected-start-tag', {name: 'body'});
	if(this.tree.open_elements.length == 1 
		|| this.tree.open_elements[1].tagName.toLowerCase() != 'body') {
		assert.ok(this.parser.inner_html)
	} else {
		for(var i = 0; i < attributes.length; i++) {
			if(!this.tree.open_elements[1].getAttribute(attributes[i].nodeName)) {
				this.tree.open_elements[1].setAttribute(attributes[i].nodeName, attributes[i].nodeValue);
			}
		}
	}
}

p.prototype.startTagCloseP = function(name, attributes) {
	if(this.inScope('p', HTML5.BUTTON_SCOPING_ELEMENTS)) this.endTagP('p');
	this.tree.insert_element(name, attributes);
	if(name == 'pre') {
		this.dropNewline = true
	}
}

p.prototype.startTagForm = function(name, attributes) {
	if(this.tree.formPointer) {
		this.parse_error('unexpected-start-tag', {name: name});
	} else {
		if(this.inScope('p', HTML5.BUTTON_SCOPING_ELEMENTS)) this.endTagP('p');
		this.tree.insert_element(name, attributes);
		this.tree.formPointer = this.tree.open_elements.last();
	}
}

p.prototype.startTagRpRt = function(name, attributes) {
	if(this.inScope('ruby')) {
        this.tree.generateImpliedEndTags();
        if(this.tree.open_elements.last().tagName.toLowerCase() != 'ruby') {
	        this.parse_error('unexpected child of ruby');
            while(this.tree.open_elements.last().tagName.toLowerCase() != 'ruby') this.tree.pop_element();
        }
    }
    this.startTagOther(name, attributes);
}

p.prototype.startTagListItem = function(name, attributes) {
	/// @todo: Fix according to current spec. http://www.w3.org/TR/html5/tree-construction.html#parsing-main-inbody
	var stopNames = {li: ['li'], dd: ['dd', 'dt'], dt: ['dd', 'dt']};
	var stopName = stopNames[name];

	var els = this.tree.open_elements;
	for(var i = els.length - 1; i >= 0; i--) {
		var node = els[i];
		if(stopName.indexOf(node.tagName.toLowerCase()) != -1) {
			var poppedNodes = [];
			while(els.length - 1 >= i) {
				poppedNodes.push(els.pop());
			}
			if(poppedNodes.length >= 1) {
				this.parse_error(poppedNodes.length == 1 ? "missing-end-tag" : "missing-end-tags",
					{name: poppedNodes.slice(0).map(function (n) { return n.name }).join(', ')});
			}
			break;
		}

		// Phrasing eliments are all non special, non scoping, non
		// formatting elements
		if(HTML5.SPECIAL_ELEMENTS.concat(HTML5.SCOPING_ELEMENTS).indexOf(node.tagName.toLowerCase()) != -1 && (node.tagName.toLowerCase() != 'address' && node.tagName.toLowerCase() != 'div')) break;
	}
	if(this.inScope('p', HTML5.BUTTON_SCOPING_ELEMENTS)) this.endTagP('p');

	// Always insert an <li> element
	this.tree.insert_element(name, attributes);
}

p.prototype.startTagPlaintext = function(name, attributes) {
	if(this.inScope('p', HTML5.BUTTON_SCOPING_ELEMENTS)) this.endTagP('p');
	this.tree.insert_element(name, attributes);
	this.parser.tokenizer.content_model = HTML5.Models.PLAINTEXT;
}

p.prototype.startTagHeading = function(name, attributes) {
	if(this.inScope('p', HTML5.BUTTON_SCOPING_ELEMENTS)) this.endTagP('p');
	if(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].indexOf(this.tree.open_elements.last().tagName) != -1) {
		this.parse_error('heading in heading');
		this.tree.pop_element();
	}

	this.tree.insert_element(name, attributes);
}

p.prototype.startTagA = function(name, attributes) {
	var afeAElement;
	if(afeAElement = this.tree.elementInActiveFormattingElements('a')) {
		this.parse_error("unexpected-start-tag-implies-end-tag", {startName: "a", endName: "a"});
		this.endTagFormatting('a');
		var pos;
		pos = this.tree.open_elements.indexOf(afeAElement);
		if(pos != -1) this.tree.open_elements.splice(pos, 1);
		pos = this.tree.activeFormattingElements.indexOf(afeAElement);
		if(pos != -1) this.tree.activeFormattingElements.splice(pos, 1);
	}
	this.tree.reconstructActiveFormattingElements();
	this.addFormattingElement(name, attributes);
}

p.prototype.startTagFormatting = function(name, attributes) {
	this.tree.reconstructActiveFormattingElements();
	this.addFormattingElement(name, attributes);
}

p.prototype.startTagNobr = function(name, attributes) {
	this.tree.reconstructActiveFormattingElements();
	if(this.inScope('nobr')) {
		this.parse_error("unexpected-start-tag-implies-end-tag", {startName: 'nobr', endName: 'nobr'});
		this.processEndTag('nobr');
	}
	this.addFormattingElement(name, attributes);
}

p.prototype.startTagButton = function(name, attributes) {
	if(this.inScope('button')) {
		this.parse_error('unexpected-start-tag-implies-end-tag', {startName: 'button', endName: 'button'});
		this.processEndTag('button');
		this.parser.phase.processStartTag(name, attributes);
	} else {
		this.tree.reconstructActiveFormattingElements();
		this.tree.insert_element(name, attributes);
		/// @todo set frameset-ok flag to false
		/// @todo is the marker needed anymore?
		this.tree.activeFormattingElements.push(HTML5.Marker);
	}
}

p.prototype.startTagAppletMarqueeObject = function(name, attributes) {
	this.tree.reconstructActiveFormattingElements();
	this.tree.insert_element(name, attributes)
	this.tree.activeFormattingElements.push(HTML5.Marker);
}

p.prototype.endTagAppletButtonMarqueeObject = function(name) {
	if(!this.inScope(name)) {
		this.parse_error("unexpected-end-tag", {name: name});
	} else {
		this.tree.generateImpliedEndTags()
		if(this.tree.open_elements.last().tagName.toLowerCase() != name) {
			this.parse_error('end-tag-too-early', {name: name})
		}
		this.tree.remove_open_elements_until(name)
		this.tree.clearActiveFormattingElements()
	}
}

p.prototype.startTagXmp = function(name, attributes) {
	this.tree.reconstructActiveFormattingElements();
	this.tree.insert_element(name, attributes);
	this.parser.tokenizer.content_model = HTML5.Models.CDATA;
}

p.prototype.startTagTable = function(name, attributes) {
	if(this.inScope('p')) this.processEndTag('p');
	this.tree.insert_element(name, attributes);
	this.parser.newPhase('inTable');
}

p.prototype.startTagVoidFormatting = function(name, attributes) {
	this.tree.reconstructActiveFormattingElements();
	this.tree.insert_element(name, attributes);
	this.tree.pop_element();
}

p.prototype.startTagHr = function(name, attributes) {
	if(this.inScope('p')) this.endTagP('p');
	this.tree.insert_element(name, attributes);
	this.tree.pop_element();
}

p.prototype.startTagImage = function(name, attributes) {
	// No, really...
	this.parse_error('unexpected-start-tag-treated-as', {originalName: 'image', newName: 'img'});
	this.processStartTag('img', attributes);
}

p.prototype.startTagInput = function(name, attributes) {
	this.tree.reconstructActiveFormattingElements();
	this.tree.insert_element(name, attributes);
	if(this.tree.formPointer) {
		// XXX Not sure what to do here
	}
	this.tree.pop_element();
}

p.prototype.startTagIsindex = function(name, attributes) {
	this.parse_error('deprecated-tag', {name: 'isindex'});
	if(this.tree.formPointer) return;
	this.processStartTag('form');
	this.processStartTag('hr');
	this.processStartTag('p');
	this.processStartTag('label');
	this.processCharacters("This is a searchable index. Insert your search keywords here: ");
	attributes.push({nodeName: 'name', nodeValue: 'isindex'})
	this.processStartTag('input', attributes);
	this.processEndTag('label');
	this.processEndTag('p');
	this.processStartTag('hr');
	this.processEndTag('form');
}

p.prototype.startTagTextarea = function(name, attributes) {
	// XXX Form element pointer checking here as well...
	this.tree.insert_element(name, attributes)
	this.parser.tokenizer.content_model = HTML5.Models.RCDATA;
	this.dropNewline = true
}

p.prototype.startTagCdata = function(name, attributes) {
	this.tree.insert_element(name, attributes)
	this.parser.tokenizer.content_model = HTML5.Models.CDATA;
}

p.prototype.startTagSelect = function(name, attributes) {
	this.tree.reconstructActiveFormattingElements();
	this.tree.insert_element(name, attributes);
	
	var phaseName = this.parser.phaseName;
	if(phaseName == 'inTable' || phaseName == 'inCaption'
		|| phaseName == 'inColumnGroup'
		|| phaseName == 'inTableBody'
		|| phaseName == 'inRow'
		|| phaseName == 'inCell') {
		this.parser.newPhase('inSelectInTable');
	} else {
		this.parser.newPhase('inSelect');
	}
}

p.prototype.startTagMisplaced = function(name, attributes) {
	this.parse_error('unexpected-start-tag-ignored', {name: name});
}

p.prototype.endTagMisplaced = function(name) {
	// This handles elements with end tags in other insertion modes.
	this.parse_error("unexpected-end-tag", {name: name})
}

p.prototype.endTagBr = function(name) {
	this.parse_error("unexpected-end-tag-treated-as", {originalName: "br", newName: "br element"})
	this.tree.reconstructActiveFormattingElements()
	this.tree.insert_element(name, [])
	this.tree.pop_element()

}

p.prototype.startTagOptionOptgroup = function(name, attributes) {
	if(this.inScope('option')) this.endTagOther('option');
	this.tree.reconstructActiveFormattingElements();
	this.tree.insert_element(name, attributes);
}

p.prototype.startTagNew = function(name, attributes) {	
	this.startTagOther(name, attributes);
}

p.prototype.startTagOther = function(name, attributes) {
	this.tree.reconstructActiveFormattingElements();
	this.tree.insert_element(name, attributes);
}

p.prototype.startTagTitle = function(name, attributes) {
	this.tree.insert_element(name, attributes);
	this.parser.tokenizer.content_model = HTML5.Models.RCDATA;
}

p.prototype.endTagTitle = function(name, attributes) {
	if(this.tree.open_elements[this.tree.open_elements.length - 1].tagName.toLowerCase() == name.toLowerCase()) {
		this.tree.pop_element()
        this.parser.tokenizer.content_model = HTML5.Models.PCDATA;
	} else {
		this.parse_error('unexpected-end-tag', {name: name});
	}
}

p.prototype.endTagOther = function endTagOther(name) {
	var nodes = this.tree.open_elements;
	for(var eli = nodes.length - 1; eli > 0; eli--) {
		var currentNode = nodes[eli];
		if(nodes[eli].tagName.toLowerCase() == name) {
			this.tree.generateImpliedEndTags();
			if(this.tree.open_elements.last().tagName.toLowerCase() != name) {
				this.parse_error('unexpected-end-tag', {name: name});
			}
			
			this.tree.remove_open_elements_until(function(el) {
				return el == currentNode;
			});

			break;
		} else {

			if(HTML5.SPECIAL_ELEMENTS.concat(HTML5.SCOPING_ELEMENTS).indexOf(nodes[eli].tagName.toLowerCase()) != -1) {
				this.parse_error('unexpected-end-tag', {name: name});   
				break;
			}
		}
	}
}

p.prototype.startTagMath = function(name, attributes) {
	this.tree.reconstructActiveFormattingElements();
	attributes = this.adjust_mathml_attributes(attributes);
	attributes = this.adjust_foreign_attributes(attributes);
	this.tree.insert_foreign_element(name, attributes, 'math');
	if(false) {
		// If the token has its self-closing flag set, pop the current node off
		// the stack of open elements and acknowledge the token's self-closing flag
	} else {
		this.parser.secondary_phase = this.parser.phase;
		this.parser.newPhase('inForeignContent');
	}
}

p.prototype.startTagSVG = function(name, attributes) {
	this.tree.reconstructActiveFormattingElements();
	attributes = this.adjust_svg_attributes(attributes);
	attributes = this.adjust_foreign_attributes(attributes);
	this.tree.insert_foreign_element(name, attributes, 'svg');
	if(false) {
		// If the token has its self-closing flag set, pop the current node off
		// the stack of open elements and acknowledge the token's self-closing flag
	} else {
		this.parser.secondary_phase = this.parser.phase;
		this.parser.newPhase('inForeignContent');
	}
}

p.prototype.endTagP = function(name) {
	if(!this.inScope('p', HTML5.BUTTON_SCOPING_ELENENTS)) {
		this.parse_error('unexpected-end-tag', {name: 'p'});
		this.startTagCloseP('p', {});
		this.endTagP('p');
	} else {
		this.tree.generateImpliedEndTags('p');
		if(!this.tree.open_elements.last().tagName.toLowerCase() == 'p')
			this.parse_error('unexpected-end-tag', {name: 'p'});
		this.tree.remove_open_elements_until(name);
	}
}

p.prototype.endTagBody = function(name) {
	if(!this.inScope('body')) {
		this.parse_error('unexpected-end-tag', {name: 'body'});
		return;
	}

	/// @todo Emit parse error on end tags other than the ones listed in http://www.w3.org/TR/html5/tree-construction.html#parsing-main-inbody
	if(this.tree.open_elements.last().tagName.toLowerCase() != 'body') {
		this.parse_error('expected-one-end-tag-but-got-another', {
			expectedName: 'body',
			gotName: this.tree.open_elements.last().tagName.toLowerCase()
		});
	}
	this.parser.newPhase('afterBody');
}

p.prototype.endTagHtml = function(name) {
	this.endTagBody(name);
	if(!this.inner_html) this.parser.phase.processEndTag(name);
}

p.prototype.endTagBlock = function(name) {
	if(!this.inScope(name)) {
		this.parse_error('end-tag-for-tag-not-in-scope', {name: name});
	} else {
		this.tree.generateImpliedEndTags();
		if(!this.tree.open_elements.last().tagName.toLowerCase() == 'name') {
			this.parse_error('end-tag-too-early', {name: name});
		}
		this.tree.remove_open_elements_until(name);
	}
}

p.prototype.endTagForm = function(name)  {
	var node = this.tree.formPointer;
	this.tree.formPointer = null;
	if(!node || !this.inScope(name)) {
		this.parse_error('end-tag-for-tag-not-in-scope', {name: name});
	} else {
		this.tree.generateImpliedEndTags();
	
		if(this.tree.open_elements.last().tagName.toLowerCase() != name) {
			this.parse_error('end-tag-too-early-ignored', {name: 'form'});
		} else {
			this.tree.pop_element();
			/// @todo the spec is a bit vague here. Remove node from the stack -- what if it's in the middle?
		}
	}
}

p.prototype.endTagListItem = function(name) {
	if(!this.inScope(name, HTML5.LIST_SCOPING_ELEMENTS)) {
		this.parse_error('wrong-end-tag-ignored', {name: name});
	} else {
		this.tree.generateImpliedEndTags(name);
		if(this.tree.open_elements.last().tagName.toLowerCase() != name)
			this.parse_error('end-tag-too-early', {name: name});
		this.tree.remove_open_elements_until(name);
	}
}

p.prototype.endTagHeading = function(name) {
	var error = true;
	var i;

	for(i in HTML5.HEADING_ELEMENTS) {
		var el = HTML5.HEADING_ELEMENTS[i];
		if(this.inScope(el)) {
			error = false;
			break;
		}
	}
	if(error) {
		this.parse_error('wrong-end-tag-ignored', {name: name});
		return;
	}

	this.tree.generateImpliedEndTags();

	if(this.tree.open_elements.last().tagName.toLowerCase() != name)
		this.parse_error('end-tag-too-early', {name: name});

	this.tree.remove_open_elements_until(function(e) {
		return HTML5.HEADING_ELEMENTS.indexOf(e.tagName.toLowerCase()) != -1
	});
}

p.prototype.endTagFormatting = function(name) {
	while(true) {
		var afeElement = this.tree.elementInActiveFormattingElements(name);
		if(!afeElement || (this.tree.open_elements.indexOf(afeElement) != -1
			&& !this.inScope(afeElement.tagName.toLowerCase()))) {
			this.parse_error('adoption-agency-1.1', {name: name});
			return;
		} else if(this.tree.open_elements.indexOf(afeElement) == -1) {
			this.parse_error('adoption-agency-1.2', {name: name});
			this.tree.activeFormattingElements.splice(this.tree.activeFormattingElements.indexOf(afeElement), 1);
			return;
		}

		if(afeElement != this.tree.open_elements.last()) {
			this.parse_error('adoption-agency-1.3', {name: name});
		}
		
		// Start of the adoption agency algorithm proper
		var afeIndex = this.tree.open_elements.indexOf(afeElement);
		var furthestBlock = null;
		var els = this.tree.open_elements.slice(afeIndex);
        var len = els.length;
        for(var i = 0; i < len; i++) {
			var element = els[i];
			if(HTML5.SPECIAL_ELEMENTS.concat(HTML5.SCOPING_ELEMENTS).indexOf(element.tagName.toLowerCase()) != -1) {
				furthestBlock = element;
				break;
			}
		}
		
		if(!furthestBlock) {
			var element = this.tree.remove_open_elements_until(function(el) {
				return el == afeElement;
			});
			this.tree.activeFormattingElements.splice(this.tree.activeFormattingElements.indexOf(element), 1);
			return;
		}


		var commonAncestor = this.tree.open_elements[afeIndex - 1];

		var bookmark = this.tree.activeFormattingElements.indexOf(afeElement);

		var lastNode;
		var node;
		lastNode = node = furthestBlock;

		while(true) {
			node = this.tree.open_elements[this.tree.open_elements.indexOf(node) - 1];
			while(this.tree.activeFormattingElements.indexOf(node) == -1) {
				var tmpNode = node;
				node = this.tree.open_elements[this.tree.open_elements.indexOf(node) - 1];
				this.tree.open_elements.splice(this.tree.open_elements.indexOf(tmpNode), 1);
			}

			if(node == afeElement) break;

			if(lastNode == furthestBlock) {
				bookmark = this.tree.activeFormattingElements.indexOf(node) + 1;
			}

			var cite = node.parentNode;

			if(node.hasChildNodes()) {
				var clone = node.cloneNode();
				this.tree.activeFormattingElements[this.tree.activeFormattingElements.indexOf(node)] = clone;
				this.tree.open_elements[this.tree.open_elements.indexOf(node)] = clone;
				node = clone;
			}

			if(lastNode.parent) lastNode.parent.removeChild(lastNode);
			node.appendChild(lastNode);
5
			lastNode = node

		}

		if(lastNode.parent) lastNode.parent.removeChild(lastNode);
		commonAncestor.appendChild(lastNode);

		clone = afeElement.cloneNode();

		this.tree.reparentChildren(furthestBlock, clone);

		furthestBlock.appendChild(clone);

		this.tree.activeFormattingElements.splice(this.tree.activeFormattingElements.indexOf(afeElement), 1);
		this.tree.activeFormattingElements.splice(Math.min(bookmark, this.tree.activeFormattingElements.length), 0, clone);

		this.tree.open_elements.splice(this.tree.open_elements.indexOf(afeElement), 1);
		this.tree.open_elements.splice(this.tree.open_elements.indexOf(furthestBlock) + 1, 0, clone);

	}
}

p.prototype.addFormattingElement = function(name, attributes) {
	this.tree.insert_element(name, attributes);
	this.tree.activeFormattingElements.push(this.tree.open_elements.last());
}
