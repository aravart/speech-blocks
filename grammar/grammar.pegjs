Start = Move / Add / Remove / Change / Run

Article = "a" / "the"
Color = "blue" / "pink"

Move = MoveVerb _ block:Block _ where:Where { return {
   "action": "Move",
   "block": block,
   "where": where
   } }

MoveVerb = "move"
Block = ColorBlock / NumberBlock
ColorBlock = Article _ color:Color _ "block" { return {
  "color": color
  } }

NumberBlock = "block" _ number:Number { return {
  "number": number
  } }

Where = position:Position _ block:Block { return {
  "block": block,
  "position": position
  } }

Position = "after" / "before" / "in front of" / "behind"
Number = digits:[0-9]+ { return parseInt(digits.join(""), 10); }

Add = AddVerb _ block:Block { return {
   "action": "Add",
   "block": block
   } }

AddVerb = "add" / "insert"

Remove = RemoveVerb _ block:NumberBlock { return {
   "action": "Delete",
   "block": block
   } }

RemoveVerb = "delete" / "remove"

Change = ChangeVerb _ block:NumberBlock _ "to" _ property:Property { return {
   "action": "Modify",
   "block": block,
   "property": property
   } }

ChangeVerb = "change" / "set"
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
