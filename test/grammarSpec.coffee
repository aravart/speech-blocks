describe 'Parser', ->

    it 'can recognize run commands', ->
        expect(parser.parse("run it").action).toBe "Run"
        expect(parser.parse("run the program").action).toBe "Run"

    it 'can recognize add block', ->
        expect(parser.parse("add a blue block").action).toBe "Add"
        expect(parser.parse("add a blue block").block.color).toBe "blue"

    it 'can recognize change commands', ->
        expect(parser.parse("change block 1 to 50 degrees").action).toBe "Modify"
        expect(parser.parse("change block 1 to 50 degrees").block.number).toBe 1
        expect(parser.parse("change block 1 to 50 degrees").property.type).toBe "degree"
        expect(parser.parse("change block 1 to 50 degrees").property.value).toBe 50

        expect(parser.parse("change block 1 to move backwards").action).toBe "Modify"
        expect(parser.parse("change block 1 to move backwards").block.number).toBe 1
        expect(parser.parse("change block 1 to move backwards").property.type).toBe "direction"
        expect(parser.parse("change block 1 to move backwards").property.value).toBe "backwards"

    it 'can recognize move commands', ->
        expect(parser.parse("move block 3 before block 5").action).toBe "Move"
        expect(parser.parse("move block 3 before block 5").block.number).toBe 3
        expect(parser.parse("move block 3 before block 5").where.block.number).toBe 5
        expect(parser.parse("move block 3 before block 5").where.position).toBe "before"
        expect(parser.parse("move block 3 after block 5").where.position).toBe "after"

    it 'can recognize delete commands', ->
        expect(parser.parse("delete block 3").action).toBe "Delete"
        expect(parser.parse("delete block 3").block.number).toBe 3
        expect(parser.parse("remove block 3").action).toBe "Delete"
        expect(parser.parse("remove block 10").block.number).toBe 10
