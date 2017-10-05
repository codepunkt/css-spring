import addInterpolatedValues, { assignValues } from './addInterpolatedValues'

export const assigValues = (obj, values) => Object.assign(obj, { values })

describe('assignValues', () => {
  test('assigns values', () => {
    expect(assignValues({ foo: 'bar' }, 'meh')).toEqual({
      foo: 'bar',
      values: 'meh',
    })
  })
})

describe('addInterpolatedValue', () => {
  const mockInterpolator = {
    steps: 2,
    hex: (start, end) => [start, end],
    number: (start, end) => [start, end],
    fixed: value => [value, value],
  }

  test('adds interpolated values', () => {
    expect(
      addInterpolatedValues(
        mockInterpolator,
        {
          border: [
            { type: 'Dimension', start: 0, end: 250, unit: 'px' },
            { type: 'Fixed', value: ' solid ' },
            { type: 'HexColor', start: '#f00', end: '#0f0' },
          ],
          transform: [
            {
              type: 'Function',
              name: 'scale',
              values: [
                {
                  type: 'Number',
                  start: 1,
                  end: 2,
                },
              ],
            },
          ],
        },
        2
      )
    ).toMatchSnapshot()
  })

  test('throws on unknown type', () => {
    expect(() =>
      addInterpolatedValues(
        mockInterpolator,
        {
          border: [{ type: 'Dummy' }],
        },
        2
      )
    ).toThrow()
  })
})
