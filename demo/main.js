/** 
 * @fileoverview Initialize the demo. 
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
var resetErrorMessage = function() { setErrorMessage(''); };

// Provide easy access to input elements.
var newBlockIdInput = document.getElementById('newBlockId');
var newBlockTypeInput = document.getElementById('newBlockType');
var newBlockButton = document.getElementById('createNewBlock');

var moveBlockIdInput = document.getElementById('moveWhat');
var moveBlockLocationInput = document.getElementById('moveWhere');
var moveBlockButton = document.getElementById('moveBlock');

var removeBlockIdInput = document.getElementById('removeWhat');
var removeBlockButton = document.getElementById('removeBlock');

// Provide easy way to update IDs.
var addId = function(id) {
  var newIdOption = document.createElement('option');
  newIdOption.text = newIdOption.value = id;
  moveBlockIdInput.add(newIdOption);
  removeBlockIdInput.add(newIdOption.cloneNode(true));
};

var removeId = function(id) {
  // TODO(evanfredhernandez): Implement this function.
}

// Create handlers for adding new blocks.
newBlockButton.addEventListener('click', function() {
  resetErrorMessage();
  var id = newBlockIdInput.value;
  if (!id) {
    setErrorMessage('Please provide an ID!');
    return;
  }
  var type = newBlockTypeInput.options[newBlockTypeInput.selectedIndex].value;
  controller.addBlock(type, id, new SpeechBlocks.Translation(0, 0));
  addId(id);
});