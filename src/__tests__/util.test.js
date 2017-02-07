import {
  addValueToProperty,
  appendToKeys,
  calculateObsoleteFrames,
  calculateObsoleteValues,
  getInterpolator,
  omitEmptyValues,
  toString,
} from '../util'

describe('util', () => {
  describe('getInterpolator', () => {
    test('returns interpolator method that takes 3 params', () => {
      const interpolate = getInterpolator(180, 12)
      expect(interpolate.length).toEqual(3)
    })
    test('interpolator method returns an array of 101 values', () => {
      const interpolate = getInterpolator(180, 12)
      const values = interpolate(0, 100)
      expect(values).toEqual(expect.any(Array))
      expect(values.length).toEqual(101)
    })
  })

  describe('addValueToProperty', () => {
    test('defaults to empty object', () => {
      expect(addValueToProperty({}.foo, 'bar', 'baz'))
        .toEqual({ bar: 'baz' })
    })
    test('adds property besides other properties', () => {
      expect(addValueToProperty({ foo: 'bar' }, 'baz', 'qux'))
        .toEqual({ foo: 'bar', baz: 'qux' })
    })
    test('adds value to array with existing values', () => {
      expect(addValueToProperty({ foo: 'bar' }, 'foo', 'baz'))
        .toEqual({ foo: [ 'bar', 'baz' ]})
    })
  })

  describe('calculateObsoleteValues', () => {
    test('calculates the obsolete values', () => {
      const data = {
        0: { 'margin-left': '0px', border: [ '1px', 'solid', '#f00' ]},
        1: { 'margin-left': '1px', border: [ '2px', 'solid', '#f00' ]},
        2: { 'margin-left': '1px', border: [ '2px', 'solid', '#f00' ]},
        3: { 'margin-left': '2px', border: [ '2px', 'solid', '#f00' ]},
        4: { 'margin-left': '2px', border: [ '3px', 'solid', '#f00' ]},
        5: { 'margin-left': '2px', border: [ '3px', 'solid', '#f00' ]},
        6: { 'margin-left': '3px', border: [ '3px', 'solid', '#f00' ]},
        7: { 'margin-left': '3px', border: [ '3px', 'solid', '#f00' ]},
      }

      expect(calculateObsoleteValues(data)).toEqual({
        border: [ 2, 5, 6 ],
        'margin-left': [ 4 ],
      })
    })
  })

  describe('calculateObsoleteFrames', () => {
    test('calculates the obsolete frames', () => {
      const data = [
        { 'margin-left': '0px', border: [ '1px', 'solid', '#f00' ]},
        { 'margin-left': '1px', border: [ '2px', 'solid', '#f00' ]},
        { 'margin-left': '1px', border: [ '2px', 'solid', '#f00' ]},
        { 'margin-left': '2px', border: [ '2px', 'solid', '#f00' ]},
        { 'margin-left': '2px', border: [ '3px', 'solid', '#f00' ]},
        { 'margin-left': '2px', border: [ '3px', 'solid', '#f00' ]},
        { 'margin-left': '3px', border: [ '3px', 'solid', '#f00' ]},
        { 'margin-left': '3px', border: [ '3px', 'solid', '#f00' ]},
      ]

      expect(calculateObsoleteFrames(data, 'border')).toEqual([ 2, 5, 6 ])
      expect(calculateObsoleteFrames(data, 'margin-left')).toEqual([ 4 ])
    })
  })

  describe('appendToKeys', () => {
    test('appends string to every key', () => {
      const appended = appendToKeys({ 0: 0, 1: 1, 2: 2 }, '%')

      expect(Object.keys(appended))
        .toEqual([ '0%', '1%', '2%' ])
    })
  })

  describe('omitEmptyValues', () => {
    test('omits empty values', () => {
      const omitted = omitEmptyValues({
        '0%': { opacity: 0, left: '20px' },
        '1%': {},
        '100%': { opacity: 1, left: '200px' },
      })

      expect(Object.keys(omitted))
        .toEqual([ '0%', '100%' ])
    })
  })

  describe('toString', () => {
    test('returns formatted css string', () => {
      const formatted = toString({
        '0%': { opacity: 0, left: '20px' },
        '100%': { opacity: 1, left: '200px' },
      })

      expect(formatted)
        .toEqual('0%{opacity:0;left:20px;}100%{opacity:1;left:200px;}')
    })
  })
})
