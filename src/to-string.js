const defaultFormatter = (key, value) => `${key}:${value};`

export const toString = (keyframes, formatter = defaultFormatter) => {
  return Object.keys(keyframes).reduce((outer, perc) => {
    const value = Object.keys(keyframes[perc]).reduce((acc, prop) => {
      return `${acc}${formatter(prop, keyframes[perc][prop])}`
    }, '')
    return `${outer}${perc}{${value}}`
  }, '')
}

export default toString
