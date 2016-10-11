Start = ("please" _)? command:( Move / Add / Remove / Change / Run / Undo / Redo ) { return command }

Article = "an" / "a" / "the"
Type = "set" / "if" / "repeat" / "comparison" / "math" / "arithmetic" / "print" / "text" / "number" / "variable"

Move = MoveVerb _ block:BlockToken _ where:(Where / "away") { return {
   "action": "move",
   "block": block,
   "where": where
} }

MoveVerb = "move" / "attach"

BlockType = Article _ type:Type (_ "block")? { return type }

BlockToken = ("block")? _ ("number" _)? number:Number { return number }

Where = BlockPosition / Trash

BlockPosition = position:Position _ block:BlockToken { return {
   "block": block,
   "position": position
} }

Trash = "to the trash" { return "trash" }

Position = Above / Below / Inside / Left / Right / Top / Away

Number = digits:[0-9]+ { return parseInt(digits.join(""), 10); }
Word = value:[a-zA-Z]+ { return value.join("") }
Words = car:Word cdr:(" " w:Word { return w })* { return [car].concat(cdr).join(" ") }

Add = AddVarTo / AddVar / AddTo / AddNew

AddNew = AddVerb _ type:BlockType { return {
   "action": "add",
   "type": type
} }

AddTo = AddVerb _ type:BlockType _ where:Where { return {
   "action": "add",
   "type": type,
   "where": where
} }

AddVar = AddVerb _ type:BlockType _ NameVerb _  name:Word{ return {
   "action": "add",
   "type": type,
   "value": name
} }

AddVarTo =  AddVerb _ type:BlockType _ NameVerb _  name:Word _ where:Where { return {
   "action": "add",
   "type": type,
   "value": name,
   "where": where
} }

AddVerb = "add" / "insert" / "make"
NameVerb = "called" / "named"

Remove = RemoveVerb _ block:BlockToken { return {
   "action": "delete",
   "block": block
} }

RemoveVerb = "delete" / "remove" / "erase"

Change = "in" _ block:BlockToken _ ("please" _)? ChangeVerb _ ("the")? _ pair:PropertyValuePair {
   pair["action"] = "modify"
   pair["block"] = block
   return pair
}

ChangeVerb = "change" / "set"

PropertyValuePair = OperationPair / ComparisonPair / NamePair / NumberPair / TextPair / FieldPair

OperationPair = (OperationName / OperationValue) _ "to" _ value:OperationValue { return {
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

NamePair = "variable name to" _ name:Word { return {
   "property": "name",
   "value": name
} }

ComparisonPair = (ComparisonName / ComparisonValue) _ "to" _ comparison:ComparisonValue { return {
   "property": "comparison",
   "value": comparison
} }

ComparisonName = "comparison"
ComparisonValue = "equals" { return "==" } /
("not equals" / "not equal to") { return "≠" } /
"greater than or equal to" { return ">=" } /
"less than or equal to" { return "<=" } /
"greater than" { return ">" } /
"less than" { return "<" }

NumberPair = (NumberName / Number) _ "to" _ number:Number { return {
   "property": "number",
   "value": number
} }
NumberName = "number"

TextPair = "text" _ "to" _ text:Words { return {
   "property": "text",
   "value": text
} }

FieldPair = ("field" / "middle" / "blank" / "value") _ "to" _ text:(Number/Words) { return {
   "property": "field",
   "value": text
} }

Above = ("above" / "before") { return "above" }
Below = ("below" / "after") { return "below" }
Inside = "inside" _ ("of")? { return "inside" }
Left = ("to" / "into") _ "the" _ ("first blank" / "first field" / "lefthand side" / "left") _ "of" { return "lhs" }
Right = ("to" / "into") _ "the" _ ("second blank" / "second field" /"last field" / "last blank"/ "righthand side" / "right") _ "of" { return "rhs" }
Top = ("at" / "to" / "into") _ "the" _ "top" _ "of" { return "top" }
Away = ("away")? _ "from" { return "away" }

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
