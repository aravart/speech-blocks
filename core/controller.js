/**
 * @fileoverview High-level view of a Blockly Workspace that allows
 * for programmatically adding, moving, and deleting blocks. Does NOT
 * provide error checking.
 * @author ehernandez4@wisc.edu (Evan Hernandez)
 */
'use strict';

goog.provide('SpeechBlocks.Controller');

goog.require('Blockly.Field');
goog.require('Blockly.FieldColour');
goog.require('Blockly.Workspace');
goog.require('Blockly.constants');
goog.require('Blockly.inject');
goog.require('SpeechBlocks.Blocks');
goog.require('SpeechBlocks.FieldTypes');
goog.require('goog.structs.Map');
goog.require('goog.structs.Set');

/**
 * Inject a Blockly workspace into the given container element.
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
  this.moveBlock(blockId, where);
};

/**
 * Moves the block with the given ID. All child blocks are moved as well.
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
  var block = SpeechBlocks.Blocks.getBlock(blockId, this.workspace_);
  block.unplug(true /* Heal the stack! */);
  block.dispose();
};

/**
 * Undos the last action.
 * @public
 */
SpeechBlocks.Controller.prototype.undo = function() { this.workspace_.undo(false); };

/**
 * Redos the last undo.
 * @public
 */
SpeechBlocks.Controller.prototype.redo = function() { this.workspace_.undo(true); };

/**
 * Returns the set of IDs for all blocks in the workspace.
 * @return {!goog.structs.Set<string>} The array of all IDs.
 * @public
 */
SpeechBlocks.Controller.prototype.getAllBlockIds = function() {
  var blockIds = new goog.structs.Set();
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
  return !goog.isNull(
      SpeechBlocks.Blocks.getBlock(blockId, this.workspace_).nextConnection);
};

/**
 * Checks whether the block with the given ID has a "previous block" connection.
 * @param {string} blockId ID of the block.
 * @return {boolean} True if block has previous connection, false otherwise.
 * @public
 */
SpeechBlocks.Controller.prototype.hasPreviousConnection = function(blockId) {
  return !goog.isNull(
      SpeechBlocks.Blocks.getBlock(blockId, this.workspace_).previousConnection);
};

/**
 * Checks whether the block with the given ID has a value output connection.
 * @param {string} blockId ID of the block.
 * @return {boolean} True if block has output connection, false otherwise.
 * @public
 */
SpeechBlocks.Controller.prototype.hasOutputConnection = function(blockId) {
  return !goog.isNull(
      SpeechBlocks.Blocks.getBlock(blockId, this.workspace_).outputConnection);
};

/**
 * Returns the list of value input labels for this block.
 * Returns a list of value input labels for the block.
 * @param {string} blockId ID of the block.
 * @return {!Array<string>} List of value input labels for this block.
 * @public
 */
SpeechBlocks.Controller.prototype.getBlockValueInputs = function(blockId) {
  return this.getBlockXInputs_(blockId, Blockly.INPUT_VALUE);
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
 * @return {!Array<string>} Array of input labels of the given type.
 * @private
 */
SpeechBlocks.Controller.prototype.getBlockXInputs_ = function (blockId, type) {
  var inputLabels = [];
  SpeechBlocks.Blocks.getBlock(blockId, this.workspace_).inputList.forEach(function(input) {
    if (input.type == type) { inputLabels.push(input.name); }
  });
  return inputLabels;
};

/**
 * Returns a mapping from field names to field types for the given block. 
 * Note that all field types are enumerated in SpeechBlocks.FieldTypes.
 * @param {string} blockId The ID of the block.
 * @return {!goog.structs.Map<string, number>} A mapping of field names to field types.
 * @public
 */
SpeechBlocks.Controller.prototype.getFieldsForBlock = function(blockId) {
  var blockFields = new goog.structs.Map();
  SpeechBlocks.Blocks.getBlock(blockId, this.workspace_).inputList.forEach(function(input) {
    input.fieldRow.forEach(function(field) {
      var type = SpeechBlocks.FieldTypes.getFieldType(field);
      if (field.name && type != SpeechBlocks.FieldTypes.IRRELEVANT) {
        blockFields.set(field.name, type);
      }
    });
  });
  return blockFields;
};

/**
 * Sets the field with the given name to the given value.
 * 
 * Formatting of the value is very important:
 * 
 * _______________________________________
 * FIELD TYPE         | VALUE FORMAT
 * ___________________|___________________
 * Text Input         | '*' (any text)
 * Number Input       | '[0-9]+' (any number)
 * Drop-Down          | existing drop-down value
 * Date Picker        | 'yyyy-mm-dd'
 * Angle Picker       | 'x' where 0 <= x <= 360
 * Colour Picker      | '#HHH' where H is a hex digit
 * Variable Picker    | existing variable name
 * 
 * @param {string} blockId ID of the block.
 * @param {string} fieldName Name of the field.
 * @param {string} fieldValue New value for the field.
 * @public
 */
SpeechBlocks.Controller.prototype.setBlockField = function(blockId, fieldName, fieldValue) {
  SpeechBlocks.Blocks.getBlock(blockId, this.workspace_).setFieldValue(fieldValue, fieldName);
};