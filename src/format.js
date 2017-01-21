const unitFormatter = (unit) =>
  (key, value) =>
    `${key}:${value}${unit};`

export const reduceProperties = (props, formatter) => {
  return Object.keys(props).reduce((acc, prop) => {
    return `${acc}${formatter(prop, props[prop])}`
  }, '')
}

const format = (keyframes, formatter = format.PX_FORMATTER) => {
  return Object.keys(keyframes).reduce((outer, perc) => {
    const value = reduceProperties(keyframes[perc], formatter)
    return `${outer}${perc}{${value}}`
  }, '')
}

[ 'em', 'rem', 'px' ].forEach((unit) => {
  format[`${unit.toUpperCase()}_FORMATTER`] = unitFormatter(unit)
})

export default format
