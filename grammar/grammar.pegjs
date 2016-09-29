Start = Move / Add / Change / Run

Article = "an" / "a" / "the"
Command = "set" / "if" / "repeat" / "comparison" / "arithmetic" / "print" / "text" / "number" / "variable"

Move = MoveVerb _ block:BlockToken _ where:Where { return {
   "action": "Move",
   "block": block,
   "where": where
   } }

MoveVerb = "move" / "attach"

BlockType = Article _ command:Command _ "block" { return {
  "command": command
  } }

BlockToken = "block" _ ("number" _)? number:Number { return {
  "number": number
  } }

Where = BlockPosition / Trash

BlockPosition = position:Position _ block:BlockToken { return {
  "block": block,
  "position": position
  } }

Trash = "to the trash"

Position = "after" / "before" / "inside" / "to the right of" / LefthandSide / RighthandSide

Number = digits:[0-9]+ { return parseInt(digits.join(""), 10); }
Word = value:[a-zA-Z]+ { return value.join("") }

Add = AddVerb _ block:BlockType { return {
   "action": "Add",
   "block": block
   } }

AddVerb = "add" / "insert"

Remove = RemoveVerb _ block:BlockToken { return {
   "action": "Delete",
   "block": block
   } }

RemoveVerb = "delete" / "remove"

Change = "in" _ block:BlockToken _ ChangeVerb _ PropertyValuePair
ChangeVerb = "change" / "set"

PropertyValuePair = OperationPair / ComparisonPair / NamePair / NumberPair

OperationPair = ("the" _)? (OperationName / OperationValue) _ "to" _ OperationValue
OperationName = "operation" / "operator"
OperationValue = 
  "add" / "plus" / "addition" / 
  "subtract" / "minus" / "subtraction" / 
  "multiply" / "times" / "multiplication"
  "divide" / "division" /
  "power" / "exponentiation"

NamePair = ("the" _)? "variable name to" _ Word

ComparisonPair = ("the" _)? (ComparisonName / ComparisonValue) _ "to" _ ComparisonValue
ComparisonName = "comparison"
ComparisonValue = "equals" / "not equals" / "less than" / "greater than" / "less than or equal to" / "greater than or equal to"

NumberPair = ("the" _)? (NumberName / Number) _ "to" _ Number
NumberName = "number"

LefthandSide = ("to" / "into") _ "the" _ ("first blank" / "first field" / "lefthand side") _ "of"
RighthandSide = ("to" / "into") _ "the" _ ("second blank" / "second field" / "righthand side") _ "of"

Property = Degrees / Direction
Degrees = number:Number _ "degrees" { return {
    "type": "degree",
    "value": number
  } }
Direction = "move"? _ direction:("forwards" / "backwards") { return {
    "type": "direction",
    "value": direction
  } }

Run = ("run the program" / "run it") { return {
   "action": "Run"
   } }

_   = ' '*
