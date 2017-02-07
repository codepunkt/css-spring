import {
  combine,
  parseStyles,
  parseValues,
  split,
} from '../parse'

describe('parse', () => {
  describe('combine', () => {
    test('returns value for unknown properties', () => {
      expect(combine('foo', 'bar')).toEqual('bar')
    })
    test('returns value for non-array values', () => {
      expect(combine('border', 'bar')).toEqual('bar')
    })
    test('returns combined value for array values', () => {
      expect(combine('border', [ '1px', 'solid', '#f00' ])).toEqual('1px solid #f00')
    })
  })

  describe('parseStyles', () => {
    test('only parses properties that exist in both start and end styles', () => {
      expect(
        parseStyles({ margin: '0 0 10px 10px' }, { padding: '10px 10px 0 0' })
      ).toEqual([])
    })
    test('only parses properties that have the same number of values', () => {
      expect(
        parseStyles({ margin: '0 0 10px 10px' }, { margin: '10px 0 0' })
      ).toEqual([])
    })
    test('only parses properties where every start/end combination can be parsed', () => {
      expect(
        parseStyles({ margin: '0 0 10px 10px' }, { margin: '10px foo 0 0' })
      ).toEqual([])
    })
    test('returns parsed information object', () => {
      expect(
        parseStyles({ border: '0 solid #f00', opacity: 0 }, { border: '10px solid #f00', opacity: 1 })
      ).toEqual([
        { prop: 'border', start: 0, end: 10, unit: 'px' },
        { prop: 'border', fixed: 'solid' },
        { prop: 'border', fixed: '#f00' },
        { prop: 'opacity', start: 0, end: 1, unit: '' },
      ])
    })
  })

  describe('parseValues', () => {
    test('returns fixed when both values are equal', () => {
      expect(parseValues('solid', 'solid')).toEqual({ fixed: 'solid' })
    })
    test('returns undefined when one of the values is not numeric', () => {
      expect(parseValues('solid', '1px')).toEqual(undefined)
      expect(parseValues(0, '#f00')).toEqual(undefined)
    })
    test('returns start, end and unit otherwise', () => {
      expect(parseValues('1px', '10px')).toEqual({ start: 1, end: 10, unit: 'px' })
      expect(parseValues(0, 1)).toEqual({ start: 0, end: 1, unit: '' })
      expect(parseValues(0, '10rem')).toEqual({ start: 0, end: 10, unit: 'rem' })
      expect(parseValues('0px', 1)).toEqual({ start: 0, end: 1, unit: 'px' })
    })
  })

  describe('split', () => {
    test('returns value for unknown properties', () => {
      expect(split('foo', 'bar')).toEqual('bar')
    })
    test('returns value for non-splittable values', () => {
      expect(split('border', 'bar')).toEqual('bar')
    })
    test('returns splitted value otherwise', () => {
      expect(split('border', '1px solid #f00')).toEqual([ '1px', 'solid', '#f00' ])
    })
  })
})
