/**
* @fileoverview Interprets a given command and calls workspace controller functions.
* @author pandori@wisc.edu (Sahib Pandori)
* @author david.liang@wisc.edu (David Liang)
*/

'use strict';

goog.provide('SpeechBlocks.Interpreter');

goog.require('SpeechBlocks.Predecessor');
goog.require('SpeechBlocks.StatementInput')
goog.require('SpeechBlocks.Successor');
goog.require('SpeechBlocks.Translation');
goog.require('SpeechBlocks.ValueInput');
goog.require('goog.structs.Map');

/**
* Constructs an interpreter that takes actions as input and controls the Blockly Workspace.
* @param {!SpeechBlocks.Controller} controller The workspace controller.
*/
SpeechBlocks.Interpreter = function(controller) {
  /** @private @const */
  this.controller_ = controller;
  /** @private */
  this.id_ = 1;
  /** @private */
  this.blockTypeMap_ = new goog.structs.Map();
  this.blockTypeMap_.set('if','controls_if');
  this.blockTypeMap_.set('comparison','logic_compare');
  this.blockTypeMap_.set('repeat','controls_repeat_ext');
  this.blockTypeMap_.set('number','math_number');
  this.blockTypeMap_.set('arithmetic','math_arithmetic');
  this.blockTypeMap_.set('text','text');
  this.blockTypeMap_.set('print','text_print');
  this.blockTypeMap_.set('set','variables_set');
  this.blockTypeMap_.set('variable','variables_get');
}

/**
* Interprets a given command by calling the corresponding action function.
* @param {Object=} command Command object from parser.
*/
SpeechBlocks.Interpreter.prototype.interpret = function(command) {
  if (command.action == 'run') { this.run(command); }
  else if (command.action == 'add') { this.addBlock(command); }
  else if (command.action == 'move') { this.moveBlock(command); }
  else if (command.action == 'modify') { this.modifyBlock(command); }
  else if (command.action == 'delete') { this.deleteBlock(command); }
};

/**
* Compiles the Blockly code into JavaScript and runs it.
* @param {Object=} command Object with command specifics from the parser.
*/
SpeechBlocks.Interpreter.prototype.run = function(command) {
  Blockly.JavaScript.addReservedWords('code');
  var code = Blockly.JavaScript.workspaceToCode(this.controller_.workspace);
  eval(code);
};

/**
* Adds a specified block.
* @param {Object=} command Command object from parser.
*/
SpeechBlocks.Interpreter.prototype.addBlock = function(command) {
  var type = this.blockTypeMap_.get(command.type);
  //console.log(typeof((this.id_++).toString()));
  if (type != null) { controller.addBlock(type, (this.id_++).toString(), new SpeechBlocks.Translation(0,0)); }
};

/**
* @TODO implement with proper where
* Moves a specified block.
* @param {Object=} command Command object from parser.
*/
SpeechBlocks.Interpreter.prototype.moveBlock = function(command) {
  command.block = command.block.toString();
  command.where.block = command.where.block.toString();
  if (this.validBlockId(command.block)) {
    if (command.where == 'trash') {
      this.deleteBlock(command.block);
    } else {
      if (this.validBlockId(command.where.block)) {
        switch(command.where.position) {
          // modify these so the 'where' field is right
          case 'after': this.controller_.moveBlock(command.block, new SpeechBlocks.Successor(command.where.block)); break;
          case 'before': this.controller_.moveBlock(command.block, new SpeechBlocks.Predecessor(command.where.block)); break;
          case 'lhs': case 'rhs': case 'to the right of':
          var inputList_ = this.controller_.getBlockValueInputs(command.where.block);
          if (inputList_.length < 1) throw 'NO VALUE INPUTS FOR SPECIFIED BLOCK';
          else if (command.where.position == 'lhs') {
            this.controller_.moveBlock(command.block, new SpeechBlocks.ValueInput(command.where.block, inputList_[0]));
          }
          else if (command.where.position == 'rhs' || command.where.position == 'to the right of') {
            this.controller_.moveBlock(command.block, new SpeechBlocks.ValueInput(command.where.block, inputList_[inputList_.length-1]));
          }
          case 'inside':
          var statementList_ = this.controller_.getBlockStatementInputs(command.where.block);
          if (statementList_.length < 1) throw 'NO VALUE INPUTS FOR SPECIFIED BLOCK';
          this.controller_.moveBlock(command.block, new SpeechBlocks.StatementInput(command.where.block, statementList_[statementList_.length-1]));
          break;
        }
      }
    }
  }
  else {
    console.log('Invalid block Id');
  }
};

/**
* @TODO implement
* Modifies a specified block.
* @param {Object=} command Command object from parser.
*/
SpeechBlocks.Interpreter.prototype.modifyBlock = function(command) {
  if (this.validBlockId(command.block)) { throw new Error('MODIFY NOT SUPPORTED'); }
};

/**
* Delete a specified block.
* @param {Object=} command Command object from parser.
*/
SpeechBlocks.Interpreter.prototype.deleteBlock = function(blockId) {
  controller.removeBlock(blockId);
};

/**
* Checks to see if a block Id is valid.
* @param {!String=} blockId as string.
*/
SpeechBlocks.Interpreter.prototype.validBlockId = function(blockRequestId) {
  return this.controller_.getAllBlockIds().contains(blockRequestId.toString());
}
