import stepper from './stepper'
import { initCache } from './cache'

const presets = {
  noWobble: { stiffness: 170, damping: 26 },
  gentle: { stiffness: 120, damping: 14 },
  wobbly: { stiffness: 180, damping: 12 },
  stiff: { stiffness: 210, damping: 20 },
}

const defaults = {
  stiffness: 170,
  damping: 26,
  precision: 3,
}

export const getKeyframes = (startProps, targetProps, options = {}) => {
  const { stiffness, damping, precision } = Object.assign(
    {}, defaults, options,
    presets[options.preset] || {}
  )

  const cache = initCache(startProps, targetProps)
  const steps = { '0%': Object.keys(cache).reduce((accu, key) => {
    return Object.assign(accu, { [key]: cache[key].start })
  }, {})}

  for (let i = 1; i < 101; i += 1) {
    const props = {}
    Object.keys(cache).forEach((key) => {
      const prop = cache[key]
      const [value, velocity] = stepper(0.01, prop.cache.value, prop.cache.velocity, parseFloat(prop.target), stiffness, damping)
      prop.cache = { value, velocity }
      props[key] = +(i === 100 ? prop.target : prop.cache.value).toFixed(precision)
    })
    steps[`${i}%`] = props
  }
  return steps
}

export { default as format } from './format';
export default getKeyframes
