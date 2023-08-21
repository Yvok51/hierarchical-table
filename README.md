# Hierarchical table

Start server by running `npm run dev`. The server should start on `http://localhost:5173/`.

## Shortcomings

I noticed that children seem to have different types. I merge all of these types into a single list of children.
As the example data always has only one child type this does not matter. If we would want to change this,
then we would need to update the decoration of the data and probably UI as we would most likely want different expand
buttons for the different types of children items.

The rows use the field `ID` and their index, since ID is not unique, as their keys. It would be best if the `ID`
fields would be globally unique or some other globally unique keys were available.

If we were to add more actions that can be done on the rows, we would probably like to introduce a reducer and maybe
also the `immer` library for easier object state management
