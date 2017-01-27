import { isArray, mapKeys, mapValues, pickBy } from 'lodash'
import stepper from './stepper'
import { combine } from './values'
import { getAnimatableProps } from './parse'

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

export const appendUnits = (object, units) =>
  mapValues(object, (value, key) => {
    return isArray(value)
      ? value.map((value, i) => `${value}${units[key][i]}`)
      : `${value}${units[key]}`
  })

// @todo comment
const buildInterpolation = (stiffness, damping) => {
  return (start, end) => {
    const interpolated = []
    const interpolateArray = isArray(start)
    let value = interpolateArray ? start[0] : start
    let velocity = 0

    for (let i = 1; i < 100; i += 1) {
      if (interpolateArray) {
        let something
        for (let j = 0; j < start.length; j += 1) {
          something = [];
          [ value, velocity ] = stepper(0.01, value, velocity, end[j], stiffness, damping)
          something.push(value)
        }
        interpolated.push(something)
      } else {
        [ value, velocity ] = stepper(0.01, value, velocity, end, stiffness, damping)
        interpolated.push(value)
      }
    }

    return [].concat(start, interpolated, end)
  }
}

export const spring = (startProps, endProps, options = {}) => {
  let result = {}

  // define stiffness, damping and precision based on default options
  // and options given in arguments.
  const { stiffness, damping, precision } = Object.assign(
    {},
    defaultOptions,
    options,
    presets[options.preset] || {}
  )

  // build an interpolation function based on the given stiffness and
  // damping values
  const interpolate = buildInterpolation(stiffness, damping)

  // @todo comment!
  const data = getAnimatableProps(startProps, endProps)
  data.forEach(({ prop, unit, start, end }) => {
    interpolate(start, end).forEach((interpolated, i) => {
      // round to desired precision (except when interpolating pixels)
      const value = Number(interpolated.toFixed(unit === 'px' ? 0 : precision))
      // when the value is 0, there's no need to add a unit.
      const valueWithUnit = value === 0 ? value : `${value}${unit}`

      if (result[i] === undefined) {
        result[i] = { [prop]: valueWithUnit }
      } else {
        result[i][prop] = result[i][prop] === undefined
          ? valueWithUnit
          : [].concat(result[i][prop], valueWithUnit)
      }
    })
  })

  // iterate over the result object, combining values and identifying
  // equal frames to be able to eliminate duplicates in a later step
  let prevFrame
  const obsoleteFrames = []
  Object.keys(result).forEach((i) => {
    const currentFrame = JSON.stringify(result[i])
    result[i] = mapValues(result[i], (value, key) => combine(key, value))
    if (prevFrame === currentFrame) {
      obsoleteFrames.push(i - 1)
    }
    prevFrame = currentFrame
  })

  // remove obsolute frames to reduce size and add % to keys
  // @todo might chain this - not using chain.
  // @see https://medium.com/making-internets/why-using-chain-is-a-mistake-9bc1f80d51ba
  result = mapKeys(
    pickBy(result, (value, key) => obsoleteFrames.indexOf(Number(key)) < 0),
    (value, key) => `${key}%`
  )

  console.log(result)
  return result
}

spring({
  left: '10px',
  right: '20px',
  padding: '0 0 10px 10rem',
}, {
  left: '20px',
  right: 0,
  padding: '10em 10em 0 20rem',
}, {
  preset: 'noWobble',
})

export { default as toString } from './to-string'
export default spring
