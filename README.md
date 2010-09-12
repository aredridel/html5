You'll need to initialize git submodules if you're pulling this from my git
repository. 

	git submodules init

To give it a test, set up your environment, including the directory containing the built dom.js from jsdom:

	export NODE_PATH=lib:deps/jsdom/lib

Or copy the contents of the jsdom lib directory to ~/.node_libraries/

and give it a run:

	node test.js

Git repository at http://theinternetco.net/~aredridel/projects/js/html5/.git/
