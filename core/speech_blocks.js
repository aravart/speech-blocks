'use strict';
var workspaceController = new SpeechBlocks.WorkspaceController('blocklyDiv', 
    {media: 'external/blockly/media/',
     toolbox: document.getElementById('toolbox')}); 
document.getElementById('add').addEventListener('click', function() {
  workspaceController.addNewTopBlock('controls_if', '123');
});
document.getElementById('moveLeft').addEventListener('click', function() {
  workspaceController.moveBlock('123', -10, 0);
});
document.getElementById('moveRight').addEventListener('click', function() {
  workspaceController.moveBlock('123', 10, 0);
});
document.getElementById('moveUp').addEventListener('click', function() {
  workspaceController.moveBlock('123', 0, -10);
});
document.getElementById('moveDown').addEventListener('click', function() {
  workspaceController.moveBlock('123', 0, 10);
});
document.getElementById('remove').addEventListener('click', function() {
  workspaceController.removeBlock('123');
});
