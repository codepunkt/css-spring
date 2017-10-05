import parseDeclarations from './parseDeclarations'

describe('parseDeclarations', () => {
  test('parses all toplevel declarations', () => {
    const declarations = parseDeclarations(
      'left:20px;transform:translate(20px 10rem);'
    )

    expect(declarations).toMatchObject(
      expect.arrayContaining([
        expect.objectContaining({
          property: 'left',
          type: 'Declaration',
        }),
        expect.objectContaining({
          property: 'transform',
          type: 'Declaration',
        }),
      ])
    )
  })
})
