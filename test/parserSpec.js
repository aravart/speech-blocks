// Generated by CoffeeScript 1.10.0
describe('Parser', function() {
  var parser;
  parser = new Parser();
  it('can recognize run commands', function() {
    expect(parser.parse("run it").name).toBe("Run");
    return expect(parser.parse("run the program").name).toBe("Run");
  });
  it('can recognize add block', function() {
    expect(parser.parse("add a blue block").name).toBe("Move");
    expect(parser.parse("add a blue block").what.name).toBe("New Block");
    return expect(parser.parse("add a blue block").what.color).toBe("blue");
  });
  it('can recognize change commands', function() {
    expect(parser.parse("change block one to 50 degrees").name).toBe("Modify");
    expect(parser.parse("change block one to 50 degrees").what.name).toBe("Block 1");
    expect(parser.parse("change block one to 50 degrees").property.name).toBe("Block 1");
    expect(parser.parse("change block one to move backward").name).toBe("Modify");
    expect(parser.parse("change block one to move backward").what.name).toBe("Block 1");
    return expect(parser.parse("change block one to move backward").propertyValue.name).toBe("backward");
  });
  it('can recognize move commands', function() {
    expect(parser.parse("move block three before block five").name).toBe("Move");
    expect(parser.parse("move block three before block five").what.name).toBe("Block 3");
    expect(parser.parse("move block three before block five").where.block.name).toBe("Block 5");
    expect(parser.parse("move block three before block five").where.position.name).toBe("before");
    expect(parser.parse("move block three after block five").name).toBe("Move");
    expect(parser.parse("move block three after block five").what.name).toBe("Block 3");
    expect(parser.parse("move block three after block five").where.block.name).toBe("Block 5");
    return expect(parser.parse("move block three after block five").where.position.name).toBe("after");
  });
  return it('can recognize delete commands', function() {
    expect(parser.parse("delete block three").name).toBe("Delete");
    expect(parser.parse("delete block three").what.name).toBe("Block 3");
    expect(parser.parse("remove block three").name).toBe("Delete");
    return expect(parser.parse("remove block three").what.name).toBe("Block 3");
  });
});
