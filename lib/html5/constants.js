var HTML5 = require('../html5');

HTML5.CONTENT_MODEL_FLAGS = [
	'PCDATA',
	'RCDATA',
	'CDATA',
	'PLAINTEXT'
];

HTML5.Marker = {type: 'Marker', data: 'this is a marker token'};

HTML5.EOF = "\0";
HTML5.EOF_TOK = {type: 'EOF', data: 'End of File' };

HTML5.SCOPING_ELEMENTS = [
	'applet',
	'button',
	'caption',
	'html',
	'marquee',
	'object',
	'table',
	'td',
	'th'
];
HTML5.FORMATTING_ELEMENTS = [
	'a',
	'b',
	'big',
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
HTML5.SPECIAL_ELEMENTS = [
	'address',
	'area',
	'base',
	'basefont',
	'bgsound',
	'blockquote',
	'body',
	'br',
	'center',
	'col',
	'colgroup',
	'dd',
	'dir',
	'div',
	'dl',
	'dt',
	'embed',
	'fieldset',
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
	'hr',
	'iframe',
	'image',
	'img',
	'input',
	'isindex',
	'li',
	'link',
	'listing',
	'menu',
	'meta',
	'noembed',
	'noframes',
	'noscript',
	'ol',
	'optgroup',
	'option',
	'p',
	'param',
	'plaintext',
	'pre',
	'script',
	'select',
	'spacer',
	'style',
	'tbody',
	'textarea',
	'tfoot',
	'thead',
	'title',
	'tr',
	'ul',
	'wbr'
];
HTML5.SPACE_CHARACTERS_IN = "\t\n\x0B\x0C\x20\u0012\r";
HTML5.SPACE_CHARACTERS = "[\t\n\x0B\x0C\x20\r]";
HTML5.SPACE_CHARACTERS_R = /^[\t\n\x0B\x0C \r]/;

HTML5.TABLE_INSERT_MODE_ELEMENTS = [
	'table',
	'tbody',
	'tfoot',
	'thead',
	'tr'
];

HTML5.ASCII_LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
HTML5.ASCII_UPPERCASE = HTML5.ASCII_LOWERCASE.toUpperCase();
HTML5.ASCII_LETTERS = "[a-zA-Z]";
HTML5.ASCII_LETTERS_R = /^[a-zA-Z]/;
HTML5.DIGITS = '0123456789';
HTML5.DIGITS_R = new RegExp('^[0123456789]');
HTML5.HEX_DIGITS = HTML5.DIGITS + 'abcdefABCDEF';
HTML5.HEX_DIGITS_R = new RegExp('^[' + HTML5.DIGITS + 'abcdefABCDEF' +']' );

// Heading elements need to be ordered 
HTML5.HEADING_ELEMENTS = [
	'h1',
	'h2',
	'h3',
	'h4',
	'h5',
	'h6'
];

HTML5.VOID_ELEMENTS = [
	'base',
	'link',
	'meta',
	'hr',
	'br',
	'img',
	'embed',
	'param',
	'area',
	'col',
	'input'
];

HTML5.CDATA_ELEMENTS = [
	'title',
	'textarea'
];

HTML5.RCDATA_ELEMENTS = [
	'style',
	'script',
	'xmp',
	'iframe',
	'noembed',
	'noframes',
	'noscript'
];

HTML5.BOOLEAN_ATTRIBUTES = {
	'global': ['irrelevant'],
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
}

// entitiesWindows1252 has to be _ordered_ and needs to have an index.
HTML5.ENTITIES_WINDOWS1252 = [
	8364, // 0x80  0x20AC  EURO SIGN
	65533, // 0x81          UNDEFINED
	8218, // 0x82  0x201A  SINGLE LOW-9 QUOTATION MARK
	402, // 0x83  0x0192  LATIN SMALL LETTER F WITH HOOK
	8222, // 0x84  0x201E  DOUBLE LOW-9 QUOTATION MARK
	8230, // 0x85  0x2026  HORIZONTAL ELLIPSIS
	8224, // 0x86  0x2020  DAGGER
	8225, // 0x87  0x2021  DOUBLE DAGGER
	710, // 0x88  0x02C6  MODIFIER LETTER CIRCUMFLEX ACCENT
	8240, // 0x89  0x2030  PER MILLE SIGN
	352, // 0x8A  0x0160  LATIN CAPITAL LETTER S WITH CARON
	8249, // 0x8B  0x2039  SINGLE LEFT-POINTING ANGLE QUOTATION MARK
	338, // 0x8C  0x0152  LATIN CAPITAL LIGATURE OE
	65533, // 0x8D          UNDEFINED
	381, // 0x8E  0x017D  LATIN CAPITAL LETTER Z WITH CARON
	65533, // 0x8F          UNDEFINED
	65533, // 0x90          UNDEFINED
	8216, // 0x91  0x2018  LEFT SINGLE QUOTATION MARK
	8217, // 0x92  0x2019  RIGHT SINGLE QUOTATION MARK
	8220, // 0x93  0x201C  LEFT DOUBLE QUOTATION MARK
	8221, // 0x94  0x201D  RIGHT DOUBLE QUOTATION MARK
	8226, // 0x95  0x2022  BULLET
	8211, // 0x96  0x2013  EN DASH
	8212, // 0x97  0x2014  EM DASH
	732, // 0x98  0x02DC  SMALL TILDE
	8482, // 0x99  0x2122  TRADE MARK SIGN
	353, // 0x9A  0x0161  LATIN SMALL LETTER S WITH CARON
	8250, // 0x9B  0x203A  SINGLE RIGHT-POINTING ANGLE QUOTATION MARK
	339, // 0x9C  0x0153  LATIN SMALL LIGATURE OE
	65533, // 0x9D          UNDEFINED
	382, // 0x9E  0x017E  LATIN SMALL LETTER Z WITH CARON
	376    // 0x9F  0x0178  LATIN CAPITAL LETTER Y WITH DIAERESIS
];

HTML5.ENTITIES = {
	'AElig': "\xc3\x86",
	'AElig;': "\xc3\x86",
	'AMP': '&',
	'AMP;': '&',
	'Aacute': "\xc3\x81",
	'Aacute;': "\xc3\x81",
	'Acirc': "\xc3\x82",
	'Acirc;': "\xc3\x82",
	'Agrave': "\xc3\x80",
	'Agrave;': "\xc3\x80",
	'Alpha;': "\xce\x91",
	'Aring': "\xc3\x85",
	'Aring;': "\xc3\x85",
	'Atilde': "\xc3\x83",
	'Atilde;': "\xc3\x83",
	'Auml': "\xc3\x84",
	'Auml;': "\xc3\x84",
	'Beta;': "\xce\x92",
	'COPY': "\xc2\xa9",
	'COPY;': "\xc2\xa9",
	'Ccedil': "\xc3\x87",
	'Ccedil;': "\xc3\x87",
	'Chi;': "\xce\xa7",
	'Dagger;': "\xe2\x80\xa1",
	'Delta;': "\xce\x94",
	'ETH': "\xc3\x90",
	'ETH;': "\xc3\x90",
	'Eacute': "\xc3\x89",
	'Eacute;': "\xc3\x89",
	'Ecirc': "\xc3\x8a",
	'Ecirc;': "\xc3\x8a",
	'Egrave': "\xc3\x88",
	'Egrave;': "\xc3\x88",
	'Epsilon;': "\xce\x95",
	'Eta;': "\xce\x97",
	'Euml': "\xc3\x8b",
	'Euml;': "\xc3\x8b",
	'GT': '>',
	'GT;': '>',
	'Gamma;': "\xce\x93",
	'Iacute': "\xc3\x8d",
	'Iacute;': "\xc3\x8d",
	'Icirc': "\xc3\x8e",
	'Icirc;': "\xc3\x8e",
	'Igrave': "\xc3\x8c",
	'Igrave;': "\xc3\x8c",
	'Iota;': "\xce\x99",
	'Iuml': "\xc3\x8f",
	'Iuml;': "\xc3\x8f",
	'Kappa;': "\xce\x9a",
	'LT': '<',
	'LT;': '<',
	'Lambda;': "\xce\x9b",
	'Mu;': "\xce\x9c",
	'Ntilde': "\xc3\x91",
	'Ntilde;': "\xc3\x91",
	'Nu;': "\xce\x9d",
	'OElig;': "\xc5\x92",
	'Oacute': "\xc3\x93",
	'Oacute;': "\xc3\x93",
	'Ocirc': "\xc3\x94",
	'Ocirc;': "\xc3\x94",
	'Ograve': "\xc3\x92",
	'Ograve;': "\xc3\x92",
	'Omega;': "\xce\xa9",
	'Omicron;': "\xce\x9f",
	'Oslash': "\xc3\x98",
	'Oslash;': "\xc3\x98",
	'Otilde': "\xc3\x95",
	'Otilde;': "\xc3\x95",
	'Ouml': "\xc3\x96",
	'Ouml;': "\xc3\x96",
	'Phi;': "\xce\xa6",
	'Pi;': "\xce\xa0",
	'Prime;': "\xe2\x80\xb3",
	'Psi;': "\xce\xa8",
	'QUOT': '"',
	'QUOT;': '"',
	'REG': "\xc2\xae",
	'REG;': "\xc2\xae",
	'Rho;': "\xce\xa1",
	'Scaron;': "\xc5\xa0",
	'Sigma;': "\xce\xa3",
	'THORN': "\xc3\x9e",
	'THORN;': "\xc3\x9e",
	'TRADE;': "\xe2\x84\xa2",
	'Tau;': "\xce\xa4",
	'Theta;': "\xce\x98",
	'Uacute': "\xc3\x9a",
	'Ucirc': "\xc3\x9b",
	'Ucirc;': "\xc3\x9b",
	'Ugrave': "\xc3\x99",
	'Ugrave;': "\xc3\x99",
	'Upsilon;': "\xce\xa5",
	'Uuml': "\xc3\x9c",
	'Uuml;': "\xc3\x9c",
	'Xi;': "\xce\x9e",
	'Yacute': "\xc3\x9d",
	'Yacute;': "\xc3\x9d",
	'Yuml;': "\xc5\xb8",
	'Zeta;': "\xce\x96",
	'aacute': "\xc3\xa1",
	'aacute;': "\xc3\xa1",
	'acirc': "\xc3\xa2",
	'acirc;': "\xc3\xa2",
	'acute': "\xc2\xb4",
	'acute;': "\xc2\xb4",
	'aelig': "\xc3\xa6",
	'aelig;': "\xc3\xa6",
	'agrave': "\xc3\xa0",
	'agrave;': "\xc3\xa0",
	'alefsym;': "\xe2\x84\xb5",
	'alpha;': "\xce\xb1",
	'amp': '&',
	'amp;': '&',
	'and;': "\xe2\x88\xa7",
	'ang;': "\xe2\x88\xa0",
	'apos;': "'",
	'aring': "\xc3\xa5",
	'aring;': "\xc3\xa5",
	'asymp;': "\xe2\x89\x88",
	'atilde': "\xc3\xa3",
	'atilde;': "\xc3\xa3",
	'auml': "\xc3\xa4",
	'auml;': "\xc3\xa4",
	'bdquo;': "\xe2\x80\x9e",
	'beta;': "\xce\xb2",
	'brvbar': "\xc2\xa6",
	'brvbar;': "\xc2\xa6",
	'bull;': "\xe2\x80\xa2",
	'cap;': "\xe2\x88\xa9",
	'ccedil': "\xc3\xa7",
	'ccedil;': "\xc3\xa7",
	'cedil': "\xc2\xb8",
	'cent': "\xc2\xa2",
	'cent;': "\xc2\xa2",
	'chi;': "\xcf\x87",
	'circ;': "\xcb\x86",
	'clubs;': "\xe2\x99\xa3",
	'cong;': "\xe2\x89\x85",
	'copy': "\xc2\xa9",
	'copy;': "\xc2\xa9",
	'crarr;': "\xe2\x86\xb5",
	'cup;': "\xe2\x88\xaa",
	'curren': "\xc2\xa4",
	'curren;': "\xc2\xa4",
	'dArr;': "\xe2\x87\x93",
	'dagger;': "\xe2\x80\xa0",
	'darr;': "\xe2\x86\x93",
	'deg': "\xc2\xb0",
	'deg;': "\xc2\xb0",
	'delta;': "\xce\xb4",
	'diams;': "\xe2\x99\xa6",
	'divide': "\xc3\xb7",
	'divide;': "\xc3\xb7",
	'eacute': "\xc3\xa9",
	'ecirc': "\xc3\xaa",
	'ecirc;': "\xc3\xaa",
	'egrave': "\xc3\xa8",
	'egrave;': "\xc3\xa8",
	'empty;': "\xe2\x88\x85",
	'emsp;': "\xe2\x80\x83",
	'ensp;': "\xe2\x80\x82",
	'epsilon;': "\xce\xb5",
	'equiv;': "\xe2\x89\xa1",
	'eta;': "\xce\xb7",
	'eth': "\xc3\xb0",
	'eth;': "\xc3\xb0",
	'euml': "\xc3\xab",
	'euml;': "\xc3\xab",
	'euro;': "\xe2\x82\xac",
	'exist;': "\xe2\x88\x83",
	'fnof;': "\xc6\x92",
	'forall;': "\xe2\x88\x80",
	'frac12': "\xc2\xbd",
	'frac12;': "\xc2\xbd",
	'frac14': "\xc2\xbc",
	'frac14;': "\xc2\xbc",
	'frac34': "\xc2\xbe",
	'frac34;': "\xc2\xbe",
	'frasl;': "\xe2\x81\x84",
	'gamma;': "\xce\xb3",
	'ge;': "\xe2\x89\xa5",
	'gt': '>',
	'gt;': '>',
	'hArr;': "\xe2\x87\x94",
	'harr;': "\xe2\x86\x94",
	'hearts;': "\xe2\x99\xa5",
	'hellip;': "\xe2\x80\xa6",
	'iacute': "\xc3\xad",
	'iacute;': "\xc3\xad",
	'icirc': "\xc3\xae",
	'icirc;': "\xc3\xae",
	'iexcl': "\xc2\xa1",
	'iexcl;': "\xc2\xa1",
	'igrave': "\xc3\xac",
	'igrave;': "\xc3\xac",
	'image;': "\xe2\x84\x91",
	'infin;': "\xe2\x88\x9e",
	'int;': "\xe2\x88\xab",
	'iota;': "\xce\xb9",
	'iquest': "\xc2\xbf",
	'iquest;': "\xc2\xbf",
	'isin;': "\xe2\x88\x88",
	'iuml': "\xc3\xaf",
	'iuml;': "\xc3\xaf",
	'kappa;': "\xce\xba",
	'lArr;': "\xe2\x87\x90",
	'lambda;': "\xce\xbb",
	'lang;': "\xe2\x9f\xa8",
	'laquo': "\xc2\xab",
	'laquo;': "\xc2\xab",
	'larr;': "\xe2\x86\x90",
	'lceil;': "\xe2\x8c\x88",
	'ldquo;': "\xe2\x80\x9c",
	'le;': "\xe2\x89\xa4",
	'lfloor;': "\xe2\x8c\x8a",
	'lowast;': "\xe2\x88\x97",
	'loz;': "\xe2\x97\x8a",
	'lrm;': "\xe2\x80\x8e",
	'lsaquo;': "\xe2\x80\xb9",
	'lsquo;': "\xe2\x80\x98",
	'lt': '<',
	'lt;': '<',
	'macr': "\xc2\xaf",
	'macr;': "\xc2\xaf",
	'mdash;': "\xe2\x80\x94",
	'micro': "\xc2\xb5",
	'micro;': "\xc2\xb5",
	'middot': "\xc2\xb7",
	'middot;': "\xc2\xb7",
	'minus;': "\xe2\x88\x92",
	'mu;': "\xce\xbc",
	'nabla;': "\xe2\x88\x87",
	'nbsp': "\xc2\xa0",
	'nbsp;': "\xc2\xa0",
	'ndash;': "\xe2\x80\x93",
	'ne;': "\xe2\x89\xa0",
	'ni;': "\xe2\x88\x8b",
	'not': "\xc2\xac",
	'not;': "\xc2\xac",
	'notin;': "\xe2\x88\x89",
	'nsub;': "\xe2\x8a\x84",
	'ntilde': "\xc3\xb1",
	'ntilde;': "\xc3\xb1",
	'nu;': "\xce\xbd",
	'oacute': "\xc3\xb3",
	'oacute;': "\xc3\xb3",
	'ocirc': "\xc3\xb4",
	'ocirc;': "\xc3\xb4",
	'oelig;': "\xc5\x93",
	'ograve': "\xc3\xb2",
	'ograve;': "\xc3\xb2",
	'oline;': "\xe2\x80\xbe",
	'omega;': "\xcf\x89",
	'omicron;': "\xce\xbf",
	'oplus;': "\xe2\x8a\x95",
	'or;': "\xe2\x88\xa8",
	'ordf': "\xc2\xaa",
	'ordf;': "\xc2\xaa",
	'ordm': "\xc2\xba",
	'ordm;': "\xc2\xba",
	'oslash': "\xc3\xb8",
	'oslash;': "\xc3\xb8",
	'otilde': "\xc3\xb5",
	'otilde;': "\xc3\xb5",
	'otimes;': "\xe2\x8a\x97",
	'ouml': "\xc3\xb6",
	'ouml;': "\xc3\xb6",
	'para': "\xc2\xb6",
	'para;': "\xc2\xb6",
	'part;': "\xe2\x88\x82",
	'permil;': "\xe2\x80\xb0",
	'perp;': "\xe2\x8a\xa5",
	'phi;': "\xcf\x86",
	'pi;': "\xcf\x80",
	'piv;': "\xcf\x96",
	'plusmn': "\xc2\xb1",
	'plusmn;': "\xc2\xb1",
	'pound': "\xc2\xa3",
	'pound;': "\xc2\xa3",
	'prime;': "\xe2\x80\xb2",
	'prod;': "\xe2\x88\x8f",
	'prop;': "\xe2\x88\x9d",
	'psi;': "\xcf\x88",
	'quot': '"',
	'quot;': '"',
	'rArr;': "\xe2\x87\x92",
	'radic;': "\xe2\x88\x9a",
	'rang;': "\xe2\x9f\xa9",
	'raquo': "\xc2\xbb",
	'raquo;': "\xc2\xbb",
	'rarr;': "\xe2\x86\x92",
	'rceil;': "\xe2\x8c\x89",
	'rdquo;': "\xe2\x80\x9d",
	'real;': "\xe2\x84\x9c",
	'reg': "\xc2\xae",
	'reg;': "\xc2\xae",
	'rfloor;': "\xe2\x8c\x8b",
	'rho;': "\xcf\x81",
	'rlm;': "\xe2\x80\x8f",
	'rsaquo;': "\xe2\x80\xba",
	'rsquo;': "\xe2\x80\x99",
	'sbquo;': "\xe2\x80\x9a",
	'scaron;': "\xc5\xa1",
	'sdot;': "\xe2\x8b\x85",
	'sect': "\xc2\xa7",
	'sect;': "\xc2\xa7",
	'shy': "\xc2\xad",
	'shy;': "\xc2\xad",
	'sigma;': "\xcf\x83",
	'sigmaf;': "\xcf\x82",
	'sim;': "\xe2\x88\xbc",
	'spades;': "\xe2\x99\xa0",
	'sub;': "\xe2\x8a\x82",
	'sube;': "\xe2\x8a\x86",
	'sum;': "\xe2\x88\x91",
	'sup1': "\xc2\xb9",
	'sup1;': "\xc2\xb9",
	'sup2': "\xc2\xb2",
	'sup2;': "\xc2\xb2",
	'sup3': "\xc2\xb3",
	'sup3;': "\xc2\xb3",
	'sup;': "\xe2\x8a\x83",
	'supe;': "\xe2\x8a\x87",
	'szlig': "\xc3\x9f",
	'szlig;': "\xc3\x9f",
	'tau;': "\xcf\x84",
	'there4;': "\xe2\x88\xb4",
	'theta;': "\xce\xb8",
	'thetasym;': "\xcf\x91",
	'thinsp;': "\xe2\x80\x89",
	'thorn': "\xc3\xbe",
	'thorn;': "\xc3\xbe",
	'tilde;': "\xcb\x9c",
	'times': "\xc3\x97",
	'times;': "\xc3\x97",
	'trade;': "\xe2\x84\xa2",
	'uArr;': "\xe2\x87\x91",
	'uacute': "\xc3\xba",
	'uacute;': "\xc3\xba",
	'uarr;': "\xe2\x86\x91",
	'ucirc': "\xc3\xbb",
	'ucirc;': "\xc3\xbb",
	'ugrave': "\xc3\xb9",
	'ugrave;': "\xc3\xb9",
	'uml': "\xc2\xa8",
	'uml;': "\xc2\xa8",
	'upsih;': "\xcf\x92",
	'upsilon;': "\xcf\x85",
	'uuml': "\xc3\xbc",
	'uuml;': "\xc3\xbc",
	'weierp;': "\xe2\x84\x98",
	'xi;': "\xce\xbe",
	'yacute': "\xc3\xbd",
	'yacute;': "\xc3\xbd",
	'yen': "\xc2\xa5",
	'yen;': "\xc2\xa5",
	'yuml': "\xc3\xbf",
	'yuml;': "\xc3\xbf",
	'zeta;': "\xce\xb6",
	'zwj;': "\xe2\x80\x8d",
	'zwnj;': "\xe2\x80\x8c"
}

HTML5.ENCODINGS = [
	'ansi_x3.4-1968',
	'iso-ir-6',
	'ansi_x3.4-1986',
	'iso_646.irv:1991',
	'ascii',
	'iso646-us',
	'us-ascii',
	'us',
	'ibm367',
	'cp367',
	'csascii',
	'ks_c_5601-1987',
	'korean',
	'iso-2022-kr',
	'csiso2022kr',
	'euc-kr',
	'iso-2022-jp',
	'csiso2022jp',
	'iso-2022-jp-2',
	'',
	'iso-ir-58',
	'chinese',
	'csiso58gb231280',
	'iso_8859-1:1987',
	'iso-ir-100',
	'iso_8859-1',
	'iso-8859-1',
	'latin1',
	'l1',
	'ibm819',
	'cp819',
	'csisolatin1',
	'iso_8859-2:1987',
	'iso-ir-101',
	'iso_8859-2',
	'iso-8859-2',
	'latin2',
	'l2',
	'csisolatin2',
	'iso_8859-3:1988',
	'iso-ir-109',
	'iso_8859-3',
	'iso-8859-3',
	'latin3',
	'l3',
	'csisolatin3',
	'iso_8859-4:1988',
	'iso-ir-110',
	'iso_8859-4',
	'iso-8859-4',
	'latin4',
	'l4',
	'csisolatin4',
	'iso_8859-6:1987',
	'iso-ir-127',
	'iso_8859-6',
	'iso-8859-6',
	'ecma-114',
	'asmo-708',
	'arabic',
	'csisolatinarabic',
	'iso_8859-7:1987',
	'iso-ir-126',
	'iso_8859-7',
	'iso-8859-7',
	'elot_928',
	'ecma-118',
	'greek',
	'greek8',
	'csisolatingreek',
	'iso_8859-8:1988',
	'iso-ir-138',
	'iso_8859-8',
	'iso-8859-8',
	'hebrew',
	'csisolatinhebrew',
	'iso_8859-5:1988',
	'iso-ir-144',
	'iso_8859-5',
	'iso-8859-5',
	'cyrillic',
	'csisolatincyrillic',
	'iso_8859-9:1989',
	'iso-ir-148',
	'iso_8859-9',
	'iso-8859-9',
	'latin5',
	'l5',
	'csisolatin5',
	'iso-8859-10',
	'iso-ir-157',
	'l6',
	'iso_8859-10:1992',
	'csisolatin6',
	'latin6',
	'hp-roman8',
	'roman8',
	'r8',
	'ibm037',
	'cp037',
	'csibm037',
	'ibm424',
	'cp424',
	'csibm424',
	'ibm437',
	'cp437',
	'437',
	'cspc8codepage437',
	'ibm500',
	'cp500',
	'csibm500',
	'ibm775',
	'cp775',
	'cspc775baltic',
	'ibm850',
	'cp850',
	'850',
	'cspc850multilingual',
	'ibm852',
	'cp852',
	'852',
	'cspcp852',
	'ibm855',
	'cp855',
	'855',
	'csibm855',
	'ibm857',
	'cp857',
	'857',
	'csibm857',
	'ibm860',
	'cp860',
	'860',
	'csibm860',
	'ibm861',
	'cp861',
	'861',
	'cp-is',
	'csibm861',
	'ibm862',
	'cp862',
	'862',
	'cspc862latinhebrew',
	'ibm863',
	'cp863',
	'863',
	'csibm863',
	'ibm864',
	'cp864',
	'csibm864',
	'ibm865',
	'cp865',
	'865',
	'csibm865',
	'ibm866',
	'cp866',
	'866',
	'csibm866',
	'ibm869',
	'cp869',
	'869',
	'cp-gr',
	'csibm869',
	'ibm1026',
	'cp1026',
	'csibm1026',
	'koi8-r',
	'cskoi8r',
	'koi8-u',
	'big5-hkscs',
	'ptcp154',
	'csptcp154',
	'pt154',
	'cp154',
	'utf-7',
	'utf-16be',
	'utf-16le',
	'utf-16',
	'utf-8',
	'iso-8859-13',
	'iso-8859-14',
	'iso-ir-199',
	'iso_8859-14:1998',
	'iso_8859-14',
	'latin8',
	'iso-celtic',
	'l8',
	'iso-8859-15',
	'iso_8859-15',
	'iso-8859-16',
	'iso-ir-226',
	'iso_8859-16:2001',
	'iso_8859-16',
	'latin10',
	'l10',
	'gbk',
	'cp936',
	'ms936',
	'gb18030',
	'shift_jis',
	'ms_kanji',
	'csshiftjis',
	'euc-jp',
	'gb2312',
	'big5',
	'csbig5',
	'windows-1250',
	'windows-1251',
	'windows-1252',
	'windows-1253',
	'windows-1254',
	'windows-1255',
	'windows-1256',
	'windows-1257',
	'windows-1258',
	'tis-620',
	'hz-gb-2312'
];

HTML5.E = {
	"null-character":
		"Null character in input stream, replaced with U+FFFD.",
	"incorrectly-placed-solidus":
		"Solidus (/) incorrectly placed in tag.",
	"incorrect-cr-newline-entity":
		"Incorrect CR newline entity, replaced with LF.",
	"illegal-windows-1252-entity":
		"Entity used with illegal number (windows-1252 reference).",
	"cant-convert-numeric-entity":
		"Numeric entity couldn't be converted to character " +
	 "(codepoint U+%(charAsInt)08x).",
	"illegal-codepoint-for-numeric-entity":
		"Numeric entity represents an illegal codepoint=> " +
	 "U+%(charAsInt)08x.",
	"numeric-entity-without-semicolon":
		"Numeric entity didn't end with ';'.",
	"expected-numeric-entity-but-got-eof":
		"Numeric entity expected. Got end of file instead.",
	"expected-numeric-entity":
		"Numeric entity expected but none found.",
	"named-entity-without-semicolon":
		"Named entity didn't end with ';'.",
	"expected-named-entity":
		"Named entity expected. Got none.",
	"attributes-in-end-tag":
		"End tag contains unexpected attributes.",
	"expected-tag-name-but-got-right-bracket":
		"Expected tag name. Got '>' instead.",
	"expected-tag-name-but-got-question-mark":
		"Expected tag name. Got '?' instead. (HTML doesn't " +
	 "support processing instructions.)",
	"expected-tag-name":
		"Expected tag name. Got something else instead",
	"expected-closing-tag-but-got-right-bracket":
		"Expected closing tag. Got '>' instead. Ignoring '</>'.",
	"expected-closing-tag-but-got-eof":
		"Expected closing tag. Unexpected end of file.",
	"expected-closing-tag-but-got-char":
		"Expected closing tag. Unexpected character '%(data)' found.",
	"eof-in-tag-name":
		"Unexpected end of file in the tag name.",
	"expected-attribute-name-but-got-eof":
		"Unexpected end of file. Expected attribute name instead.",
	"eof-in-attribute-name":
		"Unexpected end of file in attribute name.",
	"duplicate-attribute":
		"Dropped duplicate attribute on tag.",
	"expected-end-of-tag-name-but-got-eof":
		"Unexpected end of file. Expected = or end of tag.",
	"expected-attribute-value-but-got-eof":
		"Unexpected end of file. Expected attribute value.",
	"eof-in-attribute-value-double-quote":
		"Unexpected end of file in attribute value (\").",
	"eof-in-attribute-value-single-quote":
		"Unexpected end of file in attribute value (').",
	"eof-in-attribute-value-no-quotes":
		"Unexpected end of file in attribute value.",
	"expected-dashes-or-doctype":
		"Expected '--' or 'DOCTYPE'. Not found.",
	"incorrect-comment":
		"Incorrect comment.",
	"eof-in-comment":
		"Unexpected end of file in comment.",
	"eof-in-comment-end-dash":
		"Unexpected end of file in comment (-)",
	"unexpected-dash-after-double-dash-in-comment":
		"Unexpected '-' after '--' found in comment.",
	"eof-in-comment-double-dash":
		"Unexpected end of file in comment (--).",
	"unexpected-char-in-comment":
		"Unexpected character in comment found.",
	"need-space-after-doctype":
		"No space after literal string 'DOCTYPE'.",
	"expected-doctype-name-but-got-right-bracket":
		"Unexpected > character. Expected DOCTYPE name.",
	"expected-doctype-name-but-got-eof":
		"Unexpected end of file. Expected DOCTYPE name.",
	"eof-in-doctype-name":
		"Unexpected end of file in DOCTYPE name.",
	"eof-in-doctype":
		"Unexpected end of file in DOCTYPE.",
	"expected-space-or-right-bracket-in-doctype":
		"Expected space or '>'. Got '%(data)'",
	"unexpected-end-of-doctype":
		"Unexpected end of DOCTYPE.",
	"unexpected-char-in-doctype":
		"Unexpected character in DOCTYPE.",
	"eof-in-bogus-doctype":
		"Unexpected end of file in bogus doctype.",
	"eof-in-innerhtml":
		"Unexpected EOF in inner html mode.",
	"unexpected-doctype":
		"Unexpected DOCTYPE. Ignored.",
	"non-html-root":
		"html needs to be the first start tag.",
	"expected-doctype-but-got-eof":
		"Unexpected End of file. Expected DOCTYPE.",
	"unknown-doctype":
		"Erroneous DOCTYPE.",
	"expected-doctype-but-got-chars":
		"Unexpected non-space characters. Expected DOCTYPE.",
	"expected-doctype-but-got-start-tag":
		"Unexpected start tag (%(name)). Expected DOCTYPE.",
	"expected-doctype-but-got-end-tag":
		"Unexpected end tag (%(name)). Expected DOCTYPE.",
	"end-tag-after-implied-root":
		"Unexpected end tag (%(name)) after the (implied) root element.",
	"expected-named-closing-tag-but-got-eof":
		"Unexpected end of file. Expected end tag (%(name)).",
	"two-heads-are-not-better-than-one":
		"Unexpected start tag head in existing head. Ignored.",
	"unexpected-end-tag":
		"Unexpected end tag (%(name)). Ignored.",
	"unexpected-start-tag-out-of-my-head":
		"Unexpected start tag (%(name)) that can be in head. Moved.",
	"unexpected-start-tag":
		"Unexpected start tag (%(name)).",
	"missing-end-tag":
		"Missing end tag (%(name)).",
	"missing-end-tags":
		"Missing end tags (%(name)).",
	"unexpected-start-tag-implies-end-tag":
		"Unexpected start tag (%(startName)) " +
		"implies end tag (%(endName)).",
	"unexpected-start-tag-treated-as":
		"Unexpected start tag (%(originalName)). Treated as %(newName).",
	"deprecated-tag":
		"Unexpected start tag %(name). Don't use it!",
	"unexpected-start-tag-ignored":
		"Unexpected start tag %(name). Ignored.",
	"expected-one-end-tag-but-got-another":
		"Unexpected end tag (%(gotName). " +
		"Missing end tag (%(expectedName)).",
	"end-tag-too-early":
		"End tag (%(name)) seen too early. Expected other end tag.",
	"end-tag-too-early-named":
		"Unexpected end tag (%(gotName)). Expected end tag (%(expectedName).",
	"end-tag-too-early-ignored":
		"End tag (%(name)) seen too early. Ignored.",
	"adoption-agency-1.1":
		"End tag (%(name) violates step 1, " +
		"paragraph 1 of the adoption agency algorithm.",
	"adoption-agency-1.2":
		"End tag (%(name) violates step 1, " +
		"paragraph 2 of the adoption agency algorithm.",
	"adoption-agency-1.3":
		"End tag (%(name) violates step 1, " +
		"paragraph 3 of the adoption agency algorithm.",
	"unexpected-end-tag-treated-as":
		"Unexpected end tag (%(originalName)). Treated as %(newName).",
	"no-end-tag":
		"This element (%(name)) has no end tag.",
	"unexpected-implied-end-tag-in-table":
		"Unexpected implied end tag (%(name)) in the table phase.",
	"unexpected-implied-end-tag-in-table-body":
		"Unexpected implied end tag (%(name)) in the table body phase.",
	"unexpected-char-implies-table-voodoo":
		"Unexpected non-space characters in " +
		"table context caused voodoo mode.",
	"unpexted-hidden-input-in-table":
		"Unexpected input with type hidden in table context.",
	"unexpected-start-tag-implies-table-voodoo":
		"Unexpected start tag (%(name)) in " +
		"table context caused voodoo mode.",
	"unexpected-end-tag-implies-table-voodoo":
		"Unexpected end tag (%(name)) in " +
		"table context caused voodoo mode.",
	"unexpected-cell-in-table-body":
		"Unexpected table cell start tag (%(name)) " +
		"in the table body phase.",
	"unexpected-cell-end-tag":
		"Got table cell end tag (%(name)) " +
		"while required end tags are missing.",
	"unexpected-end-tag-in-table-body":
		"Unexpected end tag (%(name)) in the table body phase. Ignored.",
	"unexpected-implied-end-tag-in-table-row":
		"Unexpected implied end tag (%(name)) in the table row phase.",
	"unexpected-end-tag-in-table-row":
		"Unexpected end tag (%(name)) in the table row phase. Ignored.",
	"unexpected-select-in-select":
		"Unexpected select start tag in the select phase " +
		"treated as select end tag.",
	"unexpected-input-in-select":
		"Unexpected input start tag in the select phase.",
	"unexpected-start-tag-in-select":
		"Unexpected start tag token (%(name)) in the select phase. " +
		"Ignored.",
	"unexpected-end-tag-in-select":
		"Unexpected end tag (%(name)) in the select phase. Ignored.",
	"unexpected-table-element-start-tag-in-select-in-table":
		"Unexpected table element start tag (%(name))s in the select in table phase.",
	"unexpected-table-element-end-tag-in-select-in-table":
		"Unexpected table element end tag (%(name))s in the select in table phase.",
	"unexpected-char-after-body":
		"Unexpected non-space characters in the after body phase.",
	"unexpected-start-tag-after-body":
		"Unexpected start tag token (%(name))" +
		"in the after body phase.",
	"unexpected-end-tag-after-body":
		"Unexpected end tag token (%(name))" +
		" in the after body phase.",
	"unexpected-char-in-frameset":
		"Unepxected characters in the frameset phase. Characters ignored.",
	"unexpected-start-tag-in-frameset":
		"Unexpected start tag token (%(name))" +
	 	" in the frameset phase. Ignored.",
	"unexpected-frameset-in-frameset-innerhtml":
		"Unexpected end tag token (frameset " +
		 "in the frameset phase (innerHTML).",
	"unexpected-end-tag-in-frameset":
		"Unexpected end tag token (%(name))" +
		 " in the frameset phase. Ignored.",
	"unexpected-char-after-frameset":
		"Unexpected non-space characters in the " +
		"after frameset phase. Ignored.",
	"unexpected-start-tag-after-frameset":
		"Unexpected start tag (%(name))" +
		" in the after frameset phase. Ignored.",
	"unexpected-end-tag-after-frameset":
		"Unexpected end tag (%(name))" +
		" in the after frameset phase. Ignored.",
	"expected-eof-but-got-char":
		"Unexpected non-space characters. Expected end of file.",
	"expected-eof-but-got-char":
		"Unexpected non-space characters. Expected end of file.",
	"expected-eof-but-got-start-tag":
		"Unexpected start tag (%(name))" +
		 ". Expected end of file.",
	"expected-eof-but-got-end-tag":
		"Unexpected end tag (%(name))" +
		". Expected end of file.",
	"unexpected-end-table-in-caption":
		"Unexpected end table tag in caption. Generates implied end caption.",
	"end-html-in-innerhtml": 
		"Unexpected html end tag in inner html mode.",
	"expected-self-closing-tag":
 		"Expected a > after the /.",
	"self-closing-end-tag":
 		"Self closing end tag.",
	"eof-in-table":
 		"Unexpected end of file. Expected table content.",
	"html-in-foreign-content":
 		"HTML start tag \"%(name)\" in a foreign namespace context.",
	"unexpected-start-tag-in-table":
 		"Unexpected %(name). Expected table content."
};

HTML5.Models = {PCDATA: 0, RCDATA: 1, CDATA: 2};

HTML5.PHASES = PHASES = {
	initial: require('./parser/initial_phase').Phase, 
	beforeHTML: require('./parser/before_html_phase').Phase,
	beforeHead: require('./parser/before_head_phase').Phase, 
	inHead: require('./parser/in_head_phase').Phase,
	afterHead: require('./parser/after_head_phase').Phase,
	inBody: require('./parser/in_body_phase').Phase,
	inTable: require('./parser/in_table_phase').Phase,
	inCaption: require('./parser/in_caption_phase').Phase,
	inColumnGroup: require('./parser/in_column_group_phase').Phase,
	inTableBody: require('./parser/in_table_body_phase').Phase,
	inRow: require('./parser/in_row_phase').Phase,
	inCell: require('./parser/in_cell_phase').Phase,
	inSelect: require('./parser/in_select_phase').Phase,
	inSelectInTable: require('./parser/in_select_in_table_phase').Phase,
	afterBody: require('./parser/after_body_phase').Phase,
	inFrameset: require('./parser/in_frameset_phase').Phase,
	afterFrameset: require('./parser/after_frameset_phase').Phase,
	afterAfterBody: require('./parser/after_after_body_phase').Phase,
	afterAfterFrameset: require('./parser/after_after_frameset_phase').Phase,
	inForeignContent: require('./parser/in_foreign_content_phase').Phase,
	trailingEnd: require('./parser/trailing_end_phase').Phase,
	rootElement: require('./parser/root_element_phase').Phase,
};

HTML5.TAGMODES = {
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
	frameset: 'inFrameset'
};

