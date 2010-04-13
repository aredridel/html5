var Phase = require('html5/parser/phase').Phase;

var start_tag_handlers = {
	html: 'startTagHtml',
	head: 'startTagHead',
	base: 'startTagProcessInHead',
	link: 'startTagProcessInHead',
	meta: 'startTagProcessInHead',
	script: 'startTagProcessInHead',
	style: 'startTagProcessInHead',
	title: 'startTagProcessInHead',
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
	pre: 'startTagCloseP',
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
	option: 'startTagOptionOptiongroup',
	optiongroup: 'startTagOptionOptiongroup',
	'event-source': 'startTagNew',
	section: 'startTagNew',
	nav: 'startTagNew',
	article: 'startTagNew',
	aside: 'startTagNew',
	header: 'startTagNew',
	footer: 'startTagNew',
	datagrid: 'startTagNew',
	command: 'startTagNew',
	math: 'startTagForeignContent',
	svg: 'startTagForeignContent'
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
}

exports.Phase = p = function InBodyPhase(parser, tree) {
	Phase.call(this, parser, tree);
	this.start_tag_handlers = start_tag_handlers;
	this.end_tag_handlers = end_tag_handlers;
	this.name = 'InBodyPhase';
}

p.prototype = new Phase;

p.prototype.processSpaceCharactersDropNewline = function(data) {
	// WTF, mate! Why /would/ you do it that way?!
}

p.prototype.processSpaceCharacters = function(data) {
	this.tree.reconstructActiveFormattingElements();
	this.tree.insertText(data);
}

p.prototype.processCharacters = function(data) {
	// XXX The specification says to do this for every character at the moment,
	// but apparently that doesn't match the real world so we don't do it for
	// space characters.
	this.tree.reconstructActiveFormattingElements();
	this.tree.insertText(data);
}

p.prototype.startTagProcessInHead = function(name, attributes) {
	new PHASES.inHead(this.parser, this.tree).processStartTag(name, attributes);
}

p.prototype.startTagBody = function(name, attributes) {
	this.parse_error('unexpected-start-tag', {name: 'body'});
	if(this.tree.open_elements.length == 1 
		|| this.tree.open_elements[1].name != 'body') {
		// FIXME: assert this.parser.inner_html
	} else {
		for(attr in attributes) {
			if(!this.tree.open_elements[1].attributes[attr] != undefined) {
				this.tree.open_elements[1].attributes[attr] = attributes[attr];
			}
		}
	}
}

p.prototype.startTagCloseP = function(name, attributes) {
	if(this.inScope('p')) this.endTag('p');
	this.tree.insert_element(name, attributes);
	if(name == 'pre' || name == 'listing') {
		// WTF!
	}
}

p.prototype.startTagForm = function(name, attributes) {
	if(this.tree.formPointer) {
		this.parse_error('unexpected-start-tag', {name: name});
	} else {
		if(this.inScope('p')) this.endTagP('p');
		this.tree.insert_element(name, attributes);
		this.tree.formPointer = this.tree.open_elements[this.tree.open_elements.length - 1];
	}
}

p.prototype.startTagListItem = function(name, attributes) {
	if(this.inScope('p')) this.endTagP('p');
	var stopNames = {li: ['li'], dd: ['dd', 'dt'], dt: ['dd', 'dt']};
	var stopName = stopNames[name];

	var els = this.tree.open_elements.reverse();
	for(i in els) {
		var node = els[i];
		if(stopName.indexOf(node.name)) {
			var poppedNodes;
			for(j = 0; j <= i; j++) {
				poppedNodes[j] = this.tree.open_elements.pop();
			}
			if(i >= 1) {
				this.parse_error(i == 1 ? "missing-end-tag" : "missing-end-tags",
					{name: poppedNodes.slice(0).map(function (n) { return n.name }).join(', ')});
			}
			break;
		}

    // Phrasing elements are all non special, non scoping, non
		// formatting elements
		if(SPECIAL_ELEMENTS.concat(SCOPING_ELEMENTS).indexOf(node.name) != -1 && (node.name != 'address' && node.name != 'div')) break;
	}

	// Always insert an <li> element
	this.tree.insert_elemment(name, attributes);
}

