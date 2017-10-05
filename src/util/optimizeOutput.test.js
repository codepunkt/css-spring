import optimizeOutput, { removeConsecutiveValues } from './optimizeOutput'

describe('removeConsecutiveValues', () => {
  test('removes consecutive values', () => {
    expect(
      removeConsecutiveValues({
        foo: { val: 1 },
        bar: { val: 1 },
        baz: { val: 1 },
        qux: { val: 2 },
      })
    ).toEqual({
      foo: { val: 1 },
      bar: {},
      baz: { val: 1 },
      qux: { val: 2 },
    })
  })
})
