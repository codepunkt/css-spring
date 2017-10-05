const { walk, parse } = require('css-tree')

// returns top-level declarations
const parseDeclarations = styles => {
  const result = []
  const randomNumber = Math.floor(Math.random() * 1e5)

  walk(parse(`#random${randomNumber}{${styles}}`), function(node) {
    if (node.type === 'Declaration') {
      result.push(node)
    }
  })

  return result
}

export default parseDeclarations
