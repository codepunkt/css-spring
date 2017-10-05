const { compact, filter, map } = require('lodash')

// Returns an array containing the interpolateable parts of a CSS property
// value based on the given arrays of AST value nodes for both start
// and end values.
export const getAnimatableValues = (startValues, endValues) =>
  compact(
    map(startValues, (start, i) => {
      const end = endValues[i]

      if (start.type !== end.type) {
        return
      }

      switch (start.type) {
        case 'WhiteSpace':
          return { type: 'Fixed', value: ' ' }
        case 'Operator':
          return start.value !== end.value
            ? null
            : { type: 'Fixed', value: start.value }
        case 'Identifier':
          return start.name !== end.name
            ? null
            : { type: 'Fixed', value: start.name }
        case 'Dimension':
          return start.unit !== end.unit
            ? null
            : {
                type: start.type,
                unit: start.unit,
                start: +start.value,
                end: +end.value,
              }
        case 'Number':
          return start.value !== end.value
            ? { type: start.type, start: +start.value, end: +end.value }
            : { type: 'Fixed', value: start.value }
        case 'HexColor':
          return { type: start.type, start: start.value, end: end.value }
        case 'Function':
          const values = getAnimatableValues(
            start.children.toArray(),
            end.children.toArray()
          )
          return values.length !== start.children.toArray().length
            ? null
            : { type: start.type, name: start.name, values }
        default:
          console.error(`unknown type: ${start.type}`)
          return null
      }
    })
  )

// Returns an object keyed by the CSS properties that have corresponding,
// interpolateable values.
const sanitizeValues = values => {
  const result = {}

  Object.keys(values).forEach(prop => {
    const { start: startValues, end: endValues } = values[prop]
    const animatable = getAnimatableValues(startValues, endValues)
    if (animatable.length === startValues.length) {
      result[prop] = animatable
    }
  })

  return result
}

export default sanitizeValues
