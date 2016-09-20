/** 
 * @fileoverview This is just a bunch of testing/demo nonsense. 
 * @author ehernandez4@wisc.edu (Evan Hernandez)
 */
'use strict';
var workspaceController = new SpeechBlocks.WorkspaceController('blocklyDiv', 
    {media: 'external/blockly/media/',
     toolbox: document.getElementById('toolbox')});
 
document.getElementById('addIfSingleton').addEventListener('click', function() {
  var where = new SpeechBlocks.TopLevelPosition(new goog.math.Coordinate(10, -10));
  workspaceController.add('controls_if', 'if_id', where);
});
document.getElementById('addAnotherIfSingleton').addEventListener('click', function() {
  var where = new SpeechBlocks.TopLevelPosition(new goog.math.Coordinate(10, -10));
  workspaceController.add('controls_if', 'if_id2', where);
});
document.getElementById('addLogicalSingleton').addEventListener('click', function() {
  var where = new SpeechBlocks.TopLevelPosition(new goog.math.Coordinate(10, -10));
  workspaceController.add('logic_compare', 'logical_id', where);
});

var statementNumber = 0;
document.getElementById('addPrintSingleton').addEventListener('click', function() {
  var where = statementNumber == 0 ? 
      new SpeechBlocks.TopLevelPosition(new goog.math.Coordinate(10, -10))
      : new SpeechBlocks.Successor('print_id' + statementNumber);
  workspaceController.add('text_print', 'print_id' + (++statementNumber), where);
});

document.getElementById('addStatementInput').addEventListener('click', function() {
  var where = new SpeechBlocks.StatementInput('if_id', 'DO0');
  workspaceController.move('print_id1', where);
});
document.getElementById('moveSecondIfBeforeFirstPrint').addEventListener('click', function() {
  var beforeFirstPrintStatement = new SpeechBlocks.StatementInput('if_id', 'DO0');
  workspaceController.move('if_id2', beforeFirstPrintStatement);
});
document.getElementById('addValueInput').addEventListener("click", function() {
  var where = new SpeechBlocks.ValueInput('if_id', 'IF0');
  workspaceController.move('logical_id', where);
});
