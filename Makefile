UGLIFY_BIN=node_modules/uglify-js/bin/uglifyjs
NODE_BIN=/usr/local/bin/node
JASMINE_BIN=node_modules/jasmine/bin/jasmine.js

.PHONY: docs clean deps test publish all

all: deps atom.min.js docs

atom.min.js:
	$(UGLIFY_BIN) atom.js > atom.min.js

test: deps
	$(NODE_BIN) $(JASMINE_BIN)

publish:
	npm publish --access=public

deps: node_modules

node_modules:
	npm install

clean:
	rm -rf docs
	rm atom.min.js
