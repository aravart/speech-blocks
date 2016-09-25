// Generated by CoffeeScript 1.10.0
(function() {
  describe('Parser', function() {
    it('can recognize run commands', function() {
      expect(parser.parse("run it").action).toBe("Run");
      return expect(parser.parse("run the program").action).toBe("Run");
    });
    it('can recognize add block', function() {
      expect(parser.parse("add a blue block").action).toBe("Add");
      return expect(parser.parse("add a blue block").block.color).toBe("blue");
    });
    it('can recognize change commands', function() {
      expect(parser.parse("change block 1 to 50 degrees").action).toBe("Modify");
      expect(parser.parse("change block 1 to 50 degrees").block.number).toBe(1);
      expect(parser.parse("change block 1 to 50 degrees").property.type).toBe("degree");
      expect(parser.parse("change block 1 to 50 degrees").property.value).toBe(50);
      expect(parser.parse("change block 1 to move backwards").action).toBe("Modify");
      expect(parser.parse("change block 1 to move backwards").block.number).toBe(1);
      expect(parser.parse("change block 1 to move backwards").property.type).toBe("direction");
      return expect(parser.parse("change block 1 to move backwards").property.value).toBe("backwards");
    });
    it('can recognize move commands', function() {
      expect(parser.parse("move block 3 before block 5").action).toBe("Move");
      expect(parser.parse("move block 3 before block 5").block.number).toBe(3);
      expect(parser.parse("move block 3 before block 5").where.block.number).toBe(5);
      expect(parser.parse("move block 3 before block 5").where.position).toBe("before");
      return expect(parser.parse("move block 3 after block 5").where.position).toBe("after");
    });
    return it('can recognize delete commands', function() {
      expect(parser.parse("delete block 3").action).toBe("Delete");
      expect(parser.parse("delete block 3").block.number).toBe(3);
      expect(parser.parse("remove block 3").action).toBe("Delete");
      return expect(parser.parse("remove block 10").block.number).toBe(10);
    });
  });

}).call(this);