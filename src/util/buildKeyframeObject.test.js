import buildKeyframeObject, {
  addOrApppend,
  getFunctionValue,
} from './buildKeyframeObject'

describe('addOrApppend', () => {
  test('adds key/value to object when key doesnt exist', () => {
    expect(addOrApppend({}, 'foo', 'bar')).toEqual({ foo: 'bar' })
  })

  test('appends value to existing key on object', () => {
    expect(addOrApppend({ foo: 'wat' }, 'foo', 'bar')).toEqual({
      foo: 'watbar',
    })
  })
})

describe('getFunctionValue', () => {
  test('concatenates values at given index', () => {
    expect(
      getFunctionValue(
        [
          { values: ['0px', '200px'] },
          { values: [' solid ', ' solid '] },
          { values: ['#f00', '#0f0'] },
        ],
        1
      )
    ).toEqual('200px solid #0f0')
  })

  test('uses empty string when values is not available', () => {
    expect(
      getFunctionValue(
        [
          { values: ['0px', '200px'] },
          { alues: [' solid ', ' solid '] },
          { values: ['#f00', '#0f0'] },
        ],
        1
      )
    ).toEqual('200px#0f0')
  })
})

describe('buildKeyfameObject', () => {
  test('wat', () => {
    expect(
      buildKeyframeObject(
        {
          border: [
            { type: 'Dimension', unit: 'px', values: [0, 250] },
            { type: 'Fixed', values: [' solid ', ' solid '] },
            { type: 'HexColor', values: ['#00f', '#ff0'] },
          ],
          transform: [
            {
              type: 'Function',
              name: 'scale',
              values: [{ type: 'Number', values: [1, 2.25] }],
            },
            { type: 'Unknown', values: [NaN, NaN] },
          ],
        },
        ['0%', '100%']
      )
    ).toMatchSnapshot()
  })
})
