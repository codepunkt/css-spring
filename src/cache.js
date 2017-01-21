export const getAnimatedProps = (start, target) =>
  Object.keys(start).reduce((acc, key) => {
    if (!isNaN(parseFloat(start[key])) && !isNaN(parseFloat(target[key]))) {
      acc.push(key)
    }
    return acc
  }, [])

export const initCache = (start, target) =>
  getAnimatedProps(start, target).reduce((acc, key) =>
    Object.assign(acc, {
      [key]: {
        cache: { value: parseFloat(start[key]), velocity: 0 },
        start: parseFloat(start[key]),
        target: parseFloat(target[key]),
      },
    })
  , {})
