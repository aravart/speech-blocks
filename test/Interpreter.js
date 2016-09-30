// Generated by CoffeeScript 1.10.0
(function() {
  var Interpreter;

  Interpreter = (function() {
    function Interpreter() {}

    Interpreter.prototype.controller = new Controller;

    Interpreter.prototype.id = 0;

    Interpreter.prototype.interpret = function(command) {
      if (command.action === "Run") {
        return run(command);
      } else if (command.action === "Add") {
        return addBlock(command);
      } else if (command.action === "Move") {
        return moveBlock(command);
      } else if (command.action === "Modify") {
        return modifyBlock(command);
      } else if (command.action === "Delete") {
        return deleteBlock(command);
      }
    };

    Interpreter.prototype.run = function(command) {};

    Interpreter.prototype.addBlock = function(command) {
      return console.log("controller.addBlock(type, id++, commmand.where)");
    };

    Interpreter.prototype.moveBlock = function(command) {
      return console.log("controller.moveBlock(command.block.number, command.where)");
    };

    Interpreter.prototype.modifyBlock = function(command) {};

    Interpreter.prototype.deleteBlock = function(command) {
      return console.log("controller.removeBlock(command.block.number)");
    };

    return Interpreter;

  })();

}).call(this);
