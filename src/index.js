const { walk, parse } = require('css-tree')

import toPrecision from './util/toPrecision'
import sanitizeValues from './util/sanitizeValues'
import getInterpolator from './util/getInterpolator'
import parseDeclarations from './util/parseDeclarations'
import getAnimationValues from './util/getAnimationValues'
import buildKeyframeObject from './util/buildKeyframeObject'
import addInterpolatedValues from './util/addInterpolatedValues'

// const log = obj => console.dir(obj, { colors: true, depth: null })

// spring presets. selected combinations of stiffness/damping.
const presets = {
  noWobble: { stiffness: 170, damping: 26 },
  gentle: { stiffness: 120, damping: 14 },
  wobbly: { stiffness: 180, damping: 12 },
  stiff: { stiffness: 210, damping: 20 },
}

// default spring options.
// damping and precision reflect the values of the `wobbly` preset,
const defaultOptions = {
  damping: 12,
  keyframePrecision: 2,
  precision: 2,
  stiffness: 180,
  steps: 100,
}

// css-spring
// ----------
// invoke with startStyles, endStyles and options and gain a keyframe
// style object with interpolated values.
const spring = (startStyles, endStyles, options = {}) => {
  // define stiffness, damping and precision based on default options
  // and options given in arguments.
  const {
    damping,
    keyframePrecision,
    precision,
    steps,
    stiffness,
  } = Object.assign({}, defaultOptions, options, presets[options.preset] || {})

  // parse style declarations of both start and end styles and sanitize
  // them to remove all value combinations that are not interpolatable
  const declarations = sanitizeValues(
    getAnimationValues(
      parseDeclarations(startStyles),
      parseDeclarations(endStyles)
    )
  )

  // quit if there are no interpolatable declarations
  if (
    Object.keys(declarations).length === 0 &&
    declarations.constructor === Object
  ) {
    return
  }

  const tension = 0.5
  const wobble = 0.5

  const interpolator = getInterpolator(tension, wobble, steps)

  // calculate keyframe percentages
  const keyframePercentages = [...Array(steps + 1)].map(
    (_, i) => `${toPrecision(i * 100 / steps, keyframePrecision)}%`
  )

  // calculate interpolated values and add them to the declarations
  const declarationsWithInterpolatedValues = addInterpolatedValues(
    interpolator,
    declarations,
    precision
  )

  return buildKeyframeObject(
    declarationsWithInterpolatedValues,
    keyframePercentages
  )
}

export default spring
