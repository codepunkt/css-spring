import { getAnimatableProps } from '../parse'

describe('getAnimatableProps', () => {
  test('omits keys that do not exist in both startProps and endProps', () => {
    const animatableProps = getAnimatableProps(
      { left: '0px', opacity: 1, foo: 'bar' },
      { left: '20px', opacity: 0, baz: 'qux' },
    )
    expect(Object.keys(animatableProps)).toEqual([ 'left', 'opacity' ])
  })

  test('omits keys whose values are not matched by numeric regexp', () => {
    const animatableProps = getAnimatableProps(
      { left: '0px', opacity: 1, foo: true },
      { left: '20px', opacity: 0, foo: 20 },
    )
    expect(Object.keys(animatableProps)).toEqual([ 'left', 'opacity' ])
  })

  test('omits keys whose units do not match in both startProps and endProps', () => {
    const animatableProps = getAnimatableProps(
      { left: '0px', opacity: 1, foo: '20px' },
      { left: '20px', opacity: 0, foo: '20em' },
    )
    expect(Object.keys(animatableProps)).toEqual([ 'left', 'opacity' ])
  })

  test('returns an object with unit, start and end values for each remaining key', () => {
    const animatableProps = getAnimatableProps(
      { left: '0px', opacity: 1 },
      { left: '20px', opacity: 0 },
    )
    expect(animatableProps).toEqual({
      left: { start: 0, end: 20, unit: 'px' },
      opacity: { start: 1, end: 0, unit: '' },
    })
  })
})
