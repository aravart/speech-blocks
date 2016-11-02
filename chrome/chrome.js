/**
* @fileoverview Loads the scripts and sets up the container div for the microphone.
* @author ehernandez4@wisc.edu (Evan Hernandez)
* @author david.liang@wisc.edu (David Liang)
*/
'use strict';

(function() {
   if (sessionStorage.length == 0) {
      sessionStorage.setItem('debug', 1);
      window.location.reload();
   }

   window.addEventListener('load', function (event) {
      setTimeout(function () {
         var container = document.createElement('div');
         container.setAttribute('class', 'container');

         var row = document.createElement('div');
         row.setAttribute('class', 'row form-inline');
         container.appendChild(row);

         var col = document.createElement('div');
         col.setAttribute('class', 'col-md-12');
         row.appendChild(col);

         var img = document.createElement('img');
         img.setAttribute('id', 'microphone');
         img.setAttribute('style', 'width: 5.5%;');
         img.setAttribute('src',
         'https://www.google.com/intl/en/chrome/assets/common/images/content/mic.gif'
      );

      var input = document.createElement('input');
      input.setAttribute('id', 'q');
      input.setAttribute('style', 'width: 94%;');
      input.setAttribute('class', 'form-control');
      input.setAttribute('type', 'text');
      input.setAttribute('name', 'q');
      input.setAttribute('placeholder', 'Speak');

      col.appendChild(img);
      col.appendChild(input);

      var row2 = document.createElement('div');
      row2.setAttribute('class', 'row');
      container.appendChild(row2);

      var col2 = document.createElement('div');
      col2.setAttribute('class', 'col-md-12');
      row2.appendChild(col2);

      var parse = document.createElement('div');
      parse.setAttribute('class', 'message disabled');
      parse.setAttribute('id', 'parse-message');
      col2.appendChild(parse);

      var row3 = document.createElement('div');
      row3.setAttribute('class', 'row form-inline');
      container.appendChild(row3);

      var col3 = document.createElement('div');
      col3.setAttribute('class', 'col-md-12');
      row3.appendChild(col3);

      var pre = document.createElement('pre');
      pre.setAttribute('class', 'disabled');
      pre.setAttribute('id', 'output');
      pre.innerText = 'Record some speech or type some text to display parser results.';

      var jquery = document.createElement('script');
      jquery.src = '//code.jquery.com/jquery-2.1.4.min.js';
      document.head.appendChild(jquery);

      [
         'speech-blocks/core/blocks.js',
         'speech-blocks/core/field_types.js',
         'speech-blocks/core/where.js',
         'speech-blocks/core/translation.js',
         'speech-blocks/core/statement_input.js',
         'speech-blocks/core/value_input.js',
         'speech-blocks/core/successor.js',
         'speech-blocks/core/predecessor.js',
         'speech-blocks/core/controller.js',
         'speech-blocks/core/interpreter.js',
         'speech-blocks/grammar/grammar.js',
         'speech-blocks/external/jsDump.js'
      ].forEach(function (src) {
         var scriptTag = document.createElement('script');
         scriptTag.src = chrome.extension.getURL(src);
         document.head.appendChild(scriptTag);
      });

      setTimeout(function () {
         var bootstrap = document.createElement('script');
         bootstrap.src = '//maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js';
         document.head.appendChild(bootstrap);

         var init = document.createElement('script');
         init.src = chrome.extension.getURL('init.js');
         document.body.appendChild(init);
      }, 100);

      var PADDING = 150; // 150 pixels of padding for the text that comes up under the speech input box
      container.style.height = PADDING + 'px';
      toolbox.parentNode.insertBefore(container, document.getElementById('dialog').parentNode.childNodes[0]);

      var blocklyTopOffset = document.getElementById('blockly').style.top
      blocklyTopOffset = parseInt(blocklyTopOffset.substring(0,blocklyTopOffset.length-2)) + PADDING;
      document.getElementById('blockly').style.top = blocklyTopOffset + 'px';

      var nodes = toolbox.parentNode.children;
      var toolboxTopOffset;
      for (var i = 0; i < nodes.length; i++) {
         if (nodes[i].className == 'blocklyToolboxDiv') {
            toolboxTopOffset = nodes[i].style.top;
            toolboxTopOffset = parseInt(toolboxTopOffset.substring(0,toolboxTopOffset.length-2)) + PADDING;
            nodes[i].style.top = toolboxTopOffset + 'px';
            break;
         }
      }

   }, 100)});
})();
