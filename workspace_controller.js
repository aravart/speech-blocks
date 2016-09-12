/**
 * @fileoverview High-level view of a Blockly Workspace that
 * allows for programmatically adding, moving, and deleting blocks. 
 * @author ehernandez4@wisc.edu (Evan Hernandez)
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
 * @param {string} prototypeName Name of the language object containing
 *     type-specific functions for this block.
 * @param {string} id ID for the block.
 * @public
 */
SpeechBlocks.WorkspaceController.prototype.addNewTopBlock = function(prototypeName, id) {
  var newBlock = this.workspace_.newBlock(prototypeName, id);
  newBlock.initSvg();
  newBlock.render();
};

/**
 * Moves the top block with the given ID. 
 * @param {string} id ID of the block to move.
 * @param {number} dx Change in x position.
 * @param {number} dy Change in y position.
 * @public
 */
SpeechBlocks.WorkspaceController.prototype.moveBlock = function(id, dx, dy) {
  // TODO(evanfredhernandez): Does this work for all kinds of blocks? Tops and children? 
  // Also, how to handle case where block is not found?
  var block = this.workspace_.getBlockById(id);
  if (block) {
    block.moveBy(dx, dy);
    block.render();
  }
};

/**
 * Removes the block with the given ID from the workspace, along with its children.
 * @param {string} id ID of the block to remove.
 * @public
 */
SpeechBlocks.WorkspaceController.prototype.removeBlock = function(id) {
  var block = this.workspace_.getBlockById(id);
  if (block) {
    // TODO(evanfredhernandez): Is this enough?
    block.dispose();
  }
  // TODO(evanfredhernandez): How to handle case where block is not found? Include a "hasBlock" function?
};
