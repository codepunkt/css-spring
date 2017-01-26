import stepper from './stepper'
import { mapValues } from './util'
import { getAnimatableProps } from './props'

const presets = {
  noWobble: { stiffness: 170, damping: 26 },
  gentle: { stiffness: 120, damping: 14 },
  wobbly: { stiffness: 180, damping: 12 },
  stiff: { stiffness: 210, damping: 20 },
}

// default spring options.
// damping and precision reflect the values of the `wobbly` preset,
// precision defaults to 3 which should be a good tradeoff between
// animation detail and resulting filesize.
const defaultOptions = {
  stiffness: 180,
  damping: 12,
  precision: 3,
}

export const spring = (startProps, endProps, options = {}) => {
  // define stiffness, damping and precision based on default options
  // and options given in arguments.
  const { stiffness, damping, precision } = Object.assign(
    {},
    defaultOptions,
    options,
    presets[options.preset] || {}
  )

  const animatableProps = getAnimatableProps(startProps, endProps)
  const startValues = mapValues(animatableProps, ({ start }) => start)
  const endValues = mapValues(animatableProps, ({ end }) => end)

  const addUnits = (object) =>
    mapValues(object, (v, k) => `${v}${animatableProps[k].unit}`)

  const keyframes = {
    '0%': addUnits(startValues),
    '100%': addUnits(endValues),
  }

  Object.keys(startValues).forEach((key) => {
    let velocity = 0
    let value = startValues[key]
    const end = endValues[key]

    for (let i = 1; i < 100; i += 1) {
      [ value, velocity ] = stepper(0.01, value, velocity, end, stiffness, damping)
      const percent = `${i}%`
      keyframes[percent] = Object.assign(
        keyframes[percent] || {},
        { [key]: `${+value.toFixed(precision)}${animatableProps[key].unit}` }
      )
    }
  })

  return keyframes
}

// console.log(spring({
//   left: '10px',
//   right: '20em',
//   foo: 'bar',
//   opacity: 0,
//   rotate: '5deg'
// }, {
//   left: '20px',
//   right: '30em',
//   baz: true,
//   opacity: 1,
//   rotate: '10deg'
// }, {
//   preset: 'noWobble'
// }))

export { default as toString } from './to-string'
export default spring
