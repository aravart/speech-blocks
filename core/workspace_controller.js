/**
 * @fileoverview High-level view of a Blockly Workspace that
 * allows for programmatically adding, moving, and deleting blocks. 
 * @author ehernandez4@wisc.edu (Evan Henrnandez)  
 */
'use strict';

goog.provide('SpeechBlocks.WorkspaceController');

goog.require('Blockly.Workspace');

/**
 * Inject a Blockly workspace into the given container element
 * @param {!Element|string} container Containing element, or its ID, or a CSS selector.
 * @param {Object=} opt_options Optional dictionary of options.
 * @constructor
 */
SpeechBlocks.WorkspaceController = function(container, opt_options) {
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
SpeechBlocks.WorkspaceController.prototype.add = function(type, blockId, where) {
  var newBlock = this.workspace_.newBlock(type, blockId);
  newBlock.initSvg();
  this.move(blockId, where);
};

/**
 * Moves the top block with the given ID. 
 * @param {string} blockId ID of the block to move.
 * @param {!SpeechBlocks.Where} where Location on the workspace
 *    to place the new block.
 * @public
 */
SpeechBlocks.WorkspaceController.prototype.move = function(blockId, where) {
  where.place(blockId, this.workspace_);
  this.workspace_.render();
  /*
  try {
    where.place(blockId, this.workspace_);
    this.workspace_.render();
  } catch (e) {
    // TODO(evanfredhernandez): We probably don't want this to be an alert popup.
    alert(e.message);
  }
  */
};

/**
 * Removes the block with the given ID from the workspace, along with its children.
 * @param {string} blockId ID of the block to remove.
 * @public
 */
SpeechBlocks.WorkspaceController.prototype.removeBlock = function(blockId) {
  var block = this.workspace_.getBlockById(blockId);  
  // TODO: Move to trash.
};
