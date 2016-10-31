.PHONY: chrome

COFFEE_SRC := $(shell find . -name '*.coffee')
COFFEE_JS := $(COFFEE_SRC:.coffee=.js)

%.js: %.coffee
	coffee -c $<

all: grammar/grammar.js $(COFFEE_JS)

chrome: grammar/grammar.js
	mkdir -p chrome/speech-blocks
	mkdir -p chrome/speech-blocks/core
	mkdir -p chrome/speech-blocks/grammar
	mkdir -p chrome/speech-blocks/external
	cp grammar/grammar.js chrome/speech-blocks/grammar
	cp core/* chrome/speech-blocks/core
	cp external/jsDump.js chrome/speech-blocks/external

grammar/grammar.js: grammar/grammar.pegjs
	pegjs --format globals --export-var parser -o $@ $<

clean:
	rm -rf chrome/speech-blocks

print:
	@echo $(COFFEE_JS)
