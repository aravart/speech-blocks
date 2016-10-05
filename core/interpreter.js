/**
* @fileoverview Interprets a given command and calls workspace controller_.functions.
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
* @param {!SpeechBlocks.Controller} controller_.The workspace controller_.
*/
SpeechBlocks.Interpreter = function(controller) {
  /** @private @const */
  this.controller_ = controller;
  /** @private */
  this.id_ = 1;
  /** @private */
  this.blockTypeMap_ = new goog.structs.Map();
  /**
  this.blockTypeMap_.set('if','controls_if');
  this.blockTypeMap_.set('comparison','logic_compare');
  this.blockTypeMap_.set('repeat','controls_repeat_ext');
  this.blockTypeMap_.set('number','math_number');
  this.blockTypeMap_.set('arithmetic','math_arithmetic');
  this.blockTypeMap_.set('text','text');
  this.blockTypeMap_.set('print','text_print');
  this.blockTypeMap_.set('set','variables_set');
  this.blockTypeMap_.set('variable','variables_get');
  */
  // temporary
  var rawFile;
  try {
    rawFile = new XMLHttpRequest();
    rawFile.open("GET", 'https://aravart.github.io/speech-blocks/grammar/blockTypeMap.txt', true);
    rawFile.onreadystatechange = function () {
      if(rawFile.readyState == 4) {
        if(rawFile.status == 200 || rawFile.status == 0) {
          var inputText = rawFile.responseText;
          inputText = inputText.split(/\r\n|\r|\n/g);
          for (var i = 0; i < inputText.length; i++) {
            var keyValuePair = inputText[i].split(":");
            this.blockTypeMap_.set(keyValuePair[0], keyValuePair[1]);
          }
          console.log(inputText);
        }
      }
      rawFile.send(null);
    }
  } catch(err) { console.log(err.message); }

  this.initializeXMLHttpRequest();
  this.initializeBlockTypeMap();
  console.log(this.blockTypeMap_.get('set'));
}

SpeechBlocks.Interpreter.prototype.initializeBlockTypeMap = function() {
  this.rawFile.onreadystatechange();
}

SpeechBlocks.Interpreter.prototype.initializeXMLHttpRequest = function() {
  this.rawFile = new XMLHttpRequest();
  this.rawFile.open("GET", 'https://aravart.github.io/speech-blocks/grammar/blockTypeMap.txt', true);
  this.rawFile.onreadystatechange = function () {
    if(this.rawFile.readyState == 4) {
      if(this.rawFile.status == 200 || this.rawFile.status == 0) {
        var inputText = this.rawFile.responseText;
        inputText = inputText.split(/\r\n|\r|\n/g);
        for (var i = 0; i < inputText.length; i++) {
          var keyValuePair = inputText[i].split(":");
          this.blockTypeMap_.set(keyValuePair[0], keyValuePair[1]);
        }
        console.log(inputText);
      }
    }
    this.rawFile.send(null);
  }
}

/**
* Interprets a given command by calling the corresponding action function.
* @param {Object=} command Command object from parser.
*/
SpeechBlocks.Interpreter.prototype.interpret = function(command) {
  switch (command.action) {
    case 'run': this.run(command); break;
    case 'add': this.addBlock(command); break;
    case 'move': this.moveBlock(command); break;
    case 'modify': this.modifyBlock(command); break;
    case 'delete': this.deleteBlock(command); break;
    default: console.log('Unsupported command');
  }
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
  if (type != null) { this.controller_.addBlock(type, (this.id_++).toString(), new SpeechBlocks.Translation(0,0)); }
};

/**
* @TODO Implement error checking
* Moves a specified block.
* @param {Object=} command Command object from parser.
*/
SpeechBlocks.Interpreter.prototype.moveBlock = function(command) {
  // ensure these fields are strings, so validity checking works properly
  command.block = command.block.toString();
  command.where.block = command.where.block.toString();
  if (this.isBlockIdValid(command.block)) {
    if (command.where == 'trash') {
      this.deleteBlock(command.block);
    } else {
      if (this.isBlockIdValid(command.where.block)) {
        switch (command.where.position) {
          // modify these so the 'where' field is right
          case 'after': this.controller_.moveBlock(command.block, new SpeechBlocks.Successor(command.where.block)); break;
          case 'before': this.controller_.moveBlock(command.block, new SpeechBlocks.Predecessor(command.where.block)); break;
          case 'lhs': case 'rhs': case 'to the right of':
          var inputList_ = this.controller_.getBlockValueInputs(command.where.block);
          if (inputList_.length < 1) { console.log('NO VALUE INPUTS FOR SPECIFIED BLOCK'); }
          else if (command.where.position == 'rhs' || command.where.position == 'to the right of') { this.controller_.moveBlock(command.block, new SpeechBlocks.ValueInput(command.where.block, inputList_[inputList_.length-1]));	}
          else { this.controller_.moveBlock(command.block, new SpeechBlocks.ValueInput(command.where.block, inputList_[0])); }
          case 'inside':
          var statementList_ = this.controller_.getBlockStatementInputs(command.where.block);
          if (statementList_.length < 1) { console.log('NO STATEMENT INPUTS FOR SPECIFIED BLOCK'); }
          else { this.controller_.moveBlock(command.block, new SpeechBlocks.StatementInput(command.where.block, statementList_[statementList_.length-1])); }
          break;
          default:
          console.log('Unsupported position');
        }
      }
    }
  }
  else {
    console.log('Invalid block Id');
  }
};

/**
* @TODO Implement each case of property
* Modifies a specified block.
* @param {Object=} command Command object from parser.
*/
SpeechBlocks.Interpreter.prototype.modifyBlock = function(command) {
  if (this.isBlockIdValid(command.block)) {
    switch(command.property) {
      case 'number':
      command.value = Number(command.value);
      this.controller.setBlockField(command.block, fieldName, command.value);
      break;
      case 'text':

      this.controller.setBlockField(command.block, fieldName, command.value);
      break;
      case 'comparison':

      this.controller.setBlockField(command.block, fieldName, command.value);
      break;
      case 'operation':

      this.controller.setBlockField(command.block, fieldName, command.value);
      break;
      case 'name':

      this.controller.setBlockField(command.block, fieldName, command.value);
      break;
      default:
      console.log('Unsupported property');
    }
    console.log('MODIFY NOT YET SUPPORTED');
  }
  else {
    console.log('Invalid block Id');
  }
};

/**
* Delete a specified block.
* @param {Object=} command Command object from parser.
*/
SpeechBlocks.Interpreter.prototype.deleteBlock = function(blockId) {
  if (this.isBlockIdValid(blockId)) { this.controller_.removeBlock(blockId); }
  else { console.log('Invalid block Id'); }
};

/**
* Checks to see if a block Id is valid.
* @param {!String=} blockId as string.
*/
SpeechBlocks.Interpreter.prototype.isBlockIdValid = function(blockRequestId) {
  return this.controller_.getAllBlockIds().contains(blockRequestId);
}
