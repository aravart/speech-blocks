COFFEE_SRC := $(shell find . -name '*.coffee')
COFFEE_JS := $(COFFEE_SRC:.coffee=.js)

%.js: %.coffee
	coffee -c $<

all: grammar/grammar.js $(COFFEE_JS)

chrome: grammar/grammar.js core/*.js external/*.js
	mkdir -p chrome/speech-blocks
	mkdir -p chrome/speech-blocks/core
	mkdir -p chrome/speech-blocks/grammar
	mkdir -p chrome/speech-blocks/js
	cp grammar/grammar.js chrome/speech-blocks/grammar
	cp core/* chrome/speech-blocks/core
	cp js/jsDump.js chrome/speech-blocks/js
	cp external/bootstrap-3.3.7-dist/js/bootstrap.min.js chrome/speech-blocks/js
	cp external/jquery.js chrome/speech-blocks/js

grammar/grammar.js: grammar/grammar.pegjs
	pegjs --format globals --export-var parser -o $@ $<

clean:
	rm -rf chrome/speech-blocks

print:
	@echo $(COFFEE_JS)
