/**
 * @fileoverview Enumeration for field types and utilities.
 * @author ehernandez4@wisc.edu (Evan Hernandez)
 */
'use strict';

goog.provide('SpeechBlocks.FieldTypes');

goog.require('Blockly.Field');
goog.require('Blockly.FieldTextInput');
goog.require('Blockly.FieldNumber');
goog.require('Blockly.FieldDropdown');
goog.require('Blockly.FieldDate');
goog.require('Blockly.FieldAngle');
goog.require('Blockly.FieldColour');
goog.require('Blockly.FieldVariable');

/**
 * Enum for text input FieldTypes.
 * @public @const
 */
SpeechBlocks.FieldTypes.TEXT_INPUT = 1;

/**
 * Enum for number input FieldTypes.
 * @public @const
 */
SpeechBlocks.FieldTypes.NUMBER_INPUT = 2;

/**
 * Enum for date picker FieldTypes.
 * @public @const
 */
SpeechBlocks.FieldTypes.DATE_PICKER = 3;

/**
 * Enum for angle picker FieldTypes.
 * @public @const
 */
SpeechBlocks.FieldTypes.ANGLE_PICKER = 4;

/**
 * Enum for color picker FieldTypes.
 * @public @const
 */
SpeechBlocks.FieldTypes.COLOUR_PICKER = 5;

/**
 * Enum for variable picker FieldTypes.
 * @public @const
 */
SpeechBlocks.FieldTypes.VARIABLE_PICKER = 6;

/**
 * Enum for drop-down FieldTypes.
 * Note: Technically, variable pickers ARE drop-down fields.
 * Prefer specificity where possible.
 * @public @const
 */
SpeechBlocks.FieldTypes.DROP_DOWN = 7;

/**
 * Enum for an irrelevant field type.
 * @public @const
 */
SpeechBlocks.FieldTypes.IRRELEVANT = 8;

/**
 * Returns the corresponding type enum for the given field.
 * @param {!Blockly.Field} field Field to get type for.
 * @return {number} Enum value for field type.
 * @public
 */
SpeechBlocks.FieldTypes.getFieldType = function(field) {
  if (field instanceof Blockly.FieldTextInput) {
    return SpeechBlocks.FieldTypes.TEXT_INPUT;
  } else if (field instanceof Blockly.FieldNumber) {
    return SpeechBlocks.FieldTypes.NUMBER_INPUT;
  } else if (field instanceof Blockly.FieldAngle) {
    return SpeechBlocks.FieldTypes.ANGLE_PICKER;
  } else if (field instanceof Blockly.FieldColour) {
    return SpeechBlocks.FieldTypes.COLOUR_PICKER;
  } else if (field instanceof Blockly.FieldVariable) {
    return SpeechBlocks.FieldTypes.VARIABLE_PICKER;
  } else if (field instanceof Blockly.FieldDropdown) {
    return SpeechBlocks.FieldTypes.DROP_DOWN;
  } else {
    return SpeechBlocks.FieldTypes.IRRELEVANT;
  }
};
