import {
  compact,
  isArray,
  map,
} from 'lodash'

// css properties that can have values joined by spaces
const spaceCombinedProps = [
  '-moz-outline-radius',
  '-webkit-text-stroke',
  'background',
  'border',
  'border-bottom',
  'border-color',
  'border-left',
  'border-radius',
  'border-right',
  'border-spacing',
  'border-top',
  'border-width',
  'margin',
  'outline',
  'padding',
]

// splits a css property value into multiple values
export const split = (key, value) => {
  if (spaceCombinedProps.indexOf(key) >= 0) {
    const arr = value.split(' ')
    return arr.length === 1 ? arr[0] : arr
  }

  return value
}

// combines multiple values to a single css property value
export const combine = (key, value) => {
  return isArray(value) && spaceCombinedProps.indexOf(key) >= 0
    ? value.join(' ')
    : value
}

// this splits css numbers from units.
//
// according to the css spec, a number can either be an integer or it can be
// zero or more digits followed by a dot followed by one or more digits.
// assuming the unit can be any sequence of lowercase letters (including none)
//
// returns an object with `unit` and `value` properties.
export const parseNumber = (number) => {
  const regex = /^([+-]?(?:\d+|\d*\.\d+))([a-z]*|%)$/
  const [ , value, unit ] = `${number}`.match(regex) || []
  return value ? { unit, value: Number(value) } : undefined
}

// check if a string is a hex color. returns an array of three integers
// between 0 and 255 for the three rgb components if it is.
export const parseHexColor = (color) => {
  let [ , hex ] = `${color}`.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i) || []
  if (hex) {
    hex = hex.length === 3 ? map(hex, (v) => `${v}${v}`).join('') : hex
    return map(hex.match(/.{1,2}/g), (v) => parseInt(v, 16))
  }
}

// parses css startValue and endValue.
//
// returns an object consisting of start and end values for interpolation
// and an additional unit if the start and end values are numeric. in cases
// of unchanged values, returns the fixed value
export const parseValues = (startValue, endValue) => {
  // when both values are equal, the value is fixed
  if (startValue === endValue) {
    return { fixed: startValue }
  }

  // check if both values are numeric with optional unit
  const numericStart = parseNumber(startValue)
  const numericEnd = parseNumber(endValue)

  if (numericStart && numericEnd) {
    const startUnit = numericStart.unit
    const endUnit = numericEnd.unit

    // when start unit is the same as end unit or one of them is unitless
    if (startUnit === endUnit || !startUnit || !endUnit) {
      return {
        unit: startUnit || endUnit,
        start: numericStart.value,
        end: numericEnd.value,
      }
    }
  }

  // check of both values are hex rgb colors
  const colorStart = parseHexColor(startValue)
  const colorEnd = parseHexColor(endValue)

  if (colorStart && colorEnd) {
    return { rgb: [ colorStart, colorEnd ]}
  }
}

// returns an object that lists the property, unit, start and end values of
// the animatable properties based on the given arguments.
//
// to be animatable, a property has to be present on both `startStyles` and
// `endProps` with a numeric value and same unit for both or unitless for one
// of them which will then take the unit of the other.
export const parseStyles = (startStyles, endStyles) => {
  let result = []

  for (let prop in startStyles) {
    // only animate props that exist in both start and end styles
    if (!(prop in endStyles)) {
      break
    }

    // in case of combined values, split them!
    const startValues = [].concat(split(prop, startStyles[prop]))
    const endValues = [].concat(split(prop, endStyles[prop]))

    // only animate props that have the same number of values
    if (startValues.length !== endValues.length) {
      break
    }

    // parse start and end value combinations
    const parsedValues = compact(map(startValues, (value, key) => {
      const parsed = parseValues(value, endValues[key])
      return parsed ? { prop, ...parsed } : null
    }))

    // when parsing was successful for every combination, use the results
    if (parsedValues.length === startValues.length) {
      result = result.concat(parsedValues)
    }
  }

  return result
}
