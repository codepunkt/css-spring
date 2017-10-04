const assignValues = (obj, values) => Object.assign(obj, { values })

const addInterpolatedValues = (interpolator, parts, precision) =>
  parts.map(part => {
    switch (part.type) {
      case 'Function':
        return assignValues(
          part,
          addInterpolatedValues(interpolator, part.values, precision)
        )
      case 'Dimension':
        return assignValues(
          part,
          interpolator
            .number(part.start, part.end)
            .map(v => `${v.toFixed(precision)}${part.unit}`)
        )
      case 'Number':
        return assignValues(
          part,
          interpolator
            .number(part.start, part.end)
            .map(v => v.toFixed(precision))
        )
      case 'HexColor':
        return assignValues(part, interpolator.hex(part.start, part.end))
      case 'Fixed':
        return assignValues(part, interpolator.fixed(part.value))
      default:
        return part
    }
  })

module.exports = (interpolator, values, precision) => {
  for (let [key, value] of Object.entries(values)) {
    values[key] = addInterpolatedValues(interpolator, value, precision)
  }

  return values
}
