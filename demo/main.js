/** 
 * @fileoverview This is just a bunch of testing/demo nonsense. 
 * @author ehernandez4@wisc.edu (Evan Hernandez)
 */
'use strict';
var controller = new SpeechBlocks.Controller('blocklyDiv', 
    {media: '../external/blockly/media/',
     toolbox: document.getElementById('toolbox')}); 

// Provide easy access to error message.
var setErrorMessage = function(content) {
  document.getElementById('errorMessage').textContent = content;
}

// Create handlers for adding new blocks.
var newBlockIdInput = document.getElementById('newBlockId');
var newBlockTypeInput = document.getElementById('newBlockType');
var newBlockButton = document.getElementById('createNewBlock');

newBlockButton.addEventListener('click', function() {
  if (!newBlockIdInput.getAttribute('value')) {
    setErrorMessage('Please provide an ID!');
    return;
  }
  errorM
});