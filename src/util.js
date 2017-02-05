import {
  compact,
  isEmpty,
  map,
  mapKeys,
  negate,
  pickBy,
  reduce,
} from 'lodash'

import interpolate from './interpolate'

// returns interpolation method based on stiffness and damping.
export const getInterpolator = (stiffness, damping) => {
  // interpolation method is invoked with start and end values and returns
  // an array consisting of start, 99 interpolated values inbetween and end.
  return (value, end, velocity) => {
    const interpolated = [ value, ...Array(99), end ]

    return map(interpolated, () => {
      [ value, velocity ] = interpolate(0.01, value, velocity || 0, end, stiffness, damping)
      return value
    })
  }
}

// adds a value to an objects property.
// when a property value exists, forms an array of values.
export const addValueToProperty = (obj = {}, prop, value) => {
  return Object.assign(obj, {
    [prop]: obj[prop] === undefined ? value : [].concat(obj[prop], value),
  })
}

// based on an array with interpolated values for a property, return
// an array with indices that are obsolete.
export const calculateObsoleteFrames = (arr, prop) => {
  return compact(map(arr, (value, i, arr) => {
    const current = JSON.stringify(value[prop])
    const previous = JSON.stringify((arr[i - 1] || {})[prop])
    const next = JSON.stringify((arr[i + 1] || {})[prop])

    // when the current value equals the previous and the next one
    // mark the current value as obsolete
    return current === next && current === previous ? i : null
  }))
}

// calculate obsolete values based on an array of properties and
export const calculateObsoleteValues = (keyframes) => {
  return reduce(Object.keys(keyframes[0]), (accumulator, property) => {
    return Object.assign(accumulator, {
      [property]: calculateObsoleteFrames(Object.values(keyframes), property),
    })
  }, {})
}

// append a string to every key of an object
export const appendToKeys = (obj, suffix) => {
  return mapKeys(obj, (_, key) => `${key}${suffix}`)
}

// omit all properties with empty values from an object
export const omitEmptyValues = (obj) => {
  return pickBy(obj, (value) => negate(isEmpty)(value))
}

// format keyframe styles to string
export const toString = (keyframes) => {
  return Object.keys(keyframes).reduce((outer, perc) => {
    const value = Object.keys(keyframes[perc]).reduce((inner, prop) => {
      return `${inner}${prop}:${keyframes[perc][prop]};`
    }, '')
    return `${outer}${perc}{${value}}`
  }, '')
}
