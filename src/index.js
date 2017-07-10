import csstree from 'css-tree'

import {
  findLast,
  intersectionBy,
  isNil,
  mapValues,
  pickBy,
} from 'lodash'

import {
  combine,
  parseStyles,
} from './parse'

import {
  addValueToProperty,
  appendToKeys,
  calculateObsoleteValues,
  getInterpolator,
  omitEmptyValues,
  rgbFloatToHex,
  toString,
} from './util'

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
export const spring = (startStyles, endStyles, options = {}) => {
  let result = {}

  // define stiffness, damping and precision based on default options
  // and options given in arguments.
  const { stiffness, damping, precision } = Object.assign(
    {},
    defaultOptions,
    options,
    presets[options.preset] || {}
  )

  const getDeclarations = (ast, type = 'Declaration') =>
    ast.children.first().block.children.toArray().filter(c => c.type === 'Declaration')

  const startDeclarations = getDeclarations(csstree.parse(`#start{${startStyles}}`))
  const endDeclarations = getDeclarations(csstree.parse(`#end{${endStyles}}`))

  // get properties that exist in both start and end declarations
  const applicableProperties = intersectionBy(
    startDeclarations.map(d => d.property),
    endDeclarations.map(d => d.property)
  )

  // get the last declaration from both start and end declarations for the applicable properties
  const applicableDeclarations = applicableProperties.reduce((accu, prop) => {
    accu[prop] = {
      start: findLast(startDeclarations, (d => d.property === prop)),
      end: findLast(endDeclarations, (d => d.property === prop)),
    }
    return accu;
  }, {})

  const interpolate = {}

  const getApplicableValues = (startValues, endValues) => {
    const applicableValues = []

    if (startValues.length === endValues.length) {
      for (let i = 0; i < startValues.length; i++) {
        const startValue = startValues[i]
        const endValue = endValues[i]
        if (startValue.type === endValue.type) {
          switch (startValue.type) {
            case 'WhiteSpace':
              applicableValues.push({ type: startValue.type })
              break
            case 'Operator':
              applicableValues.push({ type: startValue.type, value: startValue.value })
              break
            case 'Identifier':
              if (startValue.name === endValue.name) {
                applicableValues.push({ type: startValue.type, name: startValue.name })
              }
              break
            case 'Dimension':
              if (startValue.unit === endValue.unit) {
                applicableValues.push({ type: startValue.type, unit: startValue.unit, start: startValue.value, end: endValue.value })
              }
              break
            case 'Number':
            case 'HexColor':
              applicableValues.push({ type: startValue.type, start: startValue.value, end: endValue.value })
              break
            case 'Function':
              const fStartValues = startValue.children.toArray();
              const fEndValues = endValue.children.toArray();
              const aplv = getApplicableValues(fStartValues, fEndValues)
              if (aplv.length === fStartValues.length) {
                applicableValues.push({ type: startValue.type, name: startValue.name, values: aplv })
              }
              break
            default:
              // Identifier
              console.log(`unknown type: ${startValue.type}`)
          }
        }
      }
    }

    return applicableValues;
  }

  // check if corresponding, interpolateable values exist
  Object.keys(applicableDeclarations).forEach(prop => {
    console.log(`${prop} start`)
    const startValues = applicableDeclarations[prop].start.value.children.toArray()
    startValues.forEach(val => console.dir(val))
    console.log(`${prop} end`)
    const endValues = applicableDeclarations[prop].end.value.children.toArray()
    endValues.forEach(val => console.dir(val))

    const applicableValues = getApplicableValues(startValues, endValues)
    if (applicableValues.length === startValues.length) {
      interpolate[prop] = applicableValues
    }
  })

  console.log(`\n\n\n==========\n`)
  console.dir(interpolate, { depth: null })

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

spring(`
  left: 10px;
  right: 2em;
  padding: 0em 0em 10px 10rem;
  opacity: 0;
  opacity: .5;
  transform: translate(10px 3em) rotate(25deg) scale(.5);
  background: rgba(0, 255, 0, .5);
  border: 1px solid #f00;
`, `
  left: 20px;
  right: 1em;
  padding: 10em 10em 0px 20rem;
  opacity: 1;
  transform: translate(5px 2em) rotate(15deg) scale(1);
  background: rgba(255, 0, 0, .1);
  border: 3px solid #0f0;
`)

// console.time('interpolate 2')
// spring(
//   { 'margin-left': `250px`, border: '1px solid #f00' },
//   { 'margin-left': 0, border: '10px solid #bada55' },
//   { preset: 'gentle' },
// )
// console.timeEnd('interpolate 2')

export { toString }
export default spring
