const { findLast, intersectionBy, map, reduce } = require('lodash')

// Returns an array of AST nodes that form the value for the last occurence
// of the given property name in the list of given AST declaration nodes.
export const getLastPropertyValue = (declarations, prop) =>
  findLast(declarations, d => d.property === prop).value.children.toArray()

// Returns an object that is keyed by the CSS properties that exist in both
// arrays of given AST declaration nodes and contains arrays of AST nodes that
// form the start and end values for each of these properties.
const getAnimationValues = (startDec, endDec) =>
  reduce(
    intersectionBy(map(startDec, 'property'), map(endDec, 'property')),
    (accu, prop) =>
      Object.assign(accu, {
        [prop]: {
          start: getLastPropertyValue(startDec, prop),
          end: getLastPropertyValue(endDec, prop),
        },
      }),
    {}
  )

export default getAnimationValues
