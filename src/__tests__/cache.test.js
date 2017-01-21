import { initCache, getAnimatedProps } from '../cache'

describe('cache', () => {
  test('getAnimatedProps excludes props that do not exist in both start and target', () => {
    expect(
      getAnimatedProps({ foo: 1, bar: 2 }, { bar: 2, baz: 3 })
    ).toEqual(
      [ 'bar' ]
    )
  })

  test('getAnimatedProps excludes props which values can not be parsed to a float', () => {
    expect(
      getAnimatedProps(
        { foo: '2px', bar: 2, baz: 'px2' },
        { foo: 42, bar: true, baz: '1337' },
      )
    ).toEqual(
      [ 'foo' ]
    )
  })

  test('initCache initializes cache', () => {
    expect(
      initCache(
        { foo: '2px', bar: 2 },
        { foo: 42.5, bar: '13' },
      )
    ).toEqual(
      {
        foo: { cache: { value: 2, velocity: 0 }, start: 2, target: 42.5 },
        bar: { cache: { value: 2, velocity: 0 }, start: 2, target: 13 },
      }
    )
  })
})
