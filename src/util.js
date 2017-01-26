export const mapValues = (object, iteratee) => {
  const result = {}
  for (let key in object) {
    if ({}.hasOwnProperty.call(object, key)) {
      result[key] = iteratee(object[key], key, object)
    }
  }
  return result
}
