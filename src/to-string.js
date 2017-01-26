const defaultFormatter = (key, value) => `${key}:${value};`

export const reduceProperties = (props, formatter = defaultFormatter) => {
  return Object.keys(props).reduce((acc, prop) => {
    return `${acc}${formatter(prop, props[prop])}`
  }, '')
}

export const toString = (keyframes, formatter = defaultFormatter) => {
  return Object.keys(keyframes).reduce((outer, perc) => {
    const value = reduceProperties(keyframes[perc], formatter)
    return `${outer}${perc}{${value}}`
  }, '')
}


export default toString
