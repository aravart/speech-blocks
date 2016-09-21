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
Number = digits:[0-9]+

Add = AddVerb _ Block
AddVerb = "add" / "insert"

Remove = RemoveVerb _ NumberBlock
RemoveVerb = "delete" / "remove"

Change = ChangeVerb _ NumberBlock _ "to" _ Property
ChangeVerb = "change" / "set"
Property = Degrees / Direction
Degrees = Number _ "degrees"
Direction = "move"? _ ("forwards" / "backwards")

Run = "run the program" / "run it"

_   = ' '*