/** 
 * @fileoverview Represents an xy location on the workspace
 * where a block can exist as a singleton.
 * @author ehernandez4@wisc.edu (Evan Hernandez)  
 */
'use strict'

goog.provide('SpeechBlocks.TopLevelPosition');

goog.require('goog.math.Coordinate');

/**
 * @param {goog.math.Coordinate} xy Top-level position as xy coordinates.
 * @extends {SpeechBlocks.Where}
 * @constructor
 */
SpeechBlocks.TopLevelPosition = function(xy) { 
  /** @private @const */
  this.xy_ = xy;
};

/**
 * Places the block with the given ID at the top-level position. Throws an exception
 * if there are move conflicts (e.g., the block would be moved off the workspace). 
 * @override 
 */
SpeechBlocks.TopLevelPosition.prototype.place = function(blockId, workspace) {
  // TODO(evanfredhernandez): Implement this method.
};