p.prototype.startTagPlaintext = function(name, attributes) {
	if(this.inScope('p')) this.endTagP('p');
	this.tree.insert_element(name, attributes);
	this.parser.tokenizer.content_model = Models.PLAINTEXT;
}

p.prototype.startTagHeading = function(name, attributes) {
	if(this.inScope('p')) this.endTagP('p');
	this.tree.insert_element(name, attributes);
}

p.prototype.startTagA = function(name, attributes) {
	var afeAElement;
	if(afeAElement = this.tree.elementInActiveFormattingElements('a')) {
		this.parse_error("unexpected-start-tag-implies-end-tag", {startName: "a", endName: "a"});
		this.endTagFormatting('a');
		var pos;
		pos = this.tree.open_elements.indexOf(afeAElement);
		if(pos != -1) this.tree.open_elements.splice(pos, 0);
		pos = this.tree.activeFormattingElements.indexOf(afeAElement);
		if(pos != -1) this.tree.activeFormattingElements.splice(pos, 0);
	}
	this.tree.reconstructActiveFromattingElements();
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
		this.parse_Error('unexpected-start-tag-implies-end-tag', {startName: 'button', endName: 'button'});
		this.processEndTag('button');
		this.parser.phase.processStartTag(name, attributes);
	} else {
		this.tree.reconstructActiveFormattingElements();
		this.tree.insert_element(name, attributes);
		this.tree.activeFormattingElements.push(Marker);
	}
}

p.prototype.startTagAppletMarqueeObject = function(name, attributes) {
	this.tree.reconstructActiveFormattingElements();
	this.tree.insert_element(name, attributes)
	this.tree.activeFormattingElements.push(Marker);
}

p.prototype.startTagXmp = function(name, attributes) {
	this.tree.reconstructActiveFormattingElements();
	this.tree.insert_element(name, attributes);
	this.parser.tokenizer.content_model = Models.CDATA;
}

p.prototype.startTagTable = function(name, attributes) {
	if(this.inScope('p')) this.processEndTag('p');
	this.tree.insert_element(name, attributes);
	this.parser.phase = new PHASES.inTable(this.parser, this.tree);
}

p.prototype.startTagVoidFormatting = function(name, attributes) {
	this.tree.reconstructActiveFormattingElements();
	this.tree.insert_element(name, attributes);
	this.tree.open_elements.pop();
}

p.prototype.startTagHr = function(name, attributes) {
	if(this.inScope('p')) this.endTagP('p');
	this.tree.insert_element(name, attributes);
	this.tree.open_elements.pop();
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
	this.tree.open_elements.pop();
}

p.prototype.startTagIsindex = function(name, attributes) {
	this.parse_error('deprecated-tag', {name: 'isindex'});
	if(this.tree.formPointer) return;
	processStartTag('form');
	processStartTag('hr');
	processStartTag('p');
	processStartTag('label');
	processCharacters("This is a searchable index. Insert your search keywords here: ");
	attributes['name'] = 'isindex';
	processStartTag('input', attributes);
	processEndTag('label');
	processEndTag('p');
	processStartTag('hr');
	processEndTag('form');
}

p.prototype.startTagTextarea = function(name, attributes) {
	// XXX Form element pointer checking here as well...
	this.tree.insert_element(name, attributes)
	this.parser.tokenizer.content_model = Models.RCDATA;
	// WTF
}

p.prototype.startTagCdata = function(name, attributes) {
	this.tree.insert_element(name, attributes)
	this.parser.tokenizer.content_model = Models.CDATA;
}

