Start = ("please" _)? command:( Move / Add / Change / Run / Undo / Redo ) { return command }

Article = "an" / "a" / "the"
Type = "set" / "if" / "repeat" / "comparison" / "arithmetic" / "print" / "text" / "number" / "variable"

Move = MoveVerb _ block:BlockToken _ where:Where { return {
   "action": "move",
   "block": block,
   "where": where
   } }

MoveVerb = "move" / "attach"

BlockType = Article _ type:Type _ "block" { return type }

BlockToken = "block" _ ("number" _)? number:Number { return number }

Where = BlockPosition / Trash

BlockPosition = position:Position _ block:BlockToken { return {
  "block": block,
  "position": position
  } }

Trash = "to the trash" { return "trash" }

Position = "after" / "before" / "inside of" / "inside" / "to the right of" / LefthandSide / RighthandSide / Top

Number = digits:[0-9]+ { return parseInt(digits.join(""), 10); }
Word = value:[a-zA-Z]+ { return value.join("") }
Words = car:Word cdr:(" " w:Word { return w })* { return [car].concat(cdr).join(" ") }

Add = AddVerb _ type:BlockType { return {
   "action": "add",
   "type": type
   } }

AddVerb = "add" / "insert" / "make"

Remove = RemoveVerb _ block:BlockToken { return {
   "action": "Delete",
   "block": block
   } }

RemoveVerb = "delete" / "remove"

Change = "in" _ block:BlockToken _ ("please" _)? ChangeVerb _ pair:PropertyValuePair {
   pair["action"] = "modify"
   pair["block"] = block
   return pair
   }

ChangeVerb = "change" / "set"

PropertyValuePair = OperationPair / ComparisonPair / NamePair / NumberPair / TextPair

OperationPair = ("the" _)? (OperationName / OperationValue) _ "to" _ value:OperationValue { return {
  "property": "operation",
  "value": value
  } }

OperationName = ("operation" / "operator") { return "operation" }
OperationValue = Addition / Subtraction / Multiplication / Division / Exponentiation
Addition = ("addition" / "add" / "plus") { return "+" }
Subtraction = ("subtract" / "minus" / "subtraction") { return "-" }
Multiplication = ("multiply" / "times" / "multiplication") { return "*" }
Division = ("divide" / "division") { return "/" }
Exponentiation = ("power" / "exponentiation") { return "^" }

NamePair = ("the" _)? "variable name to" _ name:Word { return {
  "property": "name",
  "value": name
  } }

ComparisonPair = ("the" _)? (ComparisonName / ComparisonValue) _ "to" _ comparison:ComparisonValue { return {
  "property": "comparison",
  "value": comparison
  } }

ComparisonName = "comparison"
ComparisonValue = "equals" { return "==" } /
  "not equals" { return "!=" } /
  "greater than or equal to" { return ">=" } /
  "less than or equal to" { return "<=" } /
  "greater than" { return ">" } /
  "less than" { return "<" }

NumberPair = ("the" _)? (NumberName / Number) _ "to" _ number:Number { return {
  "property": "number",
  "value": number
  } }
NumberName = "number"

TextPair = ("the" _)? "text" _ "to" _ text:Words { return {
  "property": "text",
  "value": text
  } }

LefthandSide = ("to" / "into") _ "the" _ ("first blank" / "first field" / "lefthand side") _ "of" { return "lhs" }
RighthandSide = ("to" / "into") _ "the" _ ("second blank" / "second field" / "righthand side") _ "of" { return "rhs" }
Top = ("to" / "into") _ "the" _ "top" _ "of" { return "top" }

Run = ("run the program" / "run it" / "run") { return {
   "action": "run"
   } }

Undo = "undo" { return {
   "action": "undo"
   } }
Redo = "redo" { return {
   "action": "redo"
   } }
_   = ' '*
