describe 'Parser', ->
    parser = new Parser()

    it 'can recognize run commands', ->
        expect(parser.parse("run it").name).toBe "Run"
        expect(parser.parse("run the program").name).toBe "Run"

    it 'can recognize add block', ->
        expect(parser.parse("add a blue block").name).toBe "Move"
        expect(parser.parse("add a blue block").what.name).toBe "New Block"
        expect(parser.parse("add a blue block").what.color).toBe "blue"

    it 'can recognize change commands', ->
        expect(parser.parse("change block one to 50 degrees").name).toBe "Modify"
        expect(parser.parse("change block one to 50 degrees").what.name).toBe "Block 1"
        expect(parser.parse("change block one to 50 degrees").property.name).toBe "Block 1"

        expect(parser.parse("change block one to move backward").name).toBe "Modify"
        expect(parser.parse("change block one to move backward").what.name).toBe "Block 1"
        expect(parser.parse("change block one to move backward").propertyValue.name).toBe "backward"

    it 'can recognize move commands', ->
        expect(parser.parse("move block three before block five").name).toBe "Move"
        expect(parser.parse("move block three before block five").what.name).toBe "Block 3"
        expect(parser.parse("move block three before block five").where.block.name).toBe "Block 5"
        expect(parser.parse("move block three before block five").where.position.name).toBe "before"

        expect(parser.parse("move block three after block five").name).toBe "Move"
        expect(parser.parse("move block three after block five").what.name).toBe "Block 3"
        expect(parser.parse("move block three after block five").where.block.name).toBe "Block 5"
        expect(parser.parse("move block three after block five").where.position.name).toBe "after"

    it 'can recognize delete commands', ->
        expect(parser.parse("delete block three").name).toBe "Delete"
        expect(parser.parse("delete block three").what.name).toBe "Block 3"
        expect(parser.parse("remove block three").name).toBe "Delete"
        expect(parser.parse("remove block three").what.name).toBe "Block 3"
