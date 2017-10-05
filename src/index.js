import { isEmpty } from 'lodash'

import toPrecision from './util/toPrecision'
import optimizeOutput from './util/optimizeOutput'
import sanitizeValues from './util/sanitizeValues'
import getInterpolator from './util/getInterpolator'
import parseDeclarations from './util/parseDeclarations'
import getAnimationValues from './util/getAnimationValues'
import buildKeyframeObject from './util/buildKeyframeObject'
import addInterpolatedValues from './util/addInterpolatedValues'

// const log = obj => console.dir(obj, { colors: true, depth: null })

// spring presets. selected combinations of tension/wobble.
const presets = {
  noWobble: { tension: 0.6, wobble: 0 },
  gentle: { tension: 0.2, wobble: 0.6 },
  wobbly: { tension: 0.6, wobble: 0.7 },
  stiff: { tension: 0.5, wobble: 0.5 },
}

// default spring options.
// tension and wobble reflect the values of the `wobbly` preset,
const defaultOptions = {
  keyframePrecision: 2,
  precision: 2,
  steps: 100,
  tension: 0.6,
  wobble: 0.7,
}

// css-spring
// ----------
// invoke with startStyles, endStyles and options and gain a keyframe
// style object with interpolated values.
const spring = (startStyles, endStyles, options = {}) => {
  // derive options from default options and arguments
  const {
    keyframePrecision,
    precision,
    steps,
    tension,
    wobble,
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
  if (isEmpty(declarations)) {
    return
  }

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

  return optimizeOutput(
    buildKeyframeObject(declarationsWithInterpolatedValues, keyframePercentages)
  )
}

export default spring
