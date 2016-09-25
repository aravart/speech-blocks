/**
 * @fileoverview High-level view of a Blockly Workspace that allows 
 * for programmatically adding, moving, and deleting blocks. Does NOT
 * provide error checking.
 * @author ehernandez4@wisc.edu (Evan Hernandez)  
 */
'use strict';

goog.provide('SpeechBlocks.Controller');

goog.require('Blockly.Workspace');
goog.require('Blockly.constants');
goog.require('Blockly.inject');

/**
 * Inject a Blockly workspace into the given container element
 * @param {!Element|string} container Containing element, or its ID, or a CSS selector.
 * @param {Object=} opt_options Optional dictionary of options.
 * @constructor
 */
SpeechBlocks.Controller = function(container, opt_options) {
  /** @private @const {!Blockly.Workspace} */
  this.workspace_ = Blockly.inject('blocklyDiv', opt_options);
};

/**
 * Adds and renders a new block to the workspace.
 * @param {string} type Name of the language object containing
 *     type-specific functions for this block.
 * @param {string} blockId ID for the block.
 * @param {!SpeechBlocks.Where} where Location on the workspace
 *     to place the new block.
 * @public
 */
SpeechBlocks.Controller.prototype.addBlock = function(type, blockId, where) {
  var newBlock = this.workspace_.newBlock(type, blockId);
  newBlock.initSvg();
  this.move(blockId, where);
};

/**
 * Moves the lock with the given ID. All child blocks are moved as well.
 * @param {string} blockId ID of the block to move.
 * @param {!SpeechBlocks.Where} where Location on the workspace
 *    to place the new block.
 * @public
 */
SpeechBlocks.Controller.prototype.moveBlock = function(blockId, where) {
  where.place(blockId, this.workspace_);
  this.workspace_.render();
};

/**
 * Removes the block with the given ID from the workspace, along with its children.
 * @param {string} blockId ID of the block to remove.
 * @public
 */
SpeechBlocks.Controller.prototype.removeBlock = function(blockId) {
  var block = this.workspace_.getBlockById(blockId);  
  block.unplug(true /* Heal the stack! */);
  block.dispose();
};

/**
 * Returns the array of IDs for all blocks in the workspace.
 * @return {!Array<string>} The array of all IDs.
 * @public
 */
SpeechBlocks.Controller.prototype.getAllBlockIds = function() {
  var blockIds = [];
  this.workspace_.getAllBlocks().forEach(function(block) {
    blockIds.add(block.id);
  });
  return blockIds;
};

/** 
 * Checks whether the block with the given ID has a "next block" connection.
 * @param {string} blockId ID of the block.
 * @return {boolean} True if block has next connection, false otherwise.
 * @public
 */
SpeechBlocks.Controller.prototype.hasNextConnection = function(blockId) {
  var block = this.workspace_.getBlockById(blockId);
  return !goog.isNull(block) && !goog.isNull(block.nextConnection); 
};

/** 
 * Checks whether the block with the given ID has a "previous block" connection.
 * @param {string} blockId ID of the block.
 * @return {boolean} True if block has previous connection, false otherwise.
 * @public
 */
SpeechBlocks.Controller.prototype.hasPreviousConnection = function(blockId) {
  var block = this.workspace_.getBlockById(blockId);
  return !goog.isNull(block) && !goog.isNull(block.previousConnection); 
};

/** 
 * Checks whether the block with the given ID has a value output connection.
 * @param {string} blockId ID of the block.
 * @return {boolean} True if block has output connection, false otherwise.
 * @public
 */
SpeechBlocks.Controller.prototype.hasOutputConnection = function(blockId) {
  var block = this.workspace_.getBlockById(blockId);
  return !goog.isNull(block) && !goog.isNull(block.outputConnection); 
};

/**
 * Returns the list of value input labels for this block.
 * Returns a list of value input labels for the block.
 * @param {string} blockId ID of the block.
 * @return {!Array<string>} List of value input labels for this block.
 * @public
 */
SpeechBlocks.Controller.prototype.getBlockValueInputs = function(blockId) {
  return this.getBlockXInputs_(blockId, Blockly.VALUE_INPUT);
};

/**
 * Returns the list of statement input labels for the block.
 * @param {string} blockId ID of the block.
 * @return {!Array<string>} List of statement input labels for this block.
 * @public 
 */
SpeechBlocks.Controller.prototype.getBlockStatementInputs = function(blockId) {
  // Eventually, we might also want to include Blockly.PREVIOUS_STATEMENT
  // input types, but it's not clear where this is used. 
  return this.getBlockXInputs_(blockId, Blockly.NEXT_STATEMENT);
};

/**
 * Gets the labels for inputs of the given type from the given block.
 * @param {string} blockId ID of the block.
 * @param {number} type Input type to get.
 * @private
 */
SpeechBlocks.Controller.prototype.getBlockXInputs_ = function (blockId, type) {
  var inputLabels = [];
  this.workspace_.getBlockById(blockId).inputList.forEach(function(input) {
    if (input.type == type) { inputLabels.push(input.name); }
  });
  return inputLabels;
};
