const { walk, parse } = require('css-tree')
const { findLast, intersectionBy, map } = require('lodash')

const sanitizeValues = require('./util/sanitizeValues')
const getInterpolator = require('./util/getInterpolator')
const parseDeclarations = require('./util/parseDeclarations')
const getAnimationValues = require('./util/getAnimationValues')
const buildKeyframeObject = require('./util/buildKeyframeObject')
const addInterpolatedValues = require('./util/addInterpolatedValues')

const log = obj => console.dir(obj, { colors: true, depth: null })

// spring presets. selected combinations of stiffness/damping.
const presets = {
  noWobble: { stiffness: 170, damping: 26 },
  gentle: { stiffness: 120, damping: 14 },
  wobbly: { stiffness: 180, damping: 12 },
  stiff: { stiffness: 210, damping: 20 },
}

// default spring options.
// damping and precision reflect the values of the `wobbly` preset,
// precision defaults to 2 which should be a good tradeoff between
// animation detail and resulting filesize.
const defaultOptions = {
  stiffness: 180,
  damping: 12,
  precision: 2,
}

// css-spring
// ----------
// invoke with startStyles, endStyles and options and gain a keyframe
// style object with interpolated values.
const spring = (startStyles, endStyles, options = {}) => {
  // define stiffness, damping and precision based on default options
  // and options given in arguments.
  const { stiffness, damping, precision } = Object.assign(
    {},
    defaultOptions,
    options,
    presets[options.preset] || {}
  )

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
  const interpolationSteps = 13

  const interpolator = getInterpolator(tension, wobble, interpolationSteps)

  // calculate keyframe percentages
  const keyframePercentages = [...Array(interpolator.steps + 1)].map(
    (_, i) => `${(i * 100 / interpolator.steps).toFixed(precision)}%`
  )

  // calculate interpolated values and add them to the declarations
  const declarationsWithInterpolatedValues = addInterpolatedValues(
    interpolator,
    declarations
  )

  return buildKeyframeObject(
    declarationsWithInterpolatedValues,
    keyframePercentages
  )
}

log(
  spring(
    `
  left: 10px;
  opacity: .5;
  padding: 50rem 0em 10px 10rem;
  transform: translate(10px 3em) rotate(25deg) scale(.5);
  border: 1px solid #00f;
`,
    `
  left: 200px;
  opacity: 1;
  padding: -200rem 10em 0px 20rem;
  transform: translate(5px 2em) rotate(15deg) scale(1);
  border: 3px solid #ff0000;
`
  )
)

// console.time('interpolate 2')
// spring(
//   { 'margin-left': `250px`, border: '1px solid #f00' },
//   { 'margin-left': 0, border: '10px solid #bada55' },
//   { preset: 'gentle' },
// )
// console.timeEnd('interpolate 2')

// export { toString }
// export default spring
