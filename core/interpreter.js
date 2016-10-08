/**
* @fileoverview Interprets a given command and calls workspace controller_.functions.
* @author pandori@wisc.edu (Sahib Pandori)
* @author david.liang@wisc.edu (David Liang)
*/

'use strict';

goog.provide('SpeechBlocks.Interpreter');

goog.require('SpeechBlocks.Predecessor');
goog.require('SpeechBlocks.StatementInput')
goog.require('SpeechBlocks.Successor');
goog.require('SpeechBlocks.Translation');
goog.require('SpeechBlocks.ValueInput');
goog.require('goog.structs.Map');

/**
* Constructs an interpreter that takes actions as input and controls the Blockly Workspace.
* @param {!SpeechBlocks.Controller} controller_.The workspace controller_.
*/
SpeechBlocks.Interpreter = function(controller) {
    /** @private @const */
    this.controller_ = controller;
    /** @private */
    this.id_ = 1;
    /** @private */
    this.blockTypeMap_ = new goog.structs.Map();
    this.blockTypeMap_.set('if','controls_if');
    this.blockTypeMap_.set('comparison','logic_compare');
    this.blockTypeMap_.set('repeat','controls_repeat_ext');
    this.blockTypeMap_.set('number','math_number');
    this.blockTypeMap_.set('arithmetic','math_arithmetic');
    this.blockTypeMap_.set('text','text');
    this.blockTypeMap_.set('print','text_print');
    this.blockTypeMap_.set('set','variables_set');
    this.blockTypeMap_.set('variable','variables_get');
}

/**
* Interprets a given command by calling the corresponding action function.
* @param {Object=} command Command object from parser.
*/
SpeechBlocks.Interpreter.prototype.interpret = function(command) {
    switch (command.action) {
        case 'run': this.run(command); break;
        case 'add': this.addBlock(command); break;
        case 'move': this.moveBlock(command); break;
        case 'modify': this.modifyBlock(command); break;
        case 'delete': this.deleteBlock(command); break;
        case 'undo': this.undo(); break;
        case 'redo': this.redo(); break;
    }
};

/**
* Compiles the Blockly code into JavaScript and runs it.
* @param {Object=} command Object with command specifics from the parser.
*/
SpeechBlocks.Interpreter.prototype.run = function(command) {
    Blockly.JavaScript.addReservedWords('code');
    try {
        var code = Blockly.JavaScript.workspaceToCode(this.controller_.workspace);
        eval(code);
    } catch (err) { console.log(err.message); throw err; }
};

/**
* Adds a specified block.
* @param {Object=} command Command object from parser.
*/
SpeechBlocks.Interpreter.prototype.addBlock = function(command) {
    this.controller_.addBlock(this.blockTypeMap_.get(command.type), (this.id_++).toString(), new SpeechBlocks.Translation(0,0));
};

/**
* @TODO Implement error checking
* Moves a specified block.
* @param {Object=} command Command object from parser.
*/
SpeechBlocks.Interpreter.prototype.moveBlock = function(command) {
    command.block = command.block.toString();
    if (this.isBlockIdValid(command.block)) {
        if (command.where == 'trash') {
            this.deleteBlock(command.block);
            return;
        }
        else if (command.where.block == null || !this.isBlockIdValid(command.where.block.toString()))
            return;

        command.where.block = command.where.block.toString();

        switch (command.where.position) {
            case 'after':
                this.controller_.moveBlock(command.block, new SpeechBlocks.Successor(command.where.block)); break;
            case 'before':
                this.controller_.moveBlock(command.block, new SpeechBlocks.Predecessor(command.where.block)); break;
            case 'lhs':
            case 'rhs':
            case 'top':
            case 'to the right of':
                var inputList = this.controller_.getBlockValueInputs(command.where.block);
                if (inputList.length < 1)
                    console.log('NO VALUE INPUTS FOR SPECIFIED BLOCK');
                else if (command.where.position == 'rhs' || command.where.position == 'to the right of')
                    this.controller_.moveBlock(command.block, new SpeechBlocks.ValueInput(command.where.block, inputList[inputList.length-1]));
                else
                    this.controller_.moveBlock(command.block, new SpeechBlocks.ValueInput(command.where.block, inputList[0]));
                break;
            case 'inside':
                var statementList = this.controller_.getBlockStatementInputs(command.where.block);
                if (statementList.length < 1) {
                    var inputList = this.controller_.getBlockValueInputs(command.where.block);
                    if (inputList.length < 1)
                        console.log('NO INPUTS FOR SPECIFIED BLOCK')
                    else
                        this.controller_.moveBlock(command.block, new SpeechBlocks.ValueInput(command.where.block, inputList[0]));
                }
                else
                    this.controller_.moveBlock(command.block, new SpeechBlocks.StatementInput(command.where.block, statementList[statementList.length-1]));

                break;
            case 'separate':
                var statementList, inputList, connectionsList;
                try { statementList = this.controller_.getBlockStatementInputs(command.where.block); } catch(err) {}
                try { inputList = this.controller_.getBlockValueInputs(command.where.block); } catch(err) {}
                if (statementList != null && inputList != null) { connectionsList = statementList.concat(inputList); }
                else if (statementList != null) { connectionsList = statementList; }
                else if (inputList != null) { connectionsList = inputList; }
                else { console.log("NO INPUTS"); return; }
                console.log(connectionsList);
                connectionsList_.forEach(function() {

                });
                this.controller_.moveBlock(command.block, new SpeechBlocks.Translation(0, 0));
                break;
            default:
                console.log("POSITION UNDEFINED");
        }
    }
};

