colors = [/blue/,/pink/,/chartreuse/]
numbers = [/one/,/two/,/three/,/four/,/five/,/six/,/seven/,/eight/,/nine/,/ten/,
           /eleven/,/twelve/,/thirteen/,/fourteen/,/fifteen/,/sixteen/,
           /seventeen/,/eighteen/,/nineteen/,/twenty/]

class Block
  color: null
  where: new Position
  propertyValue: null

  constructor: (@id, @where) ->

  decide: (line) ->
    # To add a new block
    if /add/.test(line)
      res = new NewBlock
      # Set the color of the block (I don't think color is a good idea...)
      for color in colors
        if color.test(line)
          res.color = color.toString().replace /\//g, ""
      res
    # To move an existing block
    else if /move/.test(line) || /put/.test(line)
      # Obtain the block ID to be moved
      words = line.split " "
      number = words[words.indexOf "block" + 1]
      for num in numbers
        if num.toString().replace /\//g, "" == number
          @id = numbers.indexOf(num) + 1
          break
      @
    else if /change/.test(line) || /modify/.test(line)
      # Obtain the block ID to be modified
      words = line.split " "
      number = words[words.indexOf "block" + 1]
      for num in numbers
        if num.toString().replace /\//g, "" == number
          @id = numbers.indexOf(num) + 1
          break
      # Obtain the value to be modified to
      valueIndex = words[words.indexOf "to" + 1]
      if isNumeric(words[valueIndex])
        @propertyValue = words[valueIndex]
      else
        @propertyValue = words[words.length - 1]
    else if /delete/.test(line) || /remove/.test(line)
      # Obtain the block ID to be moved
      words = line.split " "
      number = words[words.indexOf "block" + 1]
      for num in numbers
        if num.toString().replace /\//g, "" == number
          @id = numbers.indexOf(num) + 1
          break
      @

class NewBlock extends Block
  constructor: -> super("New Block")


class Position
  constructor: (@placement, @blockId) ->

  decide: (line) ->
    # Decide the placement relative to another block
    if /after/.test(line)
      number = (line.split " after block ")[1]
      @placement = "after"
    else if /before/.test(line)
      number = (line.split " before block ")[1]
      @placement = "before"
    # Get the block ID
    for num in numbers
      if num.toString().replace /\//g, "" == number
        id = numbers.indexOf(num) + 1
        @blockId = id
    @

class EmptyRegion extends Position


class Command
  constructor: (@name) ->

  decideArguments: (line) -> line

class Move extends Command
  what: new Block
  where: new Position

  constructor: -> super("Move")

  decideArguments: (line) ->
    @what = @what.decide(line)
    @where = @where.decide(line)
    @what.where = @where
    @

class Run extends Command
  constructor: -> super("Run")
  decideArguments: (line) ->
    # Run the program

class Modify extends Command
  block: new Block

  constructor: -> super("Modify")

  decideArguments: (line) ->
    @block = @block.decide(line)
    @

class Delete extends Command
  block: new Block

  constructor: -> super("Delete")

  decideArguments: (line) ->
    @block = @block.decide(line)
    @


class Parser
  constructor: ->

  decideCommand: (line) ->
    if /run/.test(line)
      return new Run
    if /add/.test(line) || /move/.test(line) || /put/.test(line)
      return new Move
    if /change/.test(line) || /modify/.test(line)
      return new Modify
    if /delete/.test(line) || /remove/.test(line)
      return new Delete

  parse: (line) ->
    command = decideCommand(line)
    if command
      command.decideArguments(line)
    else
      throw new Error "No command found in: #{line}"
    command
