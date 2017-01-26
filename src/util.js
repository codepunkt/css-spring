export const mapValues = (object, iteratee) => {
  const result = {}
  for (let key in object) {
    result[key] = iteratee(object[key], key, object)
  }
  return result
}