/**
* Modifies a specified block.
* @param {Object=} command Command object from parser.
*/
SpeechBlocks.Interpreter.prototype.modifyBlock = function(command) {
    command.block = command.block.toString();
    if (this.isBlockIdValid(command.block)) {
        var fields = this.controller_.getFieldsForBlock(command.block).getKeys();
        if (fields.length == 1) { this.controller_.setBlockField(command.block, fields[0], command.value); return; }
        switch(command.property) {
            case 'number': command.value = Number(command.value);
            case 'text':	case 'comparison': case 'operation': case 'name': this.controller_.setBlockField(command.block, fields[0], command.value);  break;
        }
    }
};

/**
 * Undos last action.
 */
SpeechBlocks.Interpreter.prototype.undo = function() {
    this.controller_.undo();
}

/**
 * Redos last action.
 */
SpeechBlocks.Interpreter.prototype.redo = function() {
    this.controller_.redo();
}

/**
* Delete a specified block.
* @param {Object=} command Command object from parser.
*/
SpeechBlocks.Interpreter.prototype.deleteBlock = function(blockId) {
    if (this.isBlockIdValid(blockId)) { this.controller_.removeBlock(blockId); }
};

/**
* Checks to see if a block Id is valid.
* @param {!String=} blockId as string.
*/
SpeechBlocks.Interpreter.prototype.isBlockIdValid = function(blockRequestId) {
    return this.controller_.getAllBlockIds().contains(blockRequestId);
}

/**
* Initialize the mapping of types that the parser uses and the types that Blockly understands.
*/
SpeechBlocks.Interpreter.prototype.initializeBlockTypeMap = function() {
    //var inputReceived = false;
    /** does not work, unsure if we will keep this method for possible future use*/
    //this.blockTypeMap_ = this.initializeBlockTypeMap();
    //setTimeout(function() {
    // console.log(inputReceived);
    // if (this.blockTypeMap_ != null) {
    // console.log(this.blockTypeMap_.isEmpty());
    // console.log(this.blockTypeMap_.getValues())
    // console.log(this.blockTypeMap_.get('if'));
    // }
    // else {console.log("BLOCKTYPEMAP IS NULL")}
    // },5000);
    return;
    var inputText;
    var rawFile;
    try {
        console.log('a');
        rawFile = new XMLHttpRequest();
        rawFile.open("GET", 'https://aravart.github.io/speech-blocks/grammar/blockTypeMap.txt', true);
        rawFile.onreadystatechange = function () {
            //console.log(rawFile.readyState);
            if(rawFile.readyState == 4) {
                //console.log('b')
                if(rawFile.status == 200 || rawFile.status == 0) {
                    //console.log('c');
                    if (!inputReceived) {
                        //console.log('INPUT BEING SET');
                        inputText = rawFile.responseText;
                        inputReceived = true;
                        // console.log('INPUT SET');
                        console.log(inputText);
                        inputText = inputText.split(/\r\n|\r|\n/g);
                        var blockTypeMap = new goog.structs.Map();
                        for (var i = 0; i < inputText.length; i++) {
                            var keyValuePair = inputText[i].split(":");
                            //console.log(keyValuePair[0]);
                            //console.log(keyValuePair[1]);
                            if (keyValuePair[0] != null && keyValuePair[1] != null) {
                                blockTypeMap.set(keyValuePair[0], keyValuePair[1]);
                            }
                        }
                        this.blockTypeMap_ = blockTypeMap;
                        console.log("SAVED");
                        console.log(this.blockTypeMap_.get('if'))
                        return;
                    }
                    else {console.log('input already set');}
                }
            }
            else {}
            if (rawFile.status == 200 || rawFile.status == 0) {rawFile.send();}
        }
    } catch(err) { console.log(err.stack) }

    try {
        setTimeout(function() {rawFile.onreadystatechange();},3000);
    }
    catch(err) {console.log(err.stack) }

}
