/** 
 * @fileoverview A hasty script for allowing manual block manipulation. 
 * @author ehernandez4@wisc.edu (Evan Hernandez)
 */
'use strict';

var controller = new SpeechBlocks.Controller('blocklyDiv', 
    {media: '../external/blockly/media/',
     toolbox: document.getElementById('toolbox')}); 

// "New block" input elements.
var newBlockIdInput = document.getElementById('newBlockId');
var newBlockTypeInput = document.getElementById('newBlockType');
var newBlockButton = document.getElementById('createNewBlock');

// "Move block" input elements.
var moveBlockIdInput = document.getElementById('moveWhat');
var moveBlockWhereInput = document.getElementById('moveWhere');

var moveBlockTranslationDiv = document.getElementById('moveWhereTranslationDiv');
var moveBlockTranslationInput = document.getElementById('moveWhereTranslationTarget');

var moveBlockTargetBlockDiv = document.getElementById('moveWhereBlockTargetDiv');
var moveBlockTargetBlockInput = document.getElementById('moveWhereBlockTarget');

var moveBlockTargetInputDiv = document.getElementById('moveWhereBlockInputTargetDiv');
var moveBlockTargetInputInput = document.getElementById('moveWhereBlockInputTarget');

var moveBlockButton = document.getElementById('moveBlock');

// "Remove block" input elements.
var removeBlockIdInput = document.getElementById('removeWhat');
var removeBlockButton = document.getElementById('removeBlock');

// Provide easy access to error message.
var setErrorMessage = function(content) {
  document.getElementById('errorMessage').textContent = content;
}
var resetErrorMessage = function() { setErrorMessage(''); };

// Provide easy way to update IDs.
var moveTag = '__m';
var targetTag = '__t';
var removeTag = '__r';

var addId = function(id) {
  var moveBlockIdOption = document.createElement('option');
  moveBlockIdOption.text = moveBlockIdOption.value = id;
  moveBlockIdOption.id = id + moveTag;
  moveBlockIdInput.add(moveBlockIdOption);

  // Regardless of whether this is displayed, add the new option.
  var moveBlockTargetIdOption = moveBlockIdOption.cloneNode(true);
  moveBlockTargetIdOption.id = id + targetTag;
  moveBlockTargetBlockInput.add(moveBlockTargetIdOption);

  var removeBlockIdOption = moveBlockIdOption.cloneNode(true);
  removeBlockIdOption.id = id + removeTag;
  removeBlockIdInput.add(removeBlockIdOption);
};

var removeId = function(id) {
  var moveIdElement = document.getElementById(id + moveTag);
  moveIdElement.parentNode.removeChild(moveIdElement);
  moveBlockIdInput.value = '';
  
  var moveTargetIdElement = document.getElementById(id + targetTag);
  moveTargetIdElement.parentNode.removeChild(moveTargetIdElement);
  var text = '';
  if(moveBlockTargetBlockInput.hasChildNodes()) {
    text = moveBlockTargetBlockInput.children[0];
  }
  moveBlockTargetBlockInput.value = text;

  var removeIdElement = document.getElementById(id + removeTag);
  removeIdElement.parentNode.removeChild(removeIdElement);
  removeBlockIdInput.value = '';
}

// Create handlers for adding new blocks.
newBlockButton.addEventListener('click', function() {
  resetErrorMessage();
  var id = newBlockIdInput.value;
  if (!id) {
    setErrorMessage('Please provide an ID!');
    return;
  } else if (controller.getAllBlockIds().contains(id)) {
    setErrorMessage('This ID already exists!');
    return;
  }
  var type = newBlockTypeInput.options[newBlockTypeInput.selectedIndex].value;
  controller.addBlock(type, id, new SpeechBlocks.Translation(0, 0));
  addId(id);
  newBlockIdInput.value = '';
});

// Create handlers for moving blocks.
var hideAllInputs = function() {
  moveBlockTranslationDiv.style.display = 'none';
  moveBlockTargetBlockDiv.style.display = 'none';
  moveBlockTargetInputDiv.style.display = 'none';
};

var showTranslationInputs = function() {
  moveBlockTranslationDiv.style.display = 'block';
};

var isTargetBlock = function() {
  return !!moveBlockTargetBlockInput.value;
};

var isTargetInput = function() {
  return !!moveBlockTargetInputInput.value;
};

