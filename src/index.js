const { walk, parse } = require('css-tree')
const { findLast, intersectionBy, map } = require('lodash')
const sanitizeValues = require('./util/sanitizeValues')
const parseDeclarations = require('./util/parseDeclarations')
const getAnimationValues = require('./util/getAnimationValues')
const getInterpolator = require('./util/getInterpolator')
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
  let result = {}

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
  const values = sanitizeValues(
    getAnimationValues(
      parseDeclarations(startStyles),
      parseDeclarations(endStyles)
    )
  )

  // quit if there are no values interpolatable styles
  if (Object.keys(values).length === 0 && values.constructor === Object) {
    return
  }

  const addOrApppend = (obj, key, value) =>
    Object.assign(obj, {
      [key]: `${obj[key] || ''}${value}`,
    })

  const getFunctionValue = (values, step) =>
    values.map(part => (part.values ? part.values[step] : '')).join('')

  const arghl3 = (obj, perc) => {
    let result = [...Array(interpolator.steps + 1)]

    for (let [key, value] of Object.entries(obj)) {
      result = value.reduce((accu, part) => {
        return accu.map((o = {}, i) => {
          switch (part.type) {
            case 'Dimension':
            case 'Fixed':
            case 'HexColor':
            case 'Number':
              return addOrApppend(o, key, part.values[i])
            case 'Function':
              return addOrApppend(
                o,
                key,
                `${part.name}(${getFunctionValue(part.values, i)})`
              )
          }
          return o
        })
      }, result)
    }

    return result
  }

  const tension = 0.5
  const wobble = 0.5
  const keyFramePrecision = 2
  const interpolationSteps = 13

  const interpolator = getInterpolator(tension, wobble, interpolationSteps)

  const keyframePercentages = [...Array(interpolator.steps + 1)].map(
    (_, i) => `${(i * 100 / interpolator.steps).toFixed(keyFramePrecision)}%`
  )
  log(keyframePercentages)

  const withInterpolatedValues = addInterpolatedValues(interpolator, values)

  const blubb = arghl3(withInterpolatedValues, keyframePercentages)
  log(blubb)
  // const percentageStep = 100 / interpolate.steps
  // const data = [...Array(interpolate.steps + 1)].reduce((accu, e, i) => {
  //   const styles = {}
  //   for (let [property, valueParts] of Object.entries(values)) {
  //     console.log(property, valueParts)
  //   }
  //   accu[i * percentageStep] = styles
  //   return accu
  // }, {})
  // console.dir(data, { depth: null })

  // interpolate(0, 10).forEach(v => console.log(v))

  // const walkValue = (value) =>
  //   value.children.toArray()
  //     .filter(value => value.type !== 'WhiteSpace')
  //     .forEach(v => {
  //       const { name, type, unit, value } = v
  //       switch (type) {
  //         case 'Dimension':
  //           console.log(type, value, unit)
  //           break;
  //         case 'Function':
  //           console.log(name)
  //           walkValue(v)
  //           break;
  //         default:
  //           console.log(type, value)
  //           break;
  //       }
  //     })

  // startDeclarations.forEach(dec => {
  //   console.log(`\n${dec.property}\n---`)
  //   walkValue(dec.value)
  // })

  // // get an interpolation function and parse start- and end styles
  // const interpolate = getInterpolator(stiffness, damping)
  // const parsed = parseStyles(startStyles, endStyles)

  // // build keyframe styles based on parsed properties
  // parsed.forEach(({ prop, unit, start, end, rgb, fixed }) => {
  //   // if start and end values differ, interpolate between them
  //   if (!isNil(start) && !isNil(end)) {
  //     interpolate(start, end).forEach((interpolated, i) => {
  //       // round to desired precision (except when interpolating pixels)
  //       let value = Number(interpolated.toFixed(unit === 'px' ? 0 : precision))
  //       // add unit when applicable
  //       value = value === 0 || !unit ? value : `${value}${unit}`
  //       result[i] = addValueToProperty(result[i], prop, value)
  //     })
  //     // if hex representations of rgb colors are found
  //   } else if (!isNil(rgb)) {
  //     // interpolate each color component separately
  //     const r = interpolate(rgb[0][0], rgb[1][0])
  //     const g = interpolate(rgb[0][1], rgb[1][1])
  //     const b = interpolate(rgb[0][2], rgb[1][2])
  //     r.forEach((interpolated, i) => {
  //       const toRgb = rgbFloatToHex
  //       result[i] = addValueToProperty(result[i], prop,
  //         `#${toRgb(r[i])}${toRgb(g[i])}${toRgb(b[i])}`)
  //     })
  //     // otherwise the value is fixed and can directly be appended to the
  //     // resulting keyframe styles
  //   } else if (!isNil(fixed)) {
  //     for (let i = 0; i < 101; i += 1) {
  //       result[i] = addValueToProperty(result[i], prop, fixed)
  //     }
  //   }
  // })

  // // remove obsolete values, combine multiple values for the same property
  // // to single ones and append % to the object keys
  // const obsoleteValues = calculateObsoleteValues(result)
  // result = mapValues(result, (value, i) => {
  //   const result = mapValues(value, (value, key) => combine(key, value))
  //   return pickBy(
  //     result,
  //     (_, property) => obsoleteValues[property].indexOf(Number(i)) < 0,
  //   )
  // })
  // result = omitEmptyValues(result)
  // result = appendToKeys(result, '%')

  // console.log(result)
  return result
}

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

// console.time('interpolate 2')
// spring(
//   { 'margin-left': `250px`, border: '1px solid #f00' },
//   { 'margin-left': 0, border: '10px solid #bada55' },
//   { preset: 'gentle' },
// )
// console.timeEnd('interpolate 2')

// export { toString }
// export default spring
