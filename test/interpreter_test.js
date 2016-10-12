goog.require('SpeechBlocks.Workspace')
goog.require('SpeechBlocks.Controller');
goog.require('SpeechBlocks.Interpreter');

'use strict';
var workspace = new Blockly.Workspace();
var controller = new SpeechBlocks.Controller(workspace);
var interpreter = new SpeechBlocks.Interpreter(controller);


QUnit.test('Add block test', function(assert) {
    var pre_exist = interpreter.controller_.workspace_.getBlockById(1);
    command = {
        'action': 'add',
        'type': 'if'
    }
    interpreter.interpret(command);
    var post_exist = interpreter.controller_.workspace_.getBlockById(1);
    assert.ok(!pre_exist && post_exist, 'Block successfully added to workspace');
});
