exports.Marker = {type: 'Marker', data: 'this is a marker token'};

exports.SCOPING_ELEMENTS = {
	html: [
		'applet',
		'caption',
		'html',
		'table',
		'td',
		'th',
		'marquee',
		'object'
	],
	math: [
		'mi',
		'mo',
		'mn',
		'ms',
		'mtext',
		'annotation-xml'
	],
	svg: [
		'foreignObject',
		'desc',
		'title'
	]
};

exports.LIST_SCOPING_ELEMENTS = {
	html: [
		'ol',
		'ul',
		'applet',
		'caption',
		'html',
		'table',
		'td',
		'th',
		'marquee',
		'object'
	],
	math: [
		'mi',
		'mo',
		'mn',
		'ms',
		'mtext',
		'annotation-xml'
	],
	svg: [
		'foreignObject',
		'desc',
		'title'
	]
};

exports.BUTTON_SCOPING_ELEMENTS = {
	html: [
		'button',
		'applet',
		'caption',
		'html',
		'table',
		'td',
		'th',
		'marquee',
		'object'
	],
	math: [
		'mi',
		'mo',
		'mn',
		'ms',
		'mtext',
		'annotation-xml'
	],
	svg: [
		'foreignObject',
		'desc',
		'title'
	]
};

exports.TABLE_SCOPING_ELEMENTS = {
	html: ['table', 'html']
};

exports.SELECT_SCOPING_ELEMENTS = {
	html: ['option', 'optgroup']
};

exports.FORMATTING_ELEMENTS = [
	'a',
	'b',
	'big',
	'code',
	'em',
	'font',
	'i',
	'nobr',
	's',
	'small',
	'strike',
	'strong',
	'tt',
	'u'
];
exports.SPECIAL_ELEMENTS = {
	html: [
		'address',
		'applet',
		'area',
		'article',
		'aside',
		'base',
		'basefont',
		'bgsound',
		'blockquote',
		'body',
		'br',
		'button',
		'caption',
		'center',
		'col',
		'colgroup',
		'dd',
		'details',
		'dir',
		'div',
		'dl',
		'dt',
		'embed',
		'fieldset',
		'figcaption',
		'figure',
		'footer',
		'form',
		'frame',
		'frameset',
		'h1',
		'h2',
		'h3',
		'h4',
		'h5',
		'h6',
		'head',
		'header',
		'hgroup',
		'hr',
		'html',
		'iframe',
		'img',
		'input',
		'isindex',
		'li',
		'link',
		'listing',
		'main',
		'marquee',
		'menu',
		'menuitem',
		'meta',
		'nav',
		'noembed',
		'noframes',
		'noscript',
		'object',
		'ol',
		'p',
		'param',
		'plaintext',
		'pre',
		'script',
		'section',
		'select',
		'source',
		'style',
		'summary',
		'table',
		'tbody',
		'td',
		'textarea',
		'tfoot',
		'th',
		'thead',
		'title',
		'tr',
		'track',
		'ul',
		'wbr',
		'xmp'
	],
	math: [
		'mi',
		'mo',
		'mn',
		'ms',
		'mtext',
		'annotation-xml'
	],
	svg: [
		'foreignObject',
		'desc',
		'title'
	]
};

exports.HTML_INTEGRATION_POINT_ELEMENTS = {
	math: ['annotation-xml'],
	svg: ['foreignObject', 'desc', 'title']
};

exports.MATHML_TEXT_INTEGRATION_POINT_ELEMENTS = {
	math: ['mi', 'mo', 'mn', 'ms', 'mtext']
};

exports.SPACE_CHARACTERS_IN = "\t\n\x0B\x0C\x20\u0012\r";
exports.SPACE_CHARACTERS = "[\t\n\x0B\x0C\x20\r]";
exports.SPACE_CHARACTERS_R = /^[\t\n\x0B\x0C \r]/;

exports.TABLE_INSERT_MODE_ELEMENTS = [
	'table',
	'tbody',
	'tfoot',
	'thead',
	'tr'
];

