const addOrApppend = (obj, key, value) =>
  Object.assign(obj, {
    [key]: `${obj[key] || ''}${value}`,
  })

const getFunctionValue = (values, step) =>
  values.map(part => (part.values ? part.values[step] : '')).join('')

const buildKeyframeObject = (obj, keyframePercentages) => {
  let result = {}
  for (let i = 0; i < keyframePercentages.length; i++) {
    const element = keyframePercentages[i]
    result[element] = {}

    for (let [key, value] of Object.entries(obj)) {
      result[element] = value.reduce((accu, part) => {
        switch (part.type) {
          case 'Dimension':
          case 'Fixed':
          case 'HexColor':
          case 'Number':
            return addOrApppend(result[element], key, part.values[i])
          case 'Function':
            return addOrApppend(
              result[element],
              key,
              `${part.name}(${getFunctionValue(part.values, i)})`
            )
        }
        return result[element]
      }, result[element])
    }
  }
  return result
}

module.exports = buildKeyframeObject
