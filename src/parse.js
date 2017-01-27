import { split } from './values'
import { isArray, map } from 'lodash'

// this splits css numbers from units.
// according to the css spec, a number can either be an integer or it can be
// zero or more digits followed by a dot followed by one or more digits.
// assuming the unit can be any sequence of lowercase letters (including none)
const numberUnitSplit = /^([+-]?(?:\d+|\d*\.\d+))([a-z]*|%)$/

// WAT
const parseUnit = (startProp, endProp) => {
  const startMatches = startProp.toString().match(numberUnitSplit)
  const endMatches = endProp.toString().match(numberUnitSplit)

  // when start and end match css number with optional unit
  if (startMatches && endMatches) {
    const startUnit = startMatches[2]
    const endUnit = endMatches[2]

    // when start unit is the same as end unit or one of them is unitless
    if (startUnit === endUnit || !startUnit || !endUnit) {
      return {
        unit: startUnit || endUnit,
        start: Number(startMatches[1]),
        end: Number(endMatches[1]),
      }
    }
  }
}

// returns an object that lists the unit, start and end values of the
// animatable properties based on the given arguments.
// to be animatable, a property has to be present on both `startProps` and
// `endProps` with a numeric value and same unit for both or unitless for one
// of them which will then take the unit of the other.
export const getAnimatableProps = (startProps, endProps) => {
  let result = []

  // @todo check if props are listed in animatable properties!
  // @see https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animated_properties
  // @see https://github.com/gilmoreorless/css-animated-properties
  for (let prop in startProps) {
    if (prop in endProps) {
      const startProp = split(prop, startProps[prop])
      const endProp = split(prop, endProps[prop])

      if (isArray(startProp) && isArray(endProp) && startProp.length === endProp.length) {
        // array of values
        const temp = []
        for (let key in startProp) {
          if ({}.hasOwnProperty.call(startProp, key)) {
            const parsed = parseUnit(startProp[key], endProp[key])

            if (parsed) {
              const { unit, start, end } = parsed
              temp.push({ prop, unit, start, end })
            }
          }
        }
        if (temp.length === startProp.length) {
          result = result.concat(temp)
        }
      } else {
        // probably single values
        const parsed = parseUnit(startProp, endProp)

        if (parsed) {
          const { unit, start, end } = parsed
          result.push({ prop, unit, start, end })
        }
      }
    }
  }

  return result
}
