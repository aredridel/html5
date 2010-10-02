HTML5
============================================================================

## Synopsis

An example: 

    var HTML5 = require('html5')
    var parser = new HTML5.Parser()
    parser.parse(readableStream)

## HTML5.Parser

`Parser` is the entrance to the parsing system. Either call `parse` or
`parseFragment` on it, and it will build a DOM tree.

### Properties

* `$property` of `$Object`

### Event: '$Event'

`function($prototype) { }`

Emitted when $description

### HTML5.Parser.parse(readableStream or string)

Parse the parameter given, if a `readableStream` then asynchronously,
otherwise, immediately.

