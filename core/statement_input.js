/**
 * @fileoverview Represents a block to which we want to add a child. 
 * @author ehernandez4@wisc.edu (Evan Hernandez)
 */
'use strict'

goog.provide('SpeechBlocks.StatementInput');

/** 
 * @param {string} parentBlockId The ID of the parent block. 
 * @param {string} inputName The name of the statement input.
 * @param {!Blockly.Workspace} workspace The current workspace.
 * @extends {SpeechBlocks.Where} 
 * @constructor 
 */
SpeechBlocks.StatementInput = function(parentBlockId, inputName) {
  /** @private @const */
  this.parentBlockId_ = parentBlockId;

  /** @private @const */
  this.inputName_ = inputName;
};

/**
 * Places the block as the first statement input of the given parent block field. 
 * Throws an exception if the parent or child block do not exist in this workspace,
 * or if the connection is incompatible.
 * @override 
 */
SpeechBlocks.StatementInput.prototype.place = function(blockId, workspace) {
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
  if (!input || input.type != Blockly.NEXT_STATEMENT) {
    throw 'No statement input with name ' + this.inputName_ + ' in block ' + this.parentBlockId_;
  } else if (!input.connection.isConnectionAllowed(block.previousConnection)) {
    throw 'Block ' + blockId + ' cannot be a statement input for block ' + this.parentBlockId_;
  }

  input.connection.connect(block.previousConnection);
}; 
