const parse = require('css-tree/lib/parser') // function
const { walk } = require('css-tree/lib/walker')

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
