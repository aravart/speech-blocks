COFFEE_SRC := $(shell find . -name '*.coffee')
COFFEE_JS := $(COFFEE_SRC:.coffee=.js)

%.js: %.coffee
	coffee -c $<

all: grammar/grammar.js $(COFFEE_JS)

grammar/grammar.js: grammar/grammar.pegjs
	pegjs --format globals --export-var parser -o $@ $<


print:
	@echo $(COFFEE_JS)

