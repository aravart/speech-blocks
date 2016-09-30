class Interpreter
  controller: new Controller
  id: 0

  interpret: (command) ->
    if command.action == "Run"
      run(command)
    else if command.action == "Add"
      addBlock(command)
    else if command.action == "Move"
      moveBlock(command)
    else if command.action == "Modify"
      modifyBlock(command)
    else if command.action == "Delete"
      deleteBlock(command)

  run: (command) ->
    # run

  addBlock: (command) ->
    # add block
    # figure out the type of block from the command
    console.log "controller.addBlock(type, id++, commmand.where)"

  moveBlock: (command) ->
    # move block
    console.log "controller.moveBlock(command.block.number, command.where)"

  modifyBlock: (command) ->
    # modify block

  deleteBlock: (command) ->
    # delete
    console.log "controller.removeBlock(command.block.number)"
