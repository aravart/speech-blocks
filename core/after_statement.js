/**
 * @fileoverview Represents the "successor" connection point of a given block.
 * @author ehernandez4@wisc.edu (Evan Hernandez)
 */
'use strict';

goog.provide('SpeechBlocks.AfterStatement');

/**
 * @param {string} predecessorBlockId The ID of the predecessor block. 
 * @extends {SpeechBlocks.Where}
 * @constructor
 */
SpeechBlocks.AfterStatement = function(predecessorBlockId) {
  /** @private @const */
  this.predecessorBlockId_ = predecessorBlockId;
};

/**
 * Connects the given block to the successor connection of the predecessor block.
 * Throws an exception if the given block or the parent block do not exist,
 * or if the connection is incompatible.
 * @override
 */
SpeechBlocks.AfterStatement.prototype.place = function(blockId, workspace) {
  var block = workspace.getBlockById(blockId);
  if (!block) {
    throw 'No such block: ' + blockId;
  } 

  var predecessorBlock = workspace.getBlockById(this.predecessorBlockId_);
  if (!predecessorBlock) {
    throw 'No such block: ' + this.predecessorBlockId_;
  } 
 
  // TODO(evanfredhernandez): More error checking. Handle case where one or both blocks are already plugged in. 
 
  predecessorBlock.nextConnection.connect(block.previousConnection);
};
