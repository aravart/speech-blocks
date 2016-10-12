goog.require('SpeechBlocks.Interpreter');

'use strict';

QUnit.test('Add test', function(assert) {

    var controller = {
        addBlock: function(type, blockId, where) {
            assert.ok(where instanceof SpeechBlocks.Translation,'pass: where');
            assert.ok(type == 'controls_if', 'pass: type');
        }
    }

    var command = {
        'action': 'add',
        'type': 'if'
    }

    var interpreter = new SpeechBlocks.Interpreter(controller);
    interpreter.interpret(command);
});
