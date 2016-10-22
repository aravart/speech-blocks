/**
* @fileoverview Initializes the microphone and parses the speech.
* @author aravart@cs.wisc.edu (Ara Vartanian)
*/
'use strict';

$(document).ready(function() {
    var dialog = document.getElementById('dialog');
    dialog.parentNode.removeChild(dialog);
    document.getElementById('dialogShadow').style.opacity = 0;
    document.getElementById('dialogShadow').style.visibility = 'hidden';
    
    var oldQ = null;
    var parseTimer = null;
    var output = null;
    var controller = new SpeechBlocks.Controller(BlocklyGames.workspace);
    var interpreter = new SpeechBlocks.Interpreter(controller);

    function startDictation() {
        if (window.hasOwnProperty('webkitSpeechRecognition')) {
            var mic_animate = 'http://www.google.com/intl/en/chrome/assets/common/images/content/mic-animate.gif';
            var mic = 'http://www.google.com/intl/en/chrome/assets/common/images/content/mic.gif';
            var recognition = new webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = "en-US";
            document.getElementById('microphone').src = mic_animate;
            recognition.onresult = function(e) {
                document.getElementById('q').value = e.results[0][0].transcript;
                recognition.stop();
                document.getElementById('microphone').src = mic;
                parseSpeech();
            };
            recognition.onerror = function(e) {
                recognition.stop();
                document.getElementById('microphone').src = mic;
            }
            recognition.start();
        }
    }

    function buildErrorMessage(e) {
        return e.location !== undefined
        ? "Line " + e.location.start.line + ", column " + e.location.start.column + ": " + e.message
        : e.message;
    }

    function parseSpeech() {
        Blockly.mainWorkspace = BlocklyGames.workspace;
        oldQ = $("#q").val();

        $("#parse-message").attr("class", "message progress").text("Parsing the input...");
        $("#output").addClass("disabled").text("Output not available.");

        try {
            output = parser.parse($("#q").val().toLowerCase());
            $("#parse-message")
            .attr("class", "message info")
            .text("Input parsed successfully.");
            $("#output").removeClass("disabled").text(jsDump.parse(output));
            interpretSpeech();
            var result = true;
        } catch (e) {
            $("#parse-message").attr("class", "message error").text(buildErrorMessage(e));
            var result = false;
        }

        return result;
    }

    function interpretSpeech() {
        if (output !== null) {
            interpreter.interpret(output);
        }
    }

    function scheduleParse() {
        if ($("#q").val() === oldQ) { return; }
        if (parseTimer !== null) {
            clearTimeout(parseTimer);
            parseTimer = null;
        }

        parseTimer = setTimeout(function() {
            parseSpeech();
            parseTimer = null;
        }, 500);
    }

    $("#q")
    .change(scheduleParse)
    .mousedown(scheduleParse)
    .mouseup(scheduleParse)
    .click(scheduleParse)
    .keydown(scheduleParse)
    .keyup(scheduleParse)
    .keypress(scheduleParse);

    $("#microphone")
    .click(startDictation);
});
