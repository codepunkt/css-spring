import getInterpolator, {
  interpolateColor,
  toSixDigits,
} from './getInterpolator'

describe('toSixDigits', () => {
  test('duplicates each digit of a 3 digit hex', () => {
    expect(toSixDigits('f00')).toBe('ff0000')
    expect(toSixDigits('abc')).toBe('aabbcc')
  })

  test('works as identity otherwise', () => {
    expect(toSixDigits('f00f')).toBe('f00f')
    expect(toSixDigits(true)).toBe(true)
  })
})

describe('interpolateColor', () => {
  test('interpolates colors', () => {
    expect(interpolateColor('f00', '00f', 0)).toBe('#ff0000')
    expect(interpolateColor('f00', '00f', 0.5)).toBe('#7f007f')
    expect(interpolateColor('f00', '00f', 1)).toBe('#0000ff')
  })
})

describe('getInterpolator', () => {
  const interpolator = getInterpolator(0.5, 0.5, 10)

  test('interpolator provides interpolate methods', () => {
    expect(interpolator).toMatchObject({
      fixed: expect.any(Function),
      number: expect.any(Function),
      hex: expect.any(Function),
    })
  })

  test('interpolate methods', () => {
    expect(interpolator.fixed('solid')).toMatchSnapshot()
    expect(interpolator.number(0, 1)).toMatchSnapshot()
    expect(interpolator.hex('#f00', '#00f')).toMatchSnapshot()
  })
})