p.prototype.startTagSelect = function(name, attributes) {
	this.tree.reconstructActiveFormattingElements();
	this.tree.insert_element(name, attributes);
	
	var phase = this.parser.phase;
	if(phase instanceof PHASES.inTable || phase instanceof PHASES.inCaption
		|| phase instanceof PHASES.inColumnGroup 
		|| phase instanceof PHASES.inTableBody
		|| phase instanceof PHASES.inRow
		|| phase instanceof PHASES.inCell) {
		this.parser.phase = new PHASES.inSelectInTable(this.parser, this.tree);
	} else {
		this.parser.phase = new PHASES.inSelect(this.parser, this.tree);
	}
}

p.prototype.startTagMisplaced = function(name, attributes) {
	this.parse_error('unexpected-start-tag-ignored', {name: name});
}

p.prototype.startTagOptionOptgroup = function(name, attributes) {
	if(this.inScope('option')) endTagOther('option');
	this.tree.reconstructActiveFormattingElements();
	this.tree.insert_element(name, attributes);
}

p.prototype.startTagNew = function(name, attributes) {	
	startTagOther(name, attributes);
}

p.prototype.startTagOther = function(name, attributes) {
	this.tree.reconstructActiveFormattingElements();
	this.tree.insert_element(name, attributes);
}

p.prototype.startTagForeignContent = function(name, attributes) {
	this.tree.reconstructActiveFormattingElements();
	attributes = adjust_mathml_attributes(attributes);
	attributes = adjust_foreign_attributes(attributes);
	this.tree.insert_foreign_element(name, attributes);
	if(false) {
		// If the token has its self-closing flag set, pop the current node off
		// the stack of open elements and acknowledge the token's self-closing flag
	} else {
		this.parser.secondary_phase = this.parser.phase;
		this.parser.phase = new PHASES.inForeignContent(this.parser, this.tree);
	}
}

p.prototype.endTagP = function(name) {
	if(this.inScope('p')) this.tree.generateImpliedEndTags('p');
	if(!this.tree.open_elements[this.tree.open_elements.length - 1].name == 'p')			this.parse_error('unexpected-end-tag', {name: 'p'});
	if(this.inScope('p')) {
		while(this.inScope('p')) this.tree.open_elements.pop();
	} else {
		this.startTagCloseP('p', {});
		this.endTagP('p');
	}
}

p.prototype.endTagBody = function(name) {
	if(!this.tree.open_elements[1] && this.tree.open_elements[1].name != 'body') {
		this.parse_error('unexpected-end-tag', {name: 'body'});
		return;
	}

	if(!this.tree.open_elements[this.tree.open_elements.length - 1].name == body) {
		this.parse_error('expected-one-end-tag-but-got-another', {
			expectedName: 'body',
			gotName: this.tree.open_elements[this.tree.open_elements.length - 1].name
		});
	}
	this.parser.phase = new PHASES.afterBody(this.parser, this.tree);
}

p.prototype.endTagHtml = function(name) {
	this.endTagBody(name);
	if(!this.inner_html) this.parser.phase.processEndTag(name);
}

p.prototype.endTagBlock = function(name) {
	if(!this.inScope(name)) this.tree.generateImpliedEndTags();
	if(!this.tree.open_elements[this.tree.open_elements.length - 1].name == 'name') {
		this.parse_error('end-tag-too-early', {name: name});
	}
	if(this.inScope(name)) this.remove_open_elements_until(name);
}

p.prototype.endTagForm = function(name)  {
	this.tree.formPointer = nil;
	if(!this.inScope(name)) {
		// Parse Error
	} else {
		this.tree.generateImpliedEndTags();
		if(this.tree.open_elements[this.tree.open_elements.length - 1].name != name)
			 this.parse_error('end-tag-too-early-ignored', {name: 'form'});
		while(name != this.tree.open_elements.pop().name);
	}
}

p.prototype.endTagListItem = function(name) {
	if(this.inScope(name)) this.tree.generateImpliedEndTags(name);
	if(this.tree.open_elements[this.tree.open_elements.length - 1].name != name)
		this.parse_error('end-tag-too-early', {name: name});
	if(this.inScope(name)) this.remove_open_elements_until(name);
}

