const springer = require('springer').default

const steps = 10

// TODO: docs
const getInterpolator = (tension, wobble) => {
  const spring = springer(tension, wobble)
  const interpolator = (start, end) =>
    [...Array(steps + 1)].map(
      (_, i) => start + (end - start) * spring(i / steps)
    )
  interpolator.steps = steps
  return interpolator
}

module.exports = getInterpolator
