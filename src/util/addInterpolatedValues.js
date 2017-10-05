import toPrecision from './toPrecision'

export const assignValues = (obj, values) => Object.assign(obj, { values })

export const addInterpolatedValue = (interpolator, parts, precision) =>
  parts.map(part => {
    switch (part.type) {
      case 'Function':
        return assignValues(
          part,
          addInterpolatedValue(interpolator, part.values, precision)
        )
      case 'Dimension':
        return assignValues(
          part,
          interpolator.number(part.start, part.end).map(v => {
            const rounded = toPrecision(v, precision, part.unit)
            return rounded === '0' ? '0' : `${rounded}${part.unit}`
          })
        )
      case 'Number':
        return assignValues(
          part,
          interpolator
            .number(part.start, part.end)
            .map(v => toPrecision(v, precision))
        )
      case 'HexColor':
        return assignValues(part, interpolator.hex(part.start, part.end))
      case 'Fixed':
        return assignValues(part, interpolator.fixed(part.value))
      default:
        throw new Error(`unknown value type: ${part.type}`)
    }
  })

const addInterpolatedValues = (interpolator, values, precision) => {
  for (let [key, value] of Object.entries(values)) {
    values[key] = addInterpolatedValue(interpolator, value, precision)
  }

  return values
}

export default addInterpolatedValues
