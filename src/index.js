const { walk, parse } = require('css-tree')
const { findLast, intersectionBy, map } = require('lodash')
const sanitizeValues = require('./util/sanitizeValues')
const getDeclarations = require('./util/getDeclarations')
const getPropertyValues = require('./util/getPropertyValues')
const getInterpolator = require('./util/getInterpolator')

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

  const values = sanitizeValues(
    getPropertyValues(getDeclarations(startStyles), getDeclarations(endStyles))
  )
  // console.dir(values, { depth: null })

  const arghl1 = valueParts =>
    valueParts.map(part => {
      switch (part.type) {
        case 'Function':
          return Object.assign(part, { values: arghl1(part.values) })
        case 'Dimension':
        case 'Number':
          return Object.assign(part, {
            values: interpolate(part.start, part.end),
          })
        default:
          return part
      }
    })

  const arghl2 = valueParts =>
    valueParts.reduce(
      (accu, part) => {
        return accu.map((e = '', i) => {
          switch (part.type) {
            case 'Function':
              console.log(part.values)
              return `${e}${arghl2(part.values)}`
            case 'Dimension':
              return `${e}${part.values[i]}${part.unit}`
            case 'Number':
              return `${e}${part.values[i]}`
          }
          return `${e}${part.value}`
        })
      },
      [...Array(interpolate.steps + 1)]
    )

  const interpolate = getInterpolator(0.5, 0.5)
  const styl = [...Array(interpolate.steps + 1)].reduce(
    (accu, e, i) => Object.assign(accu, { [i * 100 / interpolate.steps]: {} }),
    {}
  )
  for (let [property, valueParts] of Object.entries(values)) {
    values[property] = arghl1(valueParts)
    arghl2(values[property])
  }

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
  // left: 10px;
  // right: 2em;
  // padding: 0em 0em 10px 10rem;
  // border: 1px solid #f00;
  // opacity: 0;
  // opacity: .5;
  `
  transform: translate(10px 3em) rotate(25deg) scale(.5)
`,
  // left: 20px;
  // right: 1em;
  // padding: 10em 10em 0px 20rem;
  // border: 3px solid #f00;
  // opacity: 1;
  `
  transform: translate(5px 2em) rotate(15deg) scale(1)
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