exports.ASCII_LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
exports.ASCII_UPPERCASE = exports.ASCII_LOWERCASE.toUpperCase();
exports.ASCII_LETTERS = "[a-zA-Z]";
exports.ASCII_LETTERS_R = /^[a-zA-Z]/;
exports.DIGITS = '0123456789';
exports.DIGITS_R = new RegExp('^[0123456789]');
exports.HEX_DIGITS = exports.DIGITS + 'abcdefABCDEF';
exports.HEX_DIGITS_R = new RegExp('^[' + exports.DIGITS + 'abcdefABCDEF' +']' );

// Heading elements need to be ordered 
exports.HEADING_ELEMENTS = [
	'h1',
	'h2',
	'h3',
	'h4',
	'h5',
	'h6'
];

exports.VOID_ELEMENTS = [
	'base',
	'command',
	'link',
	'meta',
	'hr',
	'br',
	'img',
	'embed',
	'param',
	'area',
	'col',
	'input',
	'source',
	'track'
];

exports.CDATA_ELEMENTS = [
	'title',
	'textarea'
];

exports.RCDATA_ELEMENTS = [
	'style',
	'script',
	'xmp',
	'iframe',
	'noembed',
	'noframes',
	'noscript'
];

exports.BOOLEAN_ATTRIBUTES = {
	'_global': ['irrelevant'],
	// Fixme?
	'style': ['scoped'],
	'img': ['ismap'],
	'audio': ['autoplay', 'controls'],
	'video': ['autoplay', 'controls'],
	'script': ['defer', 'async'],
	'details': ['open'],
	'datagrid': ['multiple', 'disabled'],
	'command': ['hidden', 'disabled', 'checked', 'default'],
	'menu': ['autosubmit'],
	'fieldset': ['disabled', 'readonly'],
	'option': ['disabled', 'readonly', 'selected'],
	'optgroup': ['disabled', 'readonly'],
	'button': ['disabled', 'autofocus'],
	'input': ['disabled', 'readonly', 'required', 'autofocus', 'checked', 'ismap'],
	'select': ['disabled', 'readonly', 'autofocus', 'multiple'],
	'output': ['disabled', 'readonly']
};

exports.TAGMODES = {
	select: 'inSelect',
	td: 'inCell',
	th: 'inCell',
	tr: 'inRow',
	tbody: 'inTableBody',
	thead: 'inTableBody',
	tfoot: 'inTableBody',
	caption: 'inCaption',
	colgroup: 'inColumnGroup',
	table: 'inTable',
	head: 'inBody',
	body: 'inBody',
	frameset: 'inFrameset',
	html: 'beforeHead'
};

exports.SVGTagMap = {
	"altglyph": "altGlyph",
	"altglyphdef": "altGlyphDef",
	"altglyphitem": "altGlyphItem",
	"animatecolor": "animateColor",
	"animatemotion": "animateMotion",
	"animatetransform": "animateTransform",
	"clippath": "clipPath",
	"feblend": "feBlend",
	"fecolormatrix": "feColorMatrix",
	"fecomponenttransfer": "feComponentTransfer",
	"fecomposite": "feComposite",
	"feconvolvematrix": "feConvolveMatrix",
	"fediffuselighting": "feDiffuseLighting",
	"fedisplacementmap": "feDisplacementMap",
	"fedistantlight": "feDistantLight",
	"feflood": "feFlood",
	"fefunca": "feFuncA",
	"fefuncb": "feFuncB",
	"fefuncg": "feFuncG",
	"fefuncr": "feFuncR",
	"fegaussianblur": "feGaussianBlur",
	"feimage": "feImage",
	"femerge": "feMerge",
	"femergenode": "feMergeNode",
	"femorphology": "feMorphology",
	"feoffset": "feOffset",
	"fepointlight": "fePointLight",
	"fespecularlighting": "feSpecularLighting",
	"fespotlight": "feSpotLight",
	"fetile": "feTile",
	"feturbulence": "feTurbulence",
	"foreignobject": "foreignObject",
	"glyphref": "glyphRef",
	"lineargradient": "linearGradient",
	"radialgradient": "radialGradient",
	"textpath": "textPath"
};

exports.MATHMLAttributeMap = {
	definitionurl: 'definitionURL'
};

exports.SVGAttributeMap = {
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