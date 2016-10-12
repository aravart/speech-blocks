goog.require('SpeechBlocks.Workspace')
goog.require('SpeechBlocks.Controller');
goog.require('SpeechBlocks.Interpreter');

'use strict';
var workspace = new Blockly.Workspace();
var controller = new SpeechBlocks.Controller(workspace);
var interpreter = new SpeechBlocks.Interpreter(controller);


QUnit.test('Add block test', function(assert) {
    var pre_exist = interpreter.controller_.workspace_.getBlockById(1);
    var command = {
        'action': 'add',
        'type': 'if'
    }
    interpreter.interpret(command);
    var post_exist = interpreter.controller_.workspace_.getBlockById(1);
    assert.ok(!pre_exist && post_exist, 'Block 1 successfully added to workspace');

    var pre_exist = interpreter.controller_.workspace_.getBlockById(2);
    var command = {
        'action': 'add',
        'type': 'repeat'
    }
    interpreter.interpret(command);
    var post_exist = interpreter.controller_.workspace_.getBlockById(2);
    assert.ok(!pre_exist && post_exist, 'Block 2 successfully added to workspace');


});
