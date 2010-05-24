To give it a test, set up your environment, including the directory containing the built dom.js from jsdom:

	export NODE_PATH=lib:/path/to/jsdom/lib:/path/to/nodeunit/lib

Or copy the contents of the env-js dist directory and the nodeunit lib directory to ~/.node_libraries

and give it a run:

	node test.js

That's it for now, integration with a modularized env.js coming.

Git repository at http://theinternetco.net/~aredridel/projects/js/html5/.git/
