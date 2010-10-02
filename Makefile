doc/api.html: doc/api.markdown doc/api_header.html doc/api_footer.html
	node tools/ronnjs/bin/ronn.js --fragment doc/api.markdown \
	| sed "s/<h2>\(.*\)<\/h2>/<h2 id=\"\1\">\1<\/h2>/g" \
	| cat doc/api_header.html - doc/api_footer.html > $@

doc/changelog.html: ChangeLog doc/changelog_header.html doc/changelog_footer.html
	cat doc/changelog_header.html ChangeLog doc/changelog_footer.html > $@

doc/node-$PROJECT.3: doc/api.markdown all
	node tools/ronnjs/bin/ronn.js --roff doc/api.markdown > $@

doc: doc/node-$PROJECT.3 doc/api.html doc/changelog.html
