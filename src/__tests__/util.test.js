import { mapValues } from '../util'

describe('utilities', () => {
  describe('mapValues', () => {
    test('calls iteratee for every key in object', () => {
      const expectNumberOfCalls = (obj, calls) => {
        const fn = jest.fn()
        mapValues(obj, fn)
        expect(fn.mock.calls.length).toEqual(calls)
      }

      expectNumberOfCalls({ foo: 1, bar: 2 }, 2)
      expectNumberOfCalls({ foo: 1, bar: 2, baz: 3 }, 3)
    })

    test('maps each value', () => {
      const mapped = mapValues({ foo: 1, bar: 2 }, (v) => 'wat')
      expect(mapped).toEqual({ foo: 'wat', bar: 'wat' })
    })
  })
})
