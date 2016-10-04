/**
* @fileoverview Interprets a given command and calls workspace controller functions.
* @author pandori@wisc.edu (Sahib Pandori)
* @author david.liang@wisc.edu (David Liang)
*/

'use strict';

goog.provide('SpeechBlocks.Interpreter');
goog.require('goog.structs.Map');

// maps block types to Blockly's specific names
var blockTypeMap = new goog.structs.Map();

/**
* Constructs an interpreter that takes actions as input and controls the Blockly Workspace.
* @param controller The workspace controller.
*/
SpeechBlocks.Interpreter = function(controller) {
  this.controller = controller;
  this.id = 1;
  SpeechBlocks.Interpreter.createBlockTypeMap();
}

/**
* @TODO Allow for file input.
* Creates the blockTypeMap to map command block types to actual names used by Blockly.
*/
SpeechBlocks.Interpreter.createBlockTypeMap = function() {
  blockTypeMap.set('if','controls_if');
  blockTypeMap.set('comparison','logic_compare');
  blockTypeMap.set('repeat','controls_repeat_ext');
  blockTypeMap.set('number','math_number');
  blockTypeMap.set('arithmetic','math_arithmetic');
  blockTypeMap.set('text','text');
  blockTypeMap.set('print','text_print');
  blockTypeMap.set('set','variables_set');
  blockTypeMap.set('variable','variables_get');
}

/**
* Interprets a given command by calling the corresponding action function.
* @param {Object=} command Command object from parser.
*/
SpeechBlocks.Interpreter.prototype.interpret = function(command) {
  if (command.action == "run") {
    try { this.run(command); }
    catch(e) { console.log(e.message.cat(e.stack)) };
  } else if (command.action == "add") {
    this.addBlock(command);
  } else if (command.action == "move") {
    this.moveBlock(command);
  } else if (command.action == "modify") {
    this.modifyBlock(command);
  } else if (command.action == "delete") {
    this.deleteBlock(command);
  }
};

/**
* Compiles the Blockly code into JavaScript and runs it.
* @param {Object=} command Object with command specifics from the parser.
*/
SpeechBlocks.Interpreter.prototype.run = function(command) {
  Blockly.JavaScript.addReservedWords('code');
  var code = Blockly.JavaScript.workspaceToCode(this.controller.workspace);
  try { eval(code); }
  catch(err) {};
};

/**
* Adds a specified block.
* @param {Object=} command Command object from parser.
*/
SpeechBlocks.Interpreter.prototype.addBlock = function(command) {
  controller.addBlock(blockTypeMap.get(command.type), this.id++, new SpeechBlocks.Translation(0,0));
};

/**
* @TODO implement with proper where
* Moves a specified block.
* @param {Object=} command Command object from parser.
*/
SpeechBlocks.Interpreter.prototype.moveBlock = function(command) {
  if (command.where = "trash") {
    this.deleteBlock(command.block);
  } else {
    if (this.validBlockID(command.where.block)) { // moving after a block, NEED A JOIN METHOD
      switch(command.where.position) {
        // modify these so the "where" field is right
        case "after": controller.moveBlock(command.block, command.where.block); break;
        case "before": controller.moveBlock(command.block, command.where.block); break;
        case "inside": controller.moveBlock(command.block, command.where.block); break;
        case "to the right of": controller.moveBlock(command.block, command.where.block); break;
        case "lhs": controller.moveBlock(command.block, command.where.block); break;
        case "rhs": controller.moveBlock(command.block, command.where.block); break;
      }
    }
  }
};

/**
* @TODO implement
* Modifies a specified block.
* @param {Object=} command Command object from parser.
*/
SpeechBlocks.Interpreter.prototype.modifyBlock = function(command) {
  if (this.validBlockID(command.block)) { throw new Error("MODIFY NOT SUPPORTED"); }
};

/**
* Delete a specified block.
* @param {Object=} command Command object from parser.
*/
SpeechBlocks.Interpreter.prototype.deleteBlock = function(command) {
  if (this.validBlockID(command.block)) { controller.removeBlock(command.block); }
};

/**
* Checks to see if a block ID is valid.
* @param {!String=} blockID as string.
*/
SpeechBlocks.Interpreter.prototype.validBlockID = function(blockRequestID) {
  var found = false;
  this.controller.getAllBlockIds().forEach(function(id) {
    if (blockRequestID == id) { found = true; }
  });
  return found;
}
