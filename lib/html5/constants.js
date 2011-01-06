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
	'AElig': "\u00C6",
	'AElig;': "\u00C6",
	'AMP': '&',
	'AMP;': '&',
	'Aacute': "\u00C1",
	'Aacute;': "\u00C1",
	'Acirc': "\u00C2",
	'Acirc;': "\u00C2",
	'Agrave': "\u00C0",
	'Agrave;': "\u00C0",
	'Alpha;': "\u0391",
	'Aring': "\u00C5",
	'Aring;': "\u00C5",
	'Atilde': "\u00C3",
	'Atilde;': "\u00C3",
	'Auml': "\u00C4",
	'Auml;': "\u00C4",
	'Beta;': "\u0392",
	'COPY': "\u00A9",
	'COPY;': "\u00A9",
	'Ccedil': "\u00C7",
	'Ccedil;': "\u00C7",
	'Chi;': "\u03A7",
	'Dagger;': "\u2021",
	'Delta;': "\u0394",
	'ETH': "\u00D0",
	'ETH;': "\u00D0",
	'Eacute': "\u00C9",
	'Eacute;': "\u00C9",
	'Ecirc': "\u00CA",
	'Ecirc;': "\u00CA",
	'Egrave': "\u00C8",
	'Egrave;': "\u00C8",
	'Epsilon;': "\u0395",
	'Eta;': "\u0397",
	'Euml': "\u00CB",
	'Euml;': "\u00CB",
	'GT': '>',
	'GT;': '>',
	'Gamma;': "\u0393",
	'Iacute': "\u00CD",
	'Iacute;': "\u00CD",
	'Icirc': "\u00CE",
	'Icirc;': "\u00CE",
	'Igrave': "\u00CC",
	'Igrave;': "\u00CC",
	'Iota;': "\u0399",
	'Iuml': "\u00CF",
	'Iuml;': "\u00CF",
	'Kappa;': "\u039A",
	'LT': '<',
	'LT;': '<',
	'Lambda;': "\u039B",
	'Mu;': "\u039C",
	'Ntilde': "\u00D1",
	'Ntilde;': "\u00D1",
	'Nu;': "\u039D",
	'OElig;': "\u0152",
	'Oacute': "\u00D3",
	'Oacute;': "\u00D3",
	'Ocirc': "\u00D4",
	'Ocirc;': "\u00D4",
	'Ograve': "\u00D2",
	'Ograve;': "\u00D2",
	'Omega;': "\u03A9",
	'Omicron;': "\u039F",
	'Oslash': "\u00D8",
	'Oslash;': "\u00D8",
	'Otilde': "\u00D5",
	'Otilde;': "\u00D5",
	'Ouml': "\u00D6",
	'Ouml;': "\u00D6",
	'Phi;': "\u03A6",
	'Pi;': "\u03A0",
	'Prime;': "\u2033",
	'Psi;': "\u03A8",
	'QUOT': '"',
	'QUOT;': '"',
	'REG': "\u00AE",
	'REG;': "\u00AE",
	'Rho;': "\u03A1",
	'Scaron;': "\u0160",
	'Sigma;': "\u03A3",
	'THORN': "\u00DE",
	'THORN;': "\u00DE",
	'TRADE;': "\u2122",
	'Tau;': "\u03A4",
	'Theta;': "\u0398",
	'Uacute': "\u00DA",
	'Ucirc': "\u00DB",
	'Ucirc;': "\u00DB",
	'Ugrave': "\u00D9",
	'Ugrave;': "\u00D9",
	'Upsilon;': "\u03A5",
	'Uuml': "\u00DC",
	'Uuml;': "\u00DC",
	'Xi;': "\u039E",
	'Yacute': "\u00DD",
	'Yacute;': "\u00DD",
	'Yuml;': "\u0178",
	'Zeta;': "\u0396",
	'aacute': "\u00E1",
	'aacute;': "\u00E1",
	'acirc': "\u00E2",
	'acirc;': "\u00E2",
	'acute': "\u00B4",
	'acute;': "\u00B4",
	'aelig': "\u00E6",
	'aelig;': "\u00E6",
	'agrave': "\u00E0",
	'agrave;': "\u00E0",
	'alefsym;': "\u2135",
	'alpha;': "\u03B1",
	'amp': '&',
	'amp;': '&',
	'and;': "\u2227",
	'ang;': "\u2220",
	'apos;': "'",
	'aring': "\u00E5",
	'aring;': "\u00E5",
	'asymp;': "\u2248",
	'atilde': "\u00E3",
	'atilde;': "\u00E3",
	'auml': "\u00E4",
	'auml;': "\u00E4",
	'bdquo;': "\u201E",
	'beta;': "\u03B2",
	'brvbar': "\u00A6",
	'brvbar;': "\u00A6",
	'bull;': "\u2022",
	'cap;': "\u2229",
	'ccedil': "\u00E7",
	'ccedil;': "\u00E7",
	'cedil': "\u00B8",
	'cent': "\u00A2",
	'cent;': "\u00A2",
	'chi;': "\u03C7",
	'circ;': "\u02C6",
	'clubs;': "\u2663",
	'cong;': "\u2245",
	'copy': "\u00A9",
	'copy;': "\u00A9",
	'crarr;': "\u21B5",
	'cup;': "\u222A",
	'curren': "\u00A4",
	'curren;': "\u00A4",
	'dArr;': "\u21D3",
	'dagger;': "\u2020",
	'darr;': "\u2193",
	'deg': "\u00B0",
	'deg;': "\u00B0",
	'delta;': "\u03B4",
	'diams;': "\u2666",
	'divide': "\u00F7",
	'divide;': "\u00F7",
	'eacute': "\u00E9",
	'eacute;': "\u00E9",
	'ecirc': "\u00EA",
	'ecirc;': "\u00EA",
	'egrave': "\u00E8",
	'egrave;': "\u00E8",
	'empty;': "\u2205",
	'emsp;': "\u2003",
	'ensp;': "\u2002",
	'epsilon;': "\u03B5",
	'equiv;': "\u2261",
	'eta;': "\u03B7",
	'eth': "\u00F0",
	'eth;': "\u00F0",
	'euml': "\u00EB",
	'euml;': "\u00EB",
	'euro;': "\u20AC",
	'exist;': "\u2203",
	'fnof;': "\u0192",
	'forall;': "\u2200",
	'frac12': "\u00BD",
	'frac12;': "\u00BD",
	'frac14': "\u00BC",
	'frac14;': "\u00BC",
	'frac34': "\u00BE",
	'frac34;': "\u00BE",
	'frasl;': "\u2044",
	'gamma;': "\u03B3",
	'ge;': "\u2265",
	'gt': '>',
	'gt;': '>',
	'hArr;': "\u21D4",
	'harr;': "\u2194",
	'hearts;': "\u2665",
	'hellip;': "\u2026",
	'iacute': "\u00ED",
	'iacute;': "\u00ED",
	'icirc': "\u00EE",
	'icirc;': "\u00EE",
	'iexcl': "\u00A1",
	'iexcl;': "\u00A1",
	'igrave': "\u00EC",
	'igrave;': "\u00EC",
	'image;': "\u2111",
	'infin;': "\u221E",
	'int;': "\u222B",
	'iota;': "\u03B9",
	'iquest': "\u00BF",
	'iquest;': "\u00BF",
	'isin;': "\u2208",
	'iuml': "\u00EF",
	'iuml;': "\u00EF",
	'kappa;': "\u03BA",
	'lArr;': "\u21D0",
	'lambda;': "\u03BB",
	'lang;': "\u27E8",
	'laquo': "\u00AB",
	'laquo;': "\u00AB",
	'larr;': "\u2190",
	'lceil;': "\u2308",
	'ldquo;': "\u201C",
	'le;': "\u2264",
	'lfloor;': "\u230A",
	'lowast;': "\u2217",
	'loz;': "\u25CA",
	'lrm;': "\u200E",
	'lsaquo;': "\u2039",
	'lsquo;': "\u2018",
	'lt': '<',
	'lt;': '<',
	'macr': "\u00AF",
	'macr;': "\u00AF",
	'mdash;': "\u2014",
	'micro': "\u00B5",
	'micro;': "\u00B5",
	'middot': "\u00B7",
	'middot;': "\u00B7",
	'minus;': "\u2212",
	'mu;': "\u03BC",
	'nabla;': "\u2207",
	'nbsp': "\u00A0",
	'nbsp;': "\u00A0",
	'ndash;': "\u2013",
	'ne;': "\u2260",
	'ni;': "\u220B",
	'not': "\u00AC",
	'not;': "\u00AC",
	'notin;': "\u2209",
	'nsub;': "\u2284",
	'ntilde': "\u00F1",
	'ntilde;': "\u00F1",
	'nu;': "\u03BD",
	'oacute': "\u00F3",
	'oacute;': "\u00F3",
	'ocirc': "\u00F4",
	'ocirc;': "\u00F4",
	'oelig;': "\u0153",
	'ograve': "\u00F2",
	'ograve;': "\u00F2",
	'oline;': "\u203E",
	'omega;': "\u03C9",
	'omicron;': "\u03BF",
	'oplus;': "\u2295",
	'or;': "\u2228",
	'ordf': "\u00AA",
	'ordf;': "\u00AA",
	'ordm': "\u00BA",
	'ordm;': "\u00BA",
	'oslash': "\u00F8",
	'oslash;': "\u00F8",
	'otilde': "\u00F5",
	'otilde;': "\u00F5",
	'otimes;': "\u2297",
	'ouml': "\u00F6",
	'ouml;': "\u00F6",
	'para': "\u00B6",
	'para;': "\u00B6",
	'part;': "\u2202",
	'permil;': "\u2030",
	'perp;': "\u22A5",
	'phi;': "\u03C6",
	'pi;': "\u03C0",
	'piv;': "\u03D6",
	'plusmn': "\u00B1",
	'plusmn;': "\u00B1",
	'pound': "\u00A3",
	'pound;': "\u00A3",
	'prime;': "\u2032",
	'prod;': "\u220F",
	'prop;': "\u221D",
	'psi;': "\u03C8",
	'quot': '"',
	'quot;': '"',
	'rArr;': "\u21D2",
	'radic;': "\u221A",
	'rang;': "\u27E9",
	'raquo': "\u00BB",
	'raquo;': "\u00BB",
	'rarr;': "\u2192",
	'rceil;': "\u2309",
	'rdquo;': "\u201D",
	'real;': "\u211C",
	'reg': "\u00AE",
	'reg;': "\u00AE",
	'rfloor;': "\u230B",
	'rho;': "\u03C1",
	'rlm;': "\u200F",
	'rsaquo;': "\u203A",
	'rsquo;': "\u2019",
	'sbquo;': "\u201A",
	'scaron;': "\u0161",
	'sdot;': "\u22C5",
	'sect': "\u00A7",
	'sect;': "\u00A7",
	'shy': "\u00AD",
	'shy;': "\u00AD",
	'sigma;': "\u03C3",
	'sigmaf;': "\u03C2",
	'sim;': "\u223C",
	'spades;': "\u2660",
	'sub;': "\u2282",
	'sube;': "\u2286",
	'sum;': "\u2211",
	'sup1': "\u00B9",
	'sup1;': "\u00B9",
	'sup2': "\u00B2",
	'sup2;': "\u00B2",
	'sup3': "\u00B3",
	'sup3;': "\u00B3",
	'sup;': "\u2283",
	'supe;': "\u2287",
	'szlig': "\u00DF",
	'szlig;': "\u00DF",
	'tau;': "\u03C4",
	'there4;': "\u2234",
	'theta;': "\u03B8",
	'thetasym;': "\u03D1",
	'thinsp;': "\u2009",
	'thorn': "\u00FE",
	'thorn;': "\u00FE",
	'tilde;': "\u02DC",
	'times': "\u00D7",
	'times;': "\u00D7",
	'trade;': "\u2122",
	'uArr;': "\u21D1",
	'uacute': "\u00FA",
	'uacute;': "\u00FA",
	'uarr;': "\u2191",
	'ucirc': "\u00FB",
	'ucirc;': "\u00FB",
	'ugrave': "\u00F9",
	'ugrave;': "\u00F9",
	'uml': "\u00A8",
	'uml;': "\u00A8",
	'upsih;': "\u03D2",
	'upsilon;': "\u03C5",
	'uuml': "\u00FC",
	'uuml;': "\u00FC",
	'weierp;': "\u2118",
	'xi;': "\u03BE",
	'yacute': "\u00FD",
	'yacute;': "\u00FD",
	'yen': "\u00A5",
	'yen;': "\u00A5",
	'yuml': "\u00FF",
	'yuml;': "\u00FF",
	'zeta;': "\u03B6",
	'zwj;': "\u200D",
	'zwnj;': "\u200C"
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

