import { isEmpty, omitBy } from 'lodash'

export const removeConsecutiveValues = keyframes => {
  const last = {}
  const beforeLast = {}

  for (let percentage of Object.keys(keyframes)) {
    const keyframe = keyframes[percentage]
    for (let property of Object.keys(keyframe)) {
      const value = keyframe[property]
      if (
        last[property] &&
        beforeLast[property] &&
        last[property].value === value &&
        beforeLast[property].value === value
      ) {
        delete keyframes[last[property].percentage][property]
      }
      beforeLast[property] = last[property]
      last[property] = { percentage, value }
    }
  }

  return keyframes
}

const optimizeOutput = keyframes => {
  return omitBy(removeConsecutiveValues(keyframes), isEmpty)
}

export default optimizeOutput
