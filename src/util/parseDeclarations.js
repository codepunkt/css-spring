const { walk, parse } = require('css-tree')

// returns top-level declarations
const parseDeclarations = styles => {
  const result = []
  const randomNumber = Math.floor(Math.random() * 1e5)

  walk(parse(`#random${randomNumber}{${styles}}`), function(node) {
    if (node.type === 'Declaration') {
      const s = this.rule.selector.children.first().children.first()
      if (s.type === 'IdSelector' && s.name === `random${randomNumber}`) {
        result.push(node)
      }
    }
  })

  return result
}

export default parseDeclarations
