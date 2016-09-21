/**
 * @fileoverview Represents a value input connection point for a block.
 * @author ehernandez4@wisc.edu (Evan Hernandez)
 */
'use strict';

goog.provide('SpeechBlocks.ValueInput');

goog.require('Blockly.constants');

/**
 * @param {string} parentBlockId The ID of the parent block. 
 * @param {string} inputName The name of the value input.
 * @extends {SpeechBlocks.Where}
 * @constructor
 */
SpeechBlocks.ValueInput = function(parentBlockId, inputName) {
  /** @private @const */
  this.parentBlockId_ = parentBlockId;
  
  /** @private @const */
  this.inputName_ = inputName;
};

/**
 * Connects the given block to the value input of the parent block.
 * Throws an exception if the given block or the parent block do not exist,
 * or if the connection is incompatible.
 * @override
 */
SpeechBlocks.ValueInput.prototype.place = function(blockId, workspace) {
  var block = workspace.getBlockById(blockId);
  if (!block) {
    throw 'No such block: ' + blockId;
  } 

  var parentBlock = workspace.getBlockById(this.parentBlockId_);
  if (!parentBlock) {
    throw 'No such block: ' + this.parentBlockId_;
  }

  // TODO(evanfredhernandez): Handle case where block's output connection is in use.
  var input = parentBlock.getInput(this.inputName_);
  if (!input || input.type != Blockly.INPUT_VALUE) {
    throw 'No value input with name ' + this.inputName_ + ' in block ' + this.parentBlockId_;
  } else if (!input.connection.isConnectionAllowed(block.outputConnection)) {
    throw 'Block ' + blockId + ' cannot be a value input for block ' + this.parentBlockId_;
  }

  input.connection.connect(block.outputConnection);
};
