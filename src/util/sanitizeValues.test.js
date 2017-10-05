import sanitizeValues, { getAnimatableValues } from './sanitizeValues'

describe('getAnimatableValues', () => {
  test('cant animate values of different types', () => {
    expect(
      getAnimatableValues(
        [{ type: 'Dimension', value: '100', unit: 'px' }],
        [{ type: 'Number', value: '0' }]
      )
    ).toEqual([])
  })

  test('cant animate dimensions with different units', () => {
    expect(
      getAnimatableValues(
        [{ type: 'Dimension', value: '100', unit: 'em' }],
        [{ type: 'Dimension', value: '0', unit: 'px' }]
      )
    ).toEqual([])
  })

  test('cant animate operators with different values', () => {
    expect(
      getAnimatableValues(
        [{ type: 'Operator', value: '+' }],
        [{ type: 'Operator', value: '-' }]
      )
    ).toEqual([])
  })

  test('cant animate identifiers with different names', () => {
    expect(
      getAnimatableValues(
        [{ type: 'Identifier', name: 'solid' }],
        [{ type: 'Identifier', name: 'dashed' }]
      )
    ).toEqual([])
  })

  test('cant animate unknown types', () => {
    expect(
      getAnimatableValues(
        [{ type: 'Wat', foo: 'bar' }],
        [{ type: 'Wat', foo: 'baz' }]
      )
    ).toEqual([])
  })

  test('converts whitespace to fixed', () => {
    expect(
      getAnimatableValues([{ type: 'WhiteSpace' }], [{ type: 'WhiteSpace' }])
    ).toEqual([{ type: 'Fixed', value: ' ' }])
  })

  test('converts operator with same value to fixed', () => {
    expect(
      getAnimatableValues(
        [{ type: 'Operator', value: '+' }],
        [{ type: 'Operator', value: '+' }]
      )
    ).toEqual([{ type: 'Fixed', value: '+' }])
  })

  test('converts identifier with same name to fixed', () => {
    expect(
      getAnimatableValues(
        [{ type: 'Identifier', name: 'solid' }],
        [{ type: 'Identifier', name: 'solid' }]
      )
    ).toEqual([{ type: 'Fixed', value: 'solid' }])
  })

  test('converts number with same value to fixed', () => {
    expect(
      getAnimatableValues(
        [{ type: 'Number', value: '10' }],
        [{ type: 'Number', value: '10' }]
      )
    ).toEqual([{ type: 'Fixed', value: '10' }])
  })

  test('prepares dimensions with the same unit', () => {
    expect(
      getAnimatableValues(
        [{ type: 'Dimension', value: '100', unit: 'px' }],
        [{ type: 'Dimension', value: '0', unit: 'px' }]
      )
    ).toEqual([{ type: 'Dimension', unit: 'px', start: 100, end: 0 }])
  })

  test('prepares numbers', () => {
    expect(
      getAnimatableValues(
        [{ type: 'Number', value: '70' }],
        [{ type: 'Number', value: '80' }]
      )
    ).toEqual([{ type: 'Number', start: 70, end: 80 }])
  })

  test('prepares hex values', () => {
    expect(
      getAnimatableValues(
        [{ type: 'HexColor', value: '#bada55' }],
        [{ type: 'HexColor', value: '#c0ff33' }]
      )
    ).toEqual([{ type: 'HexColor', start: '#bada55', end: '#c0ff33' }])
  })

  test('parses function children', () => {
    expect(
      getAnimatableValues(
        [
          {
            type: 'Function',
            name: 'translate',
            children: { toArray: () => [{ type: 'Number', value: '100' }] },
          },
        ],
        [
          {
            type: 'Function',
            name: 'translate',
            children: { toArray: () => [{ type: 'Number', value: '250' }] },
          },
        ]
      )
    ).toEqual([
      {
        type: 'Function',
        name: 'translate',
        values: [{ type: 'Number', start: 100, end: 250 }],
      },
    ])
  })

  test('compares length of parsed children', () => {
    expect(
      getAnimatableValues(
        [
          {
            type: 'Function',
            name: 'translate',
            children: {
              toArray: () => [
                { type: 'Number', value: '100' },
                { type: 'Dimension', value: '5', unit: 'mm' },
              ],
            },
          },
        ],
        [
          {
            type: 'Function',
            name: 'translate',
            children: {
              toArray: () => [
                { type: 'Number', value: '250' },
                { type: 'Dimension', value: '47', unit: 'rem' },
              ],
            },
          },
        ]
      )
    ).toEqual([])
  })
})

describe('sanitizeValues', () => {
  test('removes non-animatable properties', () => {
    expect(
      sanitizeValues({
        borderLeft: {
          start: [
            { type: 'Dimension', value: '3', unit: 'px' },
            { type: 'WhiteSpace', value: ' ' },
            { type: 'Identifier', name: 'solid' },
            { type: 'WhiteSpace', value: ' ' },
            { type: 'HexColor', value: '#f00' },
          ],
          end: [
            { type: 'Dimension', value: '20', unit: 'px' },
            { type: 'WhiteSpace', value: ' ' },
            { type: 'Identifier', name: 'solid' },
            { type: 'WhiteSpace', value: ' ' },
            { type: 'HexColor', value: '#eee' },
          ],
        },
        left: {
          start: [{ type: 'Dimension', value: '20', unit: 'px' }],
          end: [{ type: 'Dimension', value: '1', unit: 'em' }],
        },
      })
    ).toEqual({
      borderLeft: [
        { type: 'Dimension', unit: 'px', start: 3, end: 20 },
        { type: 'Fixed', value: ' ' },
        { type: 'Fixed', value: 'solid' },
        { type: 'Fixed', value: ' ' },
        { type: 'HexColor', start: '#f00', end: '#eee' },
      ],
    })
  })
})