var showPredecessorTargets = function() {
  moveBlockTargetBlockInput.options.length = 0;
  controller.getAllBlockIds().getValues().forEach(function(id) { 
    if (controller.hasPreviousConnection(id) && moveBlockIdInput.value != id) {
      var targetBlockIdOption = document.createElement('option');
      targetBlockIdOption.text = targetIdOption.value = id;
      targetBlockIdOption.id = id + targetTag;
      moveBlockTargetBlockInput.appendChild(targetBlockIdOption);
    }
  });
  moveBlockTargetBlockDiv.style.display = 'block';
};

var showSuccessorTargets = function() {
  moveBlockTargetBlockInput.options.length = 0;
  controller.getAllBlockIds().getValues().forEach(function(id) { 
    if (controller.hasNextConnection(id) && moveBlockIdInput.value != id) {
      var targetBlockIdOption = document.createElement('option');
      targetBlockIdOption.text = targetIdOption.value = id;
      targetBlockIdOption.id = id + targetTag;
      moveBlockTargetBlockInput.appendChild(targetBlockIdOption);
    }
  });
  moveBlockTargetBlockDiv.style.display = 'block';
};

var showValueInputTargets = function() {
  if (!moveBlockTargetBlockInput.value) {
    return;
  }
  controller.getValueInputs(moveBlockTargetBlockInput.value).forEach(function(label) {
    var targetBlockInputOption = document.createElement('option');
    targetBlockInputOption.text = targetBlockInputOption.value = targetBlockInputOption.id = label;
  });
  moveBlockTargetBlockDiv.style.display = 'block';
  moveBlockTargetInputDiv.style.display = 'block';
};

var showStatementInputTargets = function() {
  if (!moveBlockTargetBlockInput.value) {
    return;
  }
  controller.getStatementInputs(moveBlockTargetBlockInput.value).forEach(function(label) {
    var targetBlockInputOption = document.createElement('option');
    targetBlockInputOption.text = targetBlockInputOption.value = targetBlockInputOption.id = label;
  });
  moveBlockTargetBlockDiv.style.display = 'block';
  moveBlockTargetInputDiv.style.display = 'block';
};

moveBlockWhereInput.addEventListener('change', function() {
  resetErrorMessage();
  hideAllInputs();
  switch (moveBlockWhereInput.value) {
    case 'translation': showTranslationInputs(); break;
    case 'predecessor': showPredecessorTargets(); break;
    case 'successor': showSuccessorTargets(); break;
    case 'value_input': showValueInputTargets(); break;
    case 'statement_input': showStatementInputTargets(); break;
    default: setErrorMessage('An error occurred (should never happen)!');
  }
});

moveBlockButton.addEventListener('click', function() {
  resetErrorMessage();
  var targetBlockId = moveBlockIdInput.value;
  if (!targetBlockId) {
    return;
  }
  switch (moveBlockWhereInput.value) {
    case 'translation': 
      var dx, dy = 0;
      switch (moveBlockTranslationInput.value) {
        case 'up': dy = -75;
        case 'down': dy = 75;
        case 'left': dx = 150;
        case 'right': dy = -150;
        default: setErrorMessage('An error occurred (should never happen)!');
      }
      controller.moveBlock(targetBlockId, new SpeechBlocks.Translation(dx, dy));
      break;
    case 'predecessor': 
      if (!isTargetBlock()) {
        return;
      }
      controller.moveBlock(
          targetBlockId,
          new SpeechBlocks.Predecessor(moveBlockTargetBlockInput.value));
      break;
    case 'successor': 
      if (!isTargetBlock()) {
        return;
      }
      controller.moveBlock(
          targetBlockId,
          new SpeechBlocks.Successor(moveBlockTargetBlockInput.value));
      break;
    case 'statement_input':
      if (!isTargetBlock() || !isTargetInput()) {
        return;
      }
      controller.moveBlock(
        targetBlockId,
        new SpeechBlocks.StatementInput(
            moveBlockTargetBlockInput.value,
            moveBlockTargetInputInput.value)
      );
      break;
    case 'value_input':
      if (!isTargetBlock() || !isTargetInput()) {
        return;
      }
      controller.moveBlock(
        targetBlockId,
        new SpeechBlocks.ValueInput(
            moveBlockTargetBlockInput.value,
            moveBlockTargetInputInput.value)
      );
      break;
    default: setErrorMessage('An error occurred (should never happen)!');
  }
  hideAllInputs();
});

// Create handlers for removing blocks.
removeBlockButton.addEventListener('click', function() {
  resetErrorMessage();
  var id = removeBlockIdInput.value;
  if (!id) {
    setErrorMessage('There are no blocks to remove!');
    return;
  }
  controller.removeBlock(id);
  removeId(id);
});