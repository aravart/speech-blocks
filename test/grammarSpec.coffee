describe 'Parser', ->

    it 'can recognize run commands', ->
        expect(parser.parse("run it").action).toBe "run"
        expect(parser.parse("run the program").action).toBe "run"

    it 'can recognize add block', ->
        expect(parser.parse("add an if block").action).toBe "add"
        expect(parser.parse("add an if block").type).toBe "if"
        expect(parser.parse("add a repeat block").type).toBe "repeat"

    it 'can recognize change commands', ->
        expect(parser.parse("in block 5 change the operation to multiply").action).toBe "modify"
        expect(parser.parse("in block 5 change the operation to multiply").block).toBe 5
        expect(parser.parse("in block 5 change the operation to multiply").property).toBe "operation"
        expect(parser.parse("in block 5 change the operation to multiply").value).toBe "*"
        expect(parser.parse("in block 5 change the plus to multiply").property).toBe "operation"
        expect(parser.parse("in block 5 change the plus to multiply").value).toBe "*"
        expect(parser.parse("in block 5 change the variable name to foo").property).toBe "name"
        expect(parser.parse("in block 5 change the variable name to foo").value).toBe "foo"
        expect(parser.parse("in block number 5 change the comparison to equals").property).toBe "comparison"
        expect(parser.parse("in block number 5 change the comparison to equals").value).toBe "=="
        expect(parser.parse("in block number 5 change the number to 50").property).toBe "number"
        expect(parser.parse("in block number 5 change the number to 50").value).toBe 50
        expect(parser.parse("in block number 5 change the text to foo bar baz").property).toBe "text"
        expect(parser.parse("in block number 5 change the text to foo bar baz").value).toBe "foo bar baz"

    it 'can recognize move commands', ->
        expect(parser.parse("move block 3 before block 5").action).toBe "move"
        expect(parser.parse("move block 3 before block 5").block).toBe 3
        expect(parser.parse("move block 3 before block 5").where.block).toBe 5
        expect(parser.parse("move block 3 before block 5").where.position).toBe "before"
        expect(parser.parse("move block 3 after block 5").where.position).toBe "after"
        expect(parser.parse("move block 6 into the lefthand side of block 8").where.position).toBe "lhs"
        expect(parser.parse("move block 6 into the first field of block 8").where.position).toBe "lhs"
        expect(parser.parse("move block 6 into the lefthand side of block 8").where.block).toBe 8

    it 'can recognize delete commands', ->
        expect(parser.parse("move block 3 to the trash").action).toBe "move"
        expect(parser.parse("move block 3 to the trash").block).toBe 3
        expect(parser.parse("move block 3 to the trash").where).toBe "trash"
