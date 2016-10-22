if (sessionStorage.length == 0) {
    sessionStorage.setItem('debug', 1);
    window.location.reload();
}

window.addEventListener("load", function(event) {
    console.log("loading...");
    initialize();
});

initialize = function() {
    console.log("INIT");
    setTimeout(function() {
        var setClass = function(el, clazz) {
            el.setAttribute('class', clazz);
        };

        var container = document.createElement('div');
        setClass(container, 'container');

        // mic
        var row = document.createElement('div');
        setClass(row, 'row form-inline');
        container.appendChild(row);

        var col = document.createElement('div');
        setClass(col, 'col-md-12');
        row.appendChild(col);

        var img = document.createElement('img');
        img.setAttribute('id', 'microphone');
        img.setAttribute('style', 'width: 5.5%;');
        img.setAttribute('src', 'https://www.google.com/intl/en/chrome/assets/common/images/content/mic.gif');

        var input = document.createElement('input');
        input.setAttribute('id', 'q');
        input.setAttribute('style', 'width: 94%;');
        input.setAttribute('class', 'form-control');
        input.setAttribute('type', 'text');
        input.setAttribute('name', 'q');
        input.setAttribute('placeholder', 'Speak');

        col.appendChild(img);
        col.appendChild(input);

        // parse message
        var row2 = document.createElement('div');
        setClass(row2, 'row');
        container.appendChild(row2);

        var col2 = document.createElement('div');
        setClass(col2, 'col-md-12');
        row2.appendChild(col2);

        var parse = document.createElement('div');
        setClass(parse, 'message disabled');
        parse.setAttribute('id','parse-message');
        col2.appendChild(parse);

        var row3 = document.createElement('div');
        setClass(row3, 'row form-inline');
        container.appendChild(row3);

        var col3 = document.createElement('div');
        setClass(col3, 'col-md-12');
        row3.appendChild(col3);

        var pre = document.createElement('pre');
        setClass(pre, 'disabled');
        pre.setAttribute('id', 'output');
        pre.innerText = 'Record some speech or type some text to display parser results.';

        // document.body.appendChild(container);
        toolbox.parentNode.insertBefore(container, dialog.parentNode.childNodes[0]);
        document.getElementById('blockly').style.top = '250px'
        nodes = toolbox.parentNode.children;
        var toolboxdiv;
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].className == 'blocklyToolboxDiv') {
                console.log(i);
                toolboxdiv = nodes[i];
                i = nodes.length;
            }
        }
        toolboxdiv.style.top = '250px';

        //SCRIPT STUFF
        var base = document.createElement('script');
        base.src = chrome.extension.getURL('speech-blocks/external/closure-library/closure/goog/base.js');
        document.head.appendChild(base);

        var jquery = document.createElement('script');
        jquery.src = chrome.extension.getURL('speech-blocks/external/jquery.js');
        document.head.appendChild(jquery);

        var bootstrap = document.createElement('script');
        bootstrap.src = chrome.extension.getURL('speech-blocks/external/bootstrap-3.3.7-dist/js/bootstrap.min.js');
        document.head.appendChild(bootstrap);

        var blockly_compressed = document.createElement('script');
        blockly_compressed.src = chrome.extension.getURL('speech-blocks/external/blockly/blockly_compressed.js');
        document.head.appendChild(blockly_compressed);

        setTimeout(function() {
            var javascript_compressed = document.createElement('script');
            javascript_compressed.src = chrome.extension.getURL('speech-blocks/external/blockly/javascript_compressed.js');
            document.head.appendChild(javascript_compressed);

            var blocks_compressed = document.createElement('script');
            blocks_compressed.src = chrome.extension.getURL('speech-blocks/external/blockly/blocks_compressed.js');

            document.head.appendChild(blocks_compressed);
            var msg_compressed = document.createElement('script');
            msg_compressed.src = chrome.extension.getURL('speech-blocks/external/blockly/msg/js/en.js');
            document.head.appendChild(msg_compressed);

            [
                'speech-blocks/core/controller.js',
                'speech-blocks/core/blocks.js',
                'speech-blocks/core/field_types.js',
                'speech-blocks/core/where.js',
                'speech-blocks/core/translation.js',
                'speech-blocks/core/statement_input.js',
                'speech-blocks/core/value_input.js',
                'speech-blocks/core/successor.js',
                'speech-blocks/core/predecessor.js'
            ].forEach(function(src) {
                var scriptTag = document.createElement('script');
                scriptTag.src = chrome.extension.getURL(src);
                document.head.appendChild(scriptTag);
            });

            [
                'speech-blocks/grammar/grammar.js',
                'speech-blocks/js/jsDump.js',
                'speech-blocks/core/interpreter.js'
            ].forEach(function(src) {
                var scriptTag = document.createElement('script');
                scriptTag.src = chrome.extension.getURL(src);
                document.body.appendChild(scriptTag);
            });

            setTimeout(function() {
                var init = document.createElement('script');
                init.src = chrome.extension.getURL('chromeinit.js');
                document.body.appendChild(init);
            }, 1000);
        }, 1000);
    }, 5000);
};
