const { filter, map } = require('lodash')

// Returns an array without null values
const removeNull = arr => filter(arr, e => e != null)

// Returns an array containing the interpolateable parts of a CSS property
// value based on the given arrays of AST value nodes for both start
// and end values.
const getAnimatableValues = (startValues, endValues) =>
  removeNull(
    map(startValues, (startValue, i) => {
      const endValue = endValues[i]
      const { type, unit, name, value, value: start, children } = startValue
      const { value: end } = endValue

      if (type !== endValue.type) {
        return
      }

      switch (type) {
        case 'WhiteSpace':
          return { type: 'Fixed', value: ' ' }
        case 'Operator':
          return { type: 'Fixed', value }
        case 'Identifier':
          return name !== endValue.name ? null : { type: 'Fixed', value: name }
        case 'Dimension':
          return unit !== endValue.unit
            ? null
            : { type, unit, start: +start, end: +end }
        case 'Number':
          return start === end
            ? { type: 'Fixed', value: start }
            : { type, start: +start, end: +end }
        case 'HexColor':
          return { type, start, end }
        case 'Function':
          const values = getAnimatableValues(
            children.toArray(),
            endValue.children.toArray()
          )
          return values.length !== children.toArray().length
            ? null
            : { type, name, values }
        default:
          console.error(`unknown type: ${type}`)
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

module.exports = sanitizeValues
