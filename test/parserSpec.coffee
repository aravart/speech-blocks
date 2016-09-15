describe 'Parser', ->
    parser = new Parser()

    it 'can recognize run commands', ->
        expect(parser.parse("run it").name).toBe "Run"
        expect(parser.parse("run the program").name).toBe "Run"

    it 'can recognize add a blue block', ->
        expect(parser.parse("add a blue block").name).toBe "Move"
        expect(parser.parse("add a blue block").what.name).toBe "New Block"
        expect(parser.parse("add a blue block").what.color).toBe "blue"
