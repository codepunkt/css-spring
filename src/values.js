import { isArray } from 'lodash'

const combinedValues = [
  '-moz-outline-radius',
  '-webkit-text-stroke',
  'background',
  'border',
  'border-bottom',
  'border-color',
  'border-left',
  'border-radius',
  'border-right',
  'border-spacing',
  'border-top',
  'border-width',
  'outline',
  'padding',
]

export const splitAtSpaces = (string) => {
  const arr = string.split(' ')
  return arr.length === 1 ? arr[0] : arr
}

export const joinWithSpace = (input) => {
  return isArray(input) ? input.join(' ') : input
}

export const getSeparator = (key) => {
  if (combinedValues.indexOf(key) >= 0) {
    return splitAtSpaces
  }
}

export const getCombiner = (key) => {
  if (combinedValues.indexOf(key) >= 0) {
    return joinWithSpace
  }
}

export const split = (key, value) => {
  const separator = getSeparator(key)
  return separator ? separator(value) : value
}

export const combine = (key, value) => {
  const combiner = getCombiner(key)
  return combiner ? combiner(value) : value
}
