Usage:

	var HTML5 = require('html5');

Major kinds of object:

	HTML5.Parser

Parses tokens into a DOM tree

	HTML5.Tokenizer

Parses textual input into a stream of tokens

	HTML5.TreeWalker

Walks a DOM tree and emits a stream of tokens

Major functions:

	HTML5.serialize(sourcetree, target)

Will use a TreeWalker to walk a tree, taking the stream of tokens and emitting
'data' events to target, passing a string each time.
