/**
 * @fileoverview Represents the "successor" connection point of a block.
 * @author ehernandez4@wisc.edu (Evan Hernandez)
 */
'use strict';

goog.provide('SpeechBlocks.Successor');

/**
 * @param {string} predecessorBlockId The ID of the predecessor block. 
 * @extends {SpeechBlocks.Where}
 * @constructor
 */
SpeechBlocks.Successor = function(predecessorBlockId) {
  /** @private @const */
  this.predecessorBlockId_ = predecessorBlockId;
};

/**
 * Connects the given block to the "next connection" of the predecessor block.
 * Throws an exception if the given block or the predecessor block do not exist,
 * or if the connection is incompatible.
 * @override
 */
SpeechBlocks.Successor.prototype.place = function(blockId, workspace) {
  var block = workspace.getBlockById(blockId);
  if (!block) {
    throw 'No such block: ' + blockId;
  } 

  var predecessorBlock = workspace.getBlockById(this.predecessorBlockId_);
  if (!predecessorBlock) {
    throw 'No such block: ' + this.predecessorBlockId_;
  } 

  if (!block.previousConnection || !predecessorBlock.nextConnection) {
   throw 'Cannot connect ' + blockId + ' as successor of ' + this.predecessorBlockId_; 
  }

  predecessorBlock.nextConnection.connect(block.previousConnection); 
};
