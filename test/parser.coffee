colors = [/blue/,/pink/,/chartreuse/]

class What
  color: null
  constructor: (@name) ->

  decide: (line) ->
    if /add/.test(line)
      res = new NewBlock
    for color in colors
      if color.test(line)
        res.color = color.toString().replace /\//g, ""
    res

class NewBlock extends What
  constructor: -> super("New Block")

class Where
class EmptyRegion extends Where


class Command
  constructor: (@name) ->

  decideArguments: (line) -> line


class Move extends Command
  what: new What
  where: new Where

  constructor: -> super("Move")

  decideArguments: (line) ->
    @what = @what.decide(line)

class Run extends Command
  constructor: -> super("Run")


class Parser
  decideCommand: (line) ->
    if /run/.test(line)
      return new Run
    if /add/.test(line)
      return new Move

  parse: (line) ->
    command = this.decideCommand(line)
    if command
      command.decideArguments(line)
    else
      throw new Error "No command found in: #{line}"
    command