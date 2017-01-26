// this splits css numbers from units.
// according to the css spec, a number can either be an integer or it can be
// zero or more digits followed by a dot followed by one or more digits.
// assuming the unit can be any sequence of lowercase letters (including none)
const numberUnitSplit = /^([+-]?(?:\d+|\d*\.\d+))([a-z]*|%)$/

// returns an object that lists the unit, start and end values of the
// animatable properties based on the given arguments.
// to be animatable, a property has to be present on both `startProps` and
// `endProps` with the same unit.
export const getAnimatableProps = (startProps, endProps) => {
  const result = {}

  // @todo check if props are listed in animatable properties!
  // @see https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animated_properties
  // @see https://github.com/gilmoreorless/css-animated-properties
  for (let key in startProps) {
    if (key in endProps) {
      const startMatches = startProps[key].toString().match(numberUnitSplit)
      const endMatches = endProps[key].toString().match(numberUnitSplit)

      if (startMatches && endMatches && startMatches[2] === endMatches[2]) {
        result[key] = {
          unit: startMatches[2],
          start: +startMatches[1],
          end: +endMatches[1]
        }
      }
    }
  }

  return result
}
