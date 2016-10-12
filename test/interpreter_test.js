goog.require('SpeechBlocks.Workspace')
goog.require('SpeechBlocks.Controller');
goog.require('SpeechBlocks.Interpreter');

'use strict';
var workspace = new Blockly.Workspace();
var controller = new SpeechBlocks.Controller(workspace);
var interpreter = new SpeechBlocks.Interpreter(controller);


QUnit.test("Add block inside of another block test", function(assert) {
    command = {
        'action': "add",
        'type': 'repeat'
    }
    interpreter.interpret(command);
    assert.ok(interpreter.controller_.workspace_.getBlockById(1), "Passed");
});