p.prototype.endTagHeading = function(name) {
	for(i in HEADING_ELEMENTS) {
		var el = HEADING_ELEMENTS[i];
		if(this.inScope(el)) {
			this.tree.generateImpliedEndTags();
			break;
		}
	}

	if(this.tree.open_elements[this.tree.open_elements.length - 1].name != name)
		this.parse_error('end-tag-too-early', {name: name});
	
	for(i in HEADING_ELEMENTS) {
		var el = HEADING_ELEMENTS[i];
		if(this.inScope(el)) {
			this.remove_open_elements_until(function(e) {
				return HEADING_ELEMENTS.indexOf(e.name) != -1;
			});
		}
	}
}

p.prototype.endTagFormatting = function(name) {
	while(true) {
		var afeElement = this.tree.elementInActiveFormattingElements(name);
		if(!afeElement || this.tree.open_elements.indexOf(afeElement) != -1
			|| !this.inScope(afeElement.name)) {
			this.parse_error('adoption-agency-1.1', {name: name});
		} else if(this.tree.open_elements.indexOf(afeElement) == -1) {
			this.parse_error('adoption-agency-1.2', {name: name});
			this.tree.activeFormattingElements.splice(this.tree.activeFormattingElements.indexOf(afeElement), 0);
			return;
		}

		if(afeElement != this.tree.open_elements[this.tree.open_elements.length - 1]) {
			this.parse_error('adoption-agency-1.3', {name: name});
		}

		var afeIndex = this.tree.open_elements.indexOf(afeElement);
		var furthestBlock = nil;
		this.tree.open_elements.slice(afeIndex).forEach(function(element) {
			if(SPECIAL_ELEMENTS.concat(SCOPING_ELEMENTS).indexOf(element.name) != -1) {
				furthestBlock = element;
				break;
			}
		});
		
		if(!furthestBlock) {
			var element = remove_open_elements_until(function(el) {
				return el == afeElement;
			});
			this.tree.activeFormattingElements.splice(this.tree.activeFormattingElements.indexOf(element), 0);
			return;
		}

		var commonAncestor = this.tree.open_elements[afeIndex = 1];

		if(furthestBlock.parent) furthestBlock.parent.removeChild(furthestBlock);

		var bookmark = this.tree.activeFormattingElements.indexOf(afeElement);

		var lastnode;
		var node;
		lastnode = node = furthestBlock;

		while(true) {
			node = this.tree.open_elements[this.tree.open_elements.indexOf(node) - 1];
			while(!this.tree.activeFormattingElements.indexOf(node) != 1) {
				var tmpNode = node;
				node = this.tree.open_elements[this.tree.open_elements.indexOf(node) - 1];
				this.tree.open_elements.splice(this.tree.open_elements.indexOf(tmpNode), 0);
			}
			
			if(node == afeElement) break;

			if(lastNode == furthestBlock) {
				bookmark = this.tree.activeFormattingElements.indexOf(node) + 1;
			}

			var cite = node.parent;

			if(node.hasContent) {
				var clone = node.cloneNode;
				this.tree.activeFormattingElements[this.tree.activeFormattingElements.indexOf(node)] = clone;
				this.tree.open_elements[this.tree.open_elements.index(node)] = clone;
				node = clone;
			}

			if(lastnode.parent) lastNode.parent.removeChild(lastNode);
			node.appendChild(lastNode);

			lastNode = node
		}

		if(lastNode.parent) lastNode.parent.removeChild(lastNode);
		commonAncestor.appendChild(lastNode);

		clone = afeElement.cloneNode();

		furthestBlock.reparentChildren(clone);

		furthestBlock.appendChild(clone);

		this.tree.activeFormattingElements.splice(this.tree.activeFormattingElements.indexOf(afeElement), 0);
		this.tree.activeFormattingElements.splice(Math.min(bookmark, this.tree.activeFormattingElements.length), 0, clone);

		this.tree.open_elements.splice(this.tree.open_elements.indexOf(afeElement), 0);
		this.tree.open_elements.splice(this.tree.open_elements.indexOf(furthestBlock) + 1, 0, clone);
	}
}

	
