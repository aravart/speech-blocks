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
    this.blockTypeMap_.set('math','math_arithmetic');
    this.blockTypeMap_.set('arithmetic','math_arithmetic');
    this.blockTypeMap_.set('text','text');
    this.blockTypeMap_.set('print','text_print');
    this.blockTypeMap_.set('set','variables_set');
    this.blockTypeMap_.set('variable','variables_get');
    this.blockTypeMap_.set('turn','turtle_turn_internal');
    this.blockTypeMap_.set('move','turtle_move_internal');
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
        case 'delete': this.deleteBlock(command.block); break;
        case 'undo': this.undo(); break;
        case 'redo': this.redo(); break;
    }
};

/**
* Compiles the Blockly code into JavaScript and runs it.
* @param {Object=} command Object with command specifics from the parser.
*/
SpeechBlocks.Interpreter.prototype.run = function(command) {
    // try { this.controller_.run(); } catch (err) { console.log(err.message); }
    Turtle.runButtonClick(1);
};

/**
* Adds a specified block. Can be added to aspecific place.
* @param {Object=} command Command object from parser.
*/
SpeechBlocks.Interpreter.prototype.addBlock = function(command) {
    this.controller_.addBlock(this.blockTypeMap_.get(command.type), (this.id_++).toString());

    if(command.where != null)
    {
        command.block = (this.id_ - 1).toString();
        this.moveBlock(command);
    }
};

/**
* @TODO Implement error checking
* Moves a specified block.
* @param {Object=} command Command object from parser.
*/
SpeechBlocks.Interpreter.prototype.moveBlock = function(command) {
    if (this.isBlockIdValid(command.block.toString()))
    {
        command.block = command.block.toString();
        if (command.where == 'trash')
        {
            return this.deleteBlock(command.block);
        }
        else if (command.where == 'away')
        {
            this.controller_.disconnectBlock(command.block);
        }
        else if (command.where.block == null || !this.isBlockIdValid(command.where.block.toString()))
        {
            return;
        }
        else
        {
            command.where.block = command.where.block.toString();
        }
        switch (command.where.position)
        {
            case 'below':
            this.controller_.moveBlock(command.block, new SpeechBlocks.Successor(command.where.block));
            break;
            case 'above':
            this.controller_.moveBlock(command.block, new SpeechBlocks.Predecessor(command.where.block));
            break;
            case 'lhs':
            case 'rhs':
            case 'top':
            case 'to the right of':
            var inputList = this.controller_.getBlockValueInputs(command.where.block);
            if (inputList.length < 1)
            {
                console.log('NO VALUE INPUTS FOR SPECIFIED BLOCK');
            }
            else if (command.where.position == 'rhs' || command.where.position == 'to the right of')
            {
                this.controller_.moveBlock(command.block, new SpeechBlocks.ValueInput(command.where.block, inputList[inputList.length-1]));
            }
            else if (command.where.position == 'lhs' || command.where.position == 'top')
            {
                this.controller_.moveBlock(command.block, new SpeechBlocks.ValueInput(command.where.block, inputList[0]));
            }
            break;
            case 'inside':
            var inputList = this.controller_.getBlockValueInputs(command.where.block);
            var statementList = this.controller_.getBlockStatementInputs(command.where.block);
            try
            {
               this.controller_.moveBlock(command.block, new SpeechBlocks.ValueInput(command.where.block, inputList[0]));
            }
            catch(err) {}
            try
            {
               this.controller_.moveBlock(command.block, new SpeechBlocks.StatementInput(command.where.block, statementList[statementList.length-1]));
            }
            catch(err) {}
            break;
            case 'away':
            this.controller_.disconnectBlock(command.block);
            break;
        }
    }
};

/**
* Modifies a specified block.
* @param {Object=} command Command object from parser.
*/
SpeechBlocks.Interpreter.prototype.modifyBlock = function(command) {
    if (this.isBlockIdValid(command.block.toString()))
    {
        command.block = command.block.toString();
        var fields = this.controller_.getFieldsForBlock(command.block).getKeys();
        console.log(fields);
        switch(command.property)
        {
            case 'number':
            command.value = Number(command.value); // fall through
            case 'text':
            case 'comparison':
            case 'operation':
            case 'name':
            case 'value':
            this.controller_.setBlockField(command.block, fields[fields.length-1], command.value);
            break;
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
    if (blockId.toString() == 'all')
    {
        for (var i = 1; i < 20; i++)
        {
            if (this.isBlockIdValid(i.toString()))
            {
                this.controller_.removeBlock(i.toString());
            }
        }
        this.id_ = 1;
    }
    else if (this.isBlockIdValid(blockId.toString()))
    {
        this.controller_.removeBlock(blockId.toString());
    }
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
                if(rawFile.status == 200 || rawFile.status == 0) {
                    if (!inputReceived) {
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
