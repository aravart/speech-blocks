/**
 * @fileoverview Represents the "predecessor" connection point of a block.
 * @author ehernandez4@wisc.edu (Evan Hernandez)
 */
'use strict';

goog.provide('SpeechBlocks.Predecessor');

/**
 * @param {string} successorBlockId The ID of the successor block. 
 * @extends {SpeechBlocks.Where}
 * @constructor
 */
SpeechBlocks.Predecessor = function(successorBlockId) {
  /** @private @const */
  this.successorBlockId_ = successorBlockId;
};

/**
 * Connects the given block to the "previous connection" of the successor block.
 * Throws an exception if the given block or the successor block do not exist,
 * or if the connection is incompatible.
 * @override
 */
SpeechBlocks.Predecessor.prototype.place = function(blockId, workspace) {
  var block = workspace.getBlockById(blockId);
  if (!block) {
    throw 'No such block: ' + blockId;
  } 

  var successorBlock = workspace.getBlockById(this.successorBlockId_);
  if (!successorBlock) {
    throw 'No such block: ' + this.successorBlockId_;
  } 

  if (!block.nextConnection || !successorBlock.previousConnection) {
   throw 'Cannot connect ' + blockId + ' as successor of ' + this.successorBlockId_; 
  }

  successorBlock.previousConnection.connect(block.nextConnection); 
};
