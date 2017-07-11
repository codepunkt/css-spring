const { walk, parse } = require('css-tree')

// returns top-level declarations
const getDeclarations = styles => {
  const result = []
  const randomNumber = Math.floor(Math.random() * 1e5)

  walk(parse(`#random${randomNumber}{${styles}}`), function(node) {
    if (node.type === 'Declaration') {
      const selector = this.rule.selector.children.first().children.first()
      if (
        selector.type === 'IdSelector' &&
        selector.name === `random${randomNumber}`
      ) {
        result.push(node)
      }
    }
  })

  return result
}

module.exports = getDeclarations
